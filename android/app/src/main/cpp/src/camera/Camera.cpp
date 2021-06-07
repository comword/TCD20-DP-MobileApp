#include <memory>
#include <stdexcept>

#include "FaceDetector.h"
#include "Camera.h"
#include "dlog.h"
#include "utils.h"

#include <camera/NdkCameraManager.h>
#include <media/NdkImageReader.h>
#include <android/native_window_jni.h>
#include <android/asset_manager_jni.h>
#include <pthread.h>

#include <opencv2/imgproc/imgproc.hpp>

using namespace std;

static inline void deleter_ACameraManager(ACameraManager *cameraManager) {
    ACameraManager_delete(cameraManager);
}

static inline void deleter_ANativeWindow(ANativeWindow *nativeWindow) {
    ANativeWindow_release(nativeWindow);
}

static void thread_exit_handler(int sig)
{
    pthread_exit(nullptr);
}

Camera::Camera() {
    cameraManager = shared_ptr<ACameraManager>(ACameraManager_create(), deleter_ACameraManager);
    if (!cameraManager)
        throw logic_error("ACameraManager could not be created.");
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

void Camera::initFaceDetector(JNIEnv* env, jobject ctx) {
    jclass ApplicationClass = env->GetObjectClass(ctx);
    jmethodID getContext = env->GetMethodID(ApplicationClass, "getContext", "()Landroid/content/Context;");
    jobject contextObj = env->CallObjectMethod(ctx, getContext);
    jclass contextObjCls = env->GetObjectClass(contextObj);
    jmethodID getAssets = env->GetMethodID(contextObjCls, "getAssets", "()Landroid/content/res/AssetManager;");
    jobject assetsObj = env->CallObjectMethod(contextObj, getAssets);
    assetManager = AAssetManager_fromJava(env, assetsObj);

    jmethodID getCacheDir = env->GetMethodID(contextObjCls, "getCacheDir", "()Ljava/io/File;");
    jobject file = env->CallObjectMethod(contextObj, getCacheDir);
    jclass fileClass = env->FindClass("java/io/File");
    jmethodID getAbsolutePath = env->GetMethodID(fileClass, "getAbsolutePath", "()Ljava/lang/String;");
    auto jpath = (jstring)env->CallObjectMethod(file, getAbsolutePath);
    auto pPathChar = env->GetStringUTFChars(jpath, nullptr);
    cacheDirPath = string(pPathChar);
    env->ReleaseStringUTFChars(jpath, pPathChar);
    LOGD("App cache dir path: %s", cacheDirPath.c_str());
    faceDetector = shared_ptr<FaceDetector>(new FaceDetector());
    faceDetector->loadModels("", "");
}

bool Camera::start(int index) {
    if (cvCapture.isOpened()) {
        LOGI("Camera is already opened");
        return false;
    }
    cvCapture.open(index, cv::CAP_ANDROID, vector<int>({
        cv::CAP_PROP_FRAME_WIDTH, cacheWidth,
        cv::CAP_PROP_FRAME_HEIGHT, cacheHeight}));
    LOGI("CAP_PROP_FRAME_WIDTH: %lf", cvCapture.get(cv::CAP_PROP_FRAME_WIDTH));
    LOGI("CAP_PROP_FRAME_HEIGHT: %lf", cvCapture.get(cv::CAP_PROP_FRAME_HEIGHT));
    if (!cvCapture.isOpened()) {
        LOGW("Unable to open camera");
        return false;
    }
    // start capture thread
    auto cptThread = thread([this](){
        struct sigaction actions{};
        sigemptyset(&actions.sa_mask);
        actions.sa_flags = 0;
        actions.sa_handler = thread_exit_handler;
        sigaction(SIGUSR1, &actions,nullptr);

        if(!textureWindow) {
            LOGW("Camera output did not bind to target surface.");
            return;
        }
        cv::Mat frame;
        for(;;){
            cvCapture.read(frame);
            if (frame.empty())
                continue;
            auto srcWidth = frame.size().width;
            auto srcHeight = frame.size().height;
            ANativeWindow_acquire(textureWindow.get());
            ANativeWindow_Buffer buffer;
            ANativeWindow_setBuffersGeometry(textureWindow.get(), srcHeight, srcWidth, 0/* format unchanged */);

            if (int32_t err = ANativeWindow_lock(textureWindow.get(), &buffer, nullptr)) {
                LOGE("ANativeWindow_lock failed with error code: %d\n", err);
                ANativeWindow_release(textureWindow.get());
                return;
            }
            auto dstLumaPtr = reinterpret_cast<uint8_t *>(buffer.bits);
            cv::Mat dstRgba(buffer.height, buffer.stride, CV_8UC4, dstLumaPtr);
            cv::Mat cvtRgba(srcHeight, srcWidth, CV_8UC4);

            cv::cvtColor(frame, cvtRgba, cv::COLOR_BGR2RGBA);
            cv::rotate(cvtRgba, cvtRgba, cv::ROTATE_90_CLOCKWISE);
            auto sbuf = cvtRgba.data;
            for (int i = 0; i < cvtRgba.rows; i++) {
                auto dbuf = dstRgba.data + i * buffer.stride * 4;
                memcpy(dbuf, sbuf, cvtRgba.cols * 4);
                sbuf += cvtRgba.cols * 4;
            }

            ANativeWindow_unlockAndPost(textureWindow.get());
            ANativeWindow_release(textureWindow.get());
        }
    });
    cptThreadHandle = cptThread.native_handle();
    cptThread.detach();
    return true;
}

void Camera::stop() {
    if (cvCapture.isOpened()) {
        pthread_kill(cptThreadHandle, SIGUSR1);
        pthread_join(cptThreadHandle, nullptr);
        cvCapture.release();
        LOGD("Camera closed");
    }
}

bool Camera::setCaptureSize(int width, int height) {
    if (cvCapture.isOpened()) {
        LOGW("Camera is already opened");
        return false;
    }
    cacheWidth = width;
    cacheHeight = height;
    return true;
}

std::tuple<int, int> Camera::getCaptureSize() {
    return std::make_tuple(cacheWidth, cacheHeight);
}

void Camera::initSurface(JNIEnv *env, jobject surface) {
    auto ptr = ANativeWindow_fromSurface(env, surface);
    textureWindow = shared_ptr<ANativeWindow>(ptr, deleter_ANativeWindow);
}

extern "C"
JNIEXPORT jlong JNICALL
Java_ie_tcd_cs7cs5_invigilatus_video_CameraModule_nativeInitCamera(JNIEnv *env, jobject thiz) {
    unique_ptr<Camera> camera(new Camera());
    camera->initFaceDetector(env, thiz);
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
