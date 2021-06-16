#ifndef INVIGILATOR_CAMERA_H
#define INVIGILATOR_CAMERA_H

#include <jni.h>
#include <string>
#include <memory>
#include <thread>

class FaceDetector;
struct ACameraManager;
struct ANativeWindow;

namespace cv
{
class VideoCapture;
}

class Camera
{
    public:
        enum Facing : uint8_t { FRONT = 0, BACK, EXTERNAL };
    public:
        Camera();
        virtual ~Camera();
        static Camera *convertLongToCamera( _JNIEnv *env, long handle );
        void initFaceDetector( JNIEnv *env, jobject ctx );
        bool start( int index );
        void stop();
        bool setCaptureSize( int width, int height );
        void initSurface( JNIEnv *env, jobject surface );
        std::tuple<int, int> getCaptureSize();
    private:
        std::shared_ptr<ACameraManager> cameraManager;
        std::shared_ptr<ANativeWindow> textureWindow;
        std::shared_ptr<cv::VideoCapture> cvCapture;
        int cacheWidth = 0, cacheHeight = 0;
        std::string cacheDirPath;
        std::shared_ptr<FaceDetector> faceDetector;
        volatile bool renderStop = false;
};

#endif //INVIGILATOR_CAMERA_H
