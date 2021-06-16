#include "dlog.h"
#include "utils.h"
#include "FaceDetector.h"

#include <thread>
#include <memory>
#include <iterator>
#include <vector>
#include <sys/stat.h>
#include <opencv2/core/types_c.h>
#include <opencv2/videoio.hpp>
#include <opencv2/imgproc.hpp>
#include <opencv2/objdetect.hpp>
#include <opencv2/face/facemarkLBF.hpp>
#include <tbb/pipeline.h>

using namespace std;
using namespace cv::face;
using namespace tbb;

FaceDetector::FaceDetector() {
    cvFaceCascade = shared_ptr<cv::CascadeClassifier>(new cv::CascadeClassifier());
}

FaceDetector::~FaceDetector() {

}

inline bool isFileExist (const std::string& name) {
    struct stat buffer{};
    return (stat (name.c_str(), &buffer) == 0);
}

bool FaceDetector::loadModels(const char *haarCascade, const char *modelLBF) {
    auto cascadePath = string(haarCascade);
    if(isFileExist(cascadePath)) {
        auto loadedHaarCascade = cvFaceCascade->load(cascadePath);
        if(loadedHaarCascade)
            LOGI("HaarCascade model found and loaded");
        else
            LOGW("HaarCascade model load failed");
    } else
        LOGW("HaarCascade model not found");
    auto modelLBFPath = string(modelLBF);
    if(isFileExist(modelLBFPath)) {
        FacemarkLBF::Params params;
        params.model_filename = modelLBFPath;
        params.cascade_face = cascadePath;
        cvFaceMark = FacemarkLBF::create(params);
        cvFaceMark->loadModel(modelLBFPath);
        auto loadedFacemarkLBF = !cvFaceMark->empty();
        if(loadedFacemarkLBF) {
            cvFaceMark->setFaceDetector(reinterpret_cast<FN_FaceDetector>(&FaceDetector::detect), this);
            LOGI("FacemarkLBF model found and loaded");
        } else
            LOGW("FacemarkLBF model load failed");
    } else
        LOGW("FacemarkLBF model not found");
    return true;
}

bool FaceDetector::detect(cv::InputArray image, cv::OutputArray faces, FaceDetector *cls) {

    std::vector<cv::Rect> faces_;
    std::vector<std::vector<cv::Point2f>> landmarks;
    cls->cvFaceCascade->detectMultiScale(image, faces_,
                                    1.3, 3, 0
//                                    |cv::CASCADE_FIND_BIGGEST_OBJECT
                                    //|CASCADE_DO_ROUGH_SEARCH
                                    |cv::CASCADE_SCALE_IMAGE,
                                 cv::Size(30, 30));
    cv::Mat(faces_).copyTo(faces);
    return true;
}

bool FaceDetector::isPipelineStop() const {
    return pipelineStop;
}

void FaceDetector::stopPipeline() {
    pipelineStop = true;
}

void FaceDetector::pipeline(cv::VideoCapture &cpt,
                            tbb::concurrent_bounded_queue<ProcessingChainData *> &queue) {
    using namespace cv;
    const static cv::Scalar colors[] = {
        Scalar(255,0,0),
        Scalar(0,255,0),
        Scalar(0,0,255),
    };
    parallel_pipeline(5,
        make_filter<void,ProcessingChainData*>(tbb::filter::serial_in_order, [&](tbb::flow_control& fc)->ProcessingChainData* {
            if(pipelineStop) {
                fc.stop();
                return nullptr;
            }
            Mat frame;
            cpt >> frame;
            if (frame.empty())
                return nullptr;
            auto pData = new ProcessingChainData;
            rotate(frame, frame, ROTATE_90_CLOCKWISE);
            pData->img = frame.clone();
            return pData;
        }) & tbb::make_filter<ProcessingChainData*,ProcessingChainData*>(tbb::filter::serial_in_order,
                                                                    [&](ProcessingChainData *pData)->ProcessingChainData* {
            if(pData == nullptr)
                return nullptr;
            cvtColor(pData->img, pData->gray, COLOR_BGR2GRAY);
            resize(pData->gray, pData->scaleHalf, Size(), .5f, .5f, INTER_LINEAR);
            equalizeHist(pData->scaleHalf, pData->scaleHalf);
            return pData;
        }) & tbb::make_filter<ProcessingChainData*,ProcessingChainData*>(tbb::filter::serial_in_order,
                                                                         [&](ProcessingChainData *pData)->ProcessingChainData* {
            if(pData == nullptr)
                return nullptr;
            if(cvFaceMark->empty())
                return pData;
            cvFaceMark->getFaces(pData->scaleHalf, pData->faces);
            cvFaceMark->fit(pData->scaleHalf, pData->faces, pData->landmarks);
            return pData;
            }) & tbb::make_filter<ProcessingChainData*,ProcessingChainData*>(tbb::filter::serial_in_order,
                                                                             [&](ProcessingChainData *pData)->ProcessingChainData* {
            if(pData == nullptr)
                return nullptr;
            for ( size_t i = 0; i < pData->faces.size(); i++ ) {
                Rect r = pData->faces[i];
                Mat smallImgROI;
                vector<Rect> nestedObjects;
                Point center;
                Scalar color = colors[i%3];
                float scale = 2.0f;

                rectangle( pData->img, cvPoint(cvRound(r.x*scale), cvRound(r.y*scale)),
                           cvPoint(cvRound((r.x + r.width-1)*scale), cvRound((r.y + r.height-1)*scale)),
                           Scalar(0,0,0), -1);

                vector<Point2f> pts = pData->landmarks[i];
                for(const auto& it: pts) {
                    center.x = cvRound(it.x * scale);
                    center.y = cvRound(it.y * scale);
                    circle(pData->img, center, 2, color,-1);
                }
            }
            return pData;
            }) & tbb::make_filter<ProcessingChainData*,void>(tbb::filter::serial_in_order,
                                                       [&](ProcessingChainData *pData) {
            if(pData != nullptr && !pipelineStop) {
                try {
                    Mat cvtRgba;
                    cvtColor(pData->img, cvtRgba, COLOR_BGR2RGBA);
                    pData->img = cvtRgba.clone();
                    queue.push(pData);
                } catch (...) {
                    LOGW("Pipeline caught an exception on the queue");
                    pipelineStop = true;
                }
            }
        })
    );
}

shared_ptr<thread> FaceDetector::startThread(cv::VideoCapture &cpt,
                                                       concurrent_bounded_queue<ProcessingChainData *> &queue) {
    pipelineStop = false;
    return make_shared<thread>(&FaceDetector::pipeline, this, ref(cpt), ref(queue));
}

