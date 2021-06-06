#ifndef INVIGILATOR_CAMERA_H
#define INVIGILATOR_CAMERA_H

#include <jni.h>
#include <string>
#include <memory>
#include <thread>

#include <camera/NdkCameraManager.h>
#include <opencv2/videoio.hpp>

class Camera {
public:
    enum Facing:uint8_t { FRONT=0, BACK, EXTERNAL };
public:
    Camera();
    virtual ~Camera();
    static Camera *convertLongToCamera(_JNIEnv *env, long handle);
    bool start(int index);
    void stop();
    bool setCaptureSize(int width, int height);
    void initSurface(JNIEnv *env, jobject surface);
private:
    std::shared_ptr<ACameraManager> cameraManager;
    std::shared_ptr<ANativeWindow> textureWindow;
    std::unique_ptr<cv::VideoCapture> cvCapture;
    int cacheWidth=0, cacheHeight=0;
};

#endif //INVIGILATOR_CAMERA_H
