#include <memory>
#include <stdexcept>

#include "Camera.h"
#include "dlog.h"
#include "utils.h"

#include <media/NdkImageReader.h>
#include <android/native_window_jni.h>

using namespace std;

static inline void deleter_ACameraManager(ACameraManager *cameraManager) {
    ACameraManager_delete(cameraManager);
}

static inline void deleter_ANativeWindow(ANativeWindow *nativeWindow) {
    ANativeWindow_release(nativeWindow);
}

Camera::Camera() {
    cameraManager = shared_ptr<ACameraManager>(ACameraManager_create(), deleter_ACameraManager);
    if (!cameraManager)
        throw logic_error("ACameraManager could not be created.");
    cvCapture = std::make_unique<cv::VideoCapture>();
    cvCapture->set(cv::CAP_PROP_CONVERT_RGB, true);
}

Camera::~Camera() = default;

Camera* Camera::convertLongToCamera(JNIEnv* env, jlong handle) {
    if (handle == 0) {
        utils::ThrowException(env, utils::kIllegalArgumentException,
                       "Internal error: Invalid handle to Camera.");
        return nullptr;
    }
    return reinterpret_cast<Camera*>(handle);
}

bool Camera::start(int index) {
    if (cvCapture->isOpened()) {
        LOGI("Camera is already opened");
        return false;
    }
    cvCapture->set(cv::CAP_PROP_FRAME_WIDTH, cacheWidth);
    cvCapture->set(cv::CAP_PROP_FRAME_HEIGHT, cacheHeight);
    cvCapture->open(index, cv::CAP_ANDROID);
    if (!cvCapture->isOpened()) {
        LOGW("Unable to open camera");
        return false;
    }
    // start capture thread
    auto cptThread = thread([this](){
        if(!textureWindow) {
            LOGW("Camera output did not bind to target surface.");
            return;
        }
        cv::Mat frame;
        for(;;){
            cvCapture->read(frame);
            if (frame.empty()) {
                LOGI("Blank frame grabbed");
                break;
            }
            ANativeWindow_acquire(textureWindow.get());

            ANativeWindow_Buffer buffer;
            ANativeWindow_setBuffersGeometry(textureWindow.get(), frame.size().width, frame.size().height, 0/* format unchanged */);

            if (int32_t err = ANativeWindow_lock(textureWindow.get(), &buffer, nullptr)) {
                LOGE("ANativeWindow_lock failed with error code: %d\n", err);
                ANativeWindow_release(textureWindow.get());
                return;
            }

            ANativeWindow_unlockAndPost(textureWindow.get());
            ANativeWindow_release(textureWindow.get());
        }
    });
    cptThread.detach();
    return true;
}

void Camera::stop() {
    if (cvCapture->isOpened()) {
        cvCapture.reset();
        LOGD("Camera closed");
        cvCapture = std::make_unique<cv::VideoCapture>();
        cvCapture->set(cv::CAP_PROP_CONVERT_RGB, true);
    }
}

bool Camera::setCaptureSize(int width, int height) {
    if (cvCapture->isOpened()) {
        LOGW("Camera is already opened");
        return false;
    }
    cacheWidth = width;
    cacheHeight = height;
    return true;
}

void Camera::initSurface(JNIEnv *env, jobject surface) {
    auto ptr = ANativeWindow_fromSurface(env, surface);
    textureWindow = shared_ptr<ANativeWindow>(ptr, deleter_ANativeWindow);
}

extern "C"
JNIEXPORT jlong JNICALL
Java_ie_tcd_cs7cs5_invigilatus_video_CameraModule_nativeInitCamera(JNIEnv *env, jobject thiz) {
    unique_ptr<Camera> camera(new Camera());
    return reinterpret_cast<jlong>(camera.release());
}

extern "C"
JNIEXPORT void JNICALL
Java_ie_tcd_cs7cs5_invigilatus_video_CameraModule_nativeDeInitCamera(JNIEnv *env, jobject thiz,
                                                                     jlong cam_handle) {
    delete Camera::convertLongToCamera(env, cam_handle);
}

extern "C"
JNIEXPORT jboolean JNICALL
Java_ie_tcd_cs7cs5_invigilatus_video_CameraModule_nativeCameraStart(JNIEnv *env, jobject thiz, jlong cam_handle, jint cam_idx) {
    auto camera = Camera::convertLongToCamera(env, cam_handle);
    if(!camera)
        return false;
    return camera->start(cam_idx);
}

extern "C"
JNIEXPORT void JNICALL
Java_ie_tcd_cs7cs5_invigilatus_video_CameraModule_nativeCameraStop(JNIEnv *env, jobject thiz, jlong cam_handle) {
    auto camera = Camera::convertLongToCamera(env, cam_handle);
    if(!camera)
        return;
    camera->stop();
}

extern "C"
JNIEXPORT jboolean JNICALL
Java_ie_tcd_cs7cs5_invigilatus_video_CameraModule_nativeCameraSize(JNIEnv *env, jobject thiz,
                                                                   jlong cam_handle, jint width, jint height) {
    auto camera = Camera::convertLongToCamera(env, cam_handle);
    if(!camera)
        return false;
    return camera->setCaptureSize(width, height);
}
