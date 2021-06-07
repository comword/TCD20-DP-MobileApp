#ifndef INVIGILATOR_FACEDETECTOR_H
#define INVIGILATOR_FACEDETECTOR_H

#include <memory>
#include <opencv2/objdetect.hpp>

namespace cv {
    class CascadeClassifier;
    class Mat;
}

namespace cv::face {
    class FacemarkLBF;
}

class FaceDetector {
public:
    FaceDetector();
    virtual ~FaceDetector();
    void loadModels(char* haarCascade, char* modelLBF);
    void detect(cv::InputArray image,
                std::vector<cv::Rect>& objects,
                std::vector<std::vector<cv::Point2f>>& landmarks);
private:
    std::shared_ptr<cv::CascadeClassifier> cvFaceCascade;
    std::shared_ptr<cv::face::FacemarkLBF> cvFaceMark;
};


#endif //INVIGILATOR_FACEDETECTOR_H
