#include "dlog.h"
#include "FaceDetector.h"

#include <thread>
#include <memory>
#include <sys/stat.h>
#include <opencv2/videoio.hpp>
#include <opencv2/imgproc.hpp>
#include <opencv2/objdetect.hpp>
#include <opencv2/face/facemarkLBF.hpp>
#include <tbb/pipeline.h>

using namespace std;
using namespace cv;
using namespace cv::face;
using namespace tbb;

FaceDetector::FaceDetector() {
    cvFaceCascade = shared_ptr<CascadeClassifier>(new CascadeClassifier());
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
        cvFaceMark = FacemarkLBF::create();
        cvFaceMark->loadModel(modelLBFPath);
        auto loadedFacemarkLBF = !cvFaceMark->empty();
        if(loadedFacemarkLBF)
            LOGI("FacemarkLBF model found and loaded");
        else
            LOGW("FacemarkLBF model load failed");
    } else
        LOGW("FacemarkLBF model not found");
    return true;
}

void FaceDetector::detect(InputArray image,
                          std::vector<Rect>& objects,
                          std::vector<std::vector<Point2f>>& landmarks) {
    cvFaceCascade->detectMultiScale(image, objects);
    cvFaceMark->fit(image, objects, landmarks);
}

bool FaceDetector::isPipelineStop() const {
    return pipelineStop;
}

void FaceDetector::stopPipeline() {
    pipelineStop = true;
}

void FaceDetector::pipeline(VideoCapture &cpt,
                            tbb::concurrent_bounded_queue<ProcessingChainData *> &queue) {
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
            pData->img = frame.clone();
            return pData;
        }) & tbb::make_filter<ProcessingChainData*,ProcessingChainData*>(tbb::filter::serial_in_order,
                                                                       [&](ProcessingChainData *pData)->ProcessingChainData* {
            if(pData == nullptr)
                return nullptr;
            Mat cvtRgba;
            cvtColor(pData->img, cvtRgba, COLOR_BGR2RGBA);
            rotate(cvtRgba, cvtRgba, ROTATE_90_CLOCKWISE);
            pData->img = cvtRgba.clone();
            return pData;
        }) & tbb::make_filter<ProcessingChainData*,ProcessingChainData*>(tbb::filter::serial_in_order,
                                                                    [&](ProcessingChainData *pData)->ProcessingChainData* {
            if(pData == nullptr)
                return nullptr;
            cvtColor(pData->img, pData->gray, COLOR_RGBA2GRAY);
            resize(pData->gray, pData->scaleHalf, Size(), .5f, .5f, INTER_LINEAR);
            return pData;
        }) & tbb::make_filter<ProcessingChainData*,ProcessingChainData*>(tbb::filter::serial_in_order,
                                                                         [&](ProcessingChainData *pData)->ProcessingChainData* {
            if(pData == nullptr)
                return nullptr;
            if(cvFaceCascade->empty())
                return pData;
            return pData;
        }) & tbb::make_filter<ProcessingChainData*,void>(tbb::filter::serial_in_order,
                                                       [&](ProcessingChainData *pData) {
            if(pData != nullptr && !pipelineStop) {
                try {
                    queue.push(pData);
                } catch (...) {
                    LOGW("Pipeline caught an exception on the queue");
                    pipelineStop = true;
                }
            }
        })
    );
}

shared_ptr<thread> FaceDetector::startThread(VideoCapture &cpt,
                                                       concurrent_bounded_queue<ProcessingChainData *> &queue) {
    pipelineStop = false;
    return make_shared<thread>(&FaceDetector::pipeline, this, ref(cpt), ref(queue));
}

