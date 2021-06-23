#ifndef INVIGILATOR_CAMERA_H
#define INVIGILATOR_CAMERA_H

#include <string>
#include <memory>
#include <thread>

struct ACameraManager;
struct ANativeWindow;
class FaceDetector;
class IClassifier;

namespace cv
{
class Mat;
class VideoCapture;
}

class Camera
{
    public:
        enum Facing : uint8_t { FRONT = 0, BACK, EXTERNAL };
    public:
        Camera();
        virtual ~Camera();
        void initFaceDetector( const std::string &haarCascadePath, const std::string &modelLBFPath );
        bool start( int index );
        void stop();
        bool setCaptureSize( int width, int height );
        void initSurface( ANativeWindow *window );
        std::tuple<int, int> getCaptureSize();
        bool registerClassifier( IClassifier *ml );
        bool unloadClassifier();
    private:
        std::shared_ptr<ACameraManager> cameraManager;
        std::shared_ptr<ANativeWindow> textureWindow;
        std::shared_ptr<cv::VideoCapture> cvCapture;
        int cacheWidth = 0, cacheHeight = 0;
        std::shared_ptr<FaceDetector> faceDetector;
        volatile bool renderStop = false;
};

#endif //INVIGILATOR_CAMERA_H
