#ifndef INVIGILATOR_CAMERA_H
#define INVIGILATOR_CAMERA_H

#include <string>

#include <camera/NdkCameraManager.h>
#include <camera/NdkCaptureRequest.h>
#include <media/NdkImageReader.h>

class Camera {
public:
    enum Facing:uint8_t { FRONT=0, BACK, EXTERNAL };
public:
    Camera();
    virtual ~Camera();
    void printCamProps(const char *id);
    std::string getFacingCamId(Facing facing);

private:
    ACameraManager* cameraManager;
    ACameraDevice* cameraDevice;
    ACameraOutputTarget* textureTarget;
    ACaptureRequest* request;
    ANativeWindow* textureWindow;
    ACameraCaptureSession* textureSession;
    ACaptureSessionOutput* textureOutput;
    
    ANativeWindow* imageWindow;
    ACameraOutputTarget* imageTarget;
    AImageReader* imageReader;
    ACaptureSessionOutput* imageOutput;
    
    ACaptureSessionOutput* output;
    ACaptureSessionOutputContainer* outputs;
};

#endif //INVIGILATOR_CAMERA_H
