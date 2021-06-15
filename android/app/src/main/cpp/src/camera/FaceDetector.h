#ifndef INVIGILATOR_FACEDETECTOR_H
#define INVIGILATOR_FACEDETECTOR_H

#include <memory>
#include <opencv2/objdetect.hpp>

#include <tbb/concurrent_queue.h>

namespace cv {
    class CascadeClassifier;
    class Mat;
    class VideoCapture;
}

namespace cv::face {
    class FacemarkLBF;
}

class FaceDetector {
public:
struct ProcessingChainData
{
    cv::Mat img, gray, scaleHalf;
    std::vector<cv::Rect> faces;
};
public:
    FaceDetector();
    virtual ~FaceDetector();
    bool loadModels(const char* haarCascade, const char* modelLBF);
    void detect(cv::InputArray image,
                std::vector<cv::Rect>& objects,
                std::vector<std::vector<cv::Point2f>>& landmarks);
    void pipeline(cv::VideoCapture &cpt, tbb::concurrent_bounded_queue<ProcessingChainData *> &queue);
    bool isPipelineStop() const;
    void stopPipeline();
    std::shared_ptr<std::thread>startThread(cv::VideoCapture &cpt, tbb::concurrent_bounded_queue<ProcessingChainData *> &queue);
private:
    std::shared_ptr<cv::CascadeClassifier> cvFaceCascade;
    std::shared_ptr<cv::face::FacemarkLBF> cvFaceMark;
    volatile bool pipelineStop = false;
};


#endif //INVIGILATOR_FACEDETECTOR_H
