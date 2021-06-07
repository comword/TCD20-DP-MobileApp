#include <sys/stat.h>
#include <opencv2/objdetect.hpp>
#include <opencv2/face/facemarkLBF.hpp>

#include "dlog.h"
#include "FaceDetector.h"

using namespace std;
using namespace cv::face;

FaceDetector::FaceDetector() {
    cvFaceCascade = shared_ptr<cv::CascadeClassifier>(new cv::CascadeClassifier());
}

FaceDetector::~FaceDetector() {

}

inline bool isFileExist (const std::string& name) {
    struct stat buffer{};
    return (stat (name.c_str(), &buffer) == 0);
}

void FaceDetector::loadModels(char *haarCascade, char *modelLBF) {
    auto cascadePath = string(haarCascade);
    if(isFileExist(cascadePath)) {
        cvFaceCascade->load(cascadePath);
        LOGI("HaarCascade model found and loaded");
    }
    auto modelLBFPath = string(modelLBF);
    if(isFileExist(modelLBFPath)) {
        cvFaceMark = FacemarkLBF::create();
        cvFaceMark->loadModel(modelLBFPath);
        LOGI("LBF model found and loaded");
    }
}

void FaceDetector::detect(cv::InputArray image,
                          std::vector<cv::Rect>& objects,
                          std::vector<std::vector<cv::Point2f>>& landmarks) {
    cvFaceCascade->detectMultiScale(image, objects);
    cvFaceMark->fit(image, objects, landmarks);
}

