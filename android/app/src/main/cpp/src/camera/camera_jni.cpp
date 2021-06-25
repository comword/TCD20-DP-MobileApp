#include <jni.h>

#include "Camera.h"
#include "IClassifier.h"
#include "dlog.h"
#include "utils.h"

extern "C"
JNIEXPORT jlong JNICALL
Java_ie_tcd_cs7cs5_invigilatus_modules_CameraModule_nativeInitCamera( JNIEnv *env, jobject thiz )
{
    std::unique_ptr<Camera> camera( new Camera() );

    jclass ApplicationClass = env->GetObjectClass( thiz );
    jfieldID idHaarCascadePath = env->GetFieldID( ApplicationClass, "haarCascadePath",
                                 "Ljava/lang/String;" );
    jfieldID idModelLBFPath = env->GetFieldID( ApplicationClass, "modelLBFPath", "Ljava/lang/String;" );

    auto jStrHaarCascadePath = ( jstring )env->GetObjectField( thiz, idHaarCascadePath );
    auto jStrModelLBFPath = ( jstring )env->GetObjectField( thiz, idModelLBFPath );
    if( jStrHaarCascadePath == nullptr || jStrModelLBFPath == nullptr ) {
        LOGW( "Face detector model is not initialised due to missing HaarCascade or landmark LBF model" );
        return reinterpret_cast<jlong>( camera.release() );
    }
    auto pHaarCascadePath = env->GetStringUTFChars( jStrHaarCascadePath, nullptr );
    auto pModelLBFPath = env->GetStringUTFChars( jStrModelLBFPath, nullptr );

    std::string haarCascadePath( pHaarCascadePath );
    std::string modelLBFPath( pModelLBFPath );
    camera->initFaceDetector( haarCascadePath, modelLBFPath );
    env->ReleaseStringUTFChars( jStrHaarCascadePath, pHaarCascadePath );
    env->ReleaseStringUTFChars( jStrModelLBFPath, pModelLBFPath );
    return reinterpret_cast<jlong>( camera.release() );
}

extern "C"
JNIEXPORT void JNICALL
Java_ie_tcd_cs7cs5_invigilatus_modules_CameraModule_nativeDeInitCamera( JNIEnv *env, jobject thiz,
        jlong cam_handle )
{
    delete utils::convertLongToCls<Camera>( env, cam_handle );
}

extern "C"
JNIEXPORT jboolean JNICALL
Java_ie_tcd_cs7cs5_invigilatus_modules_CameraModule_nativeCameraStart( JNIEnv *env, jobject thiz,
        jlong cam_handle, jint cam_idx )
{
    auto camera = utils::convertLongToCls<Camera>( env, cam_handle );
    if( !camera ) {
        return false;
    }
    return camera->start( cam_idx );
}

extern "C"
JNIEXPORT void JNICALL
Java_ie_tcd_cs7cs5_invigilatus_modules_CameraModule_nativeCameraStop( JNIEnv *env, jobject thiz,
        jlong cam_handle )
{
    auto camera = utils::convertLongToCls<Camera>( env, cam_handle );
    if( !camera ) {
        return;
    }
    camera->stop();
}

extern "C"
JNIEXPORT jboolean JNICALL
Java_ie_tcd_cs7cs5_invigilatus_modules_CameraModule_nativeCameraSize( JNIEnv *env, jobject thiz,
        jlong cam_handle, jint width, jint height )
{
    auto camera = utils::convertLongToCls<Camera>( env, cam_handle );
    if( !camera ) {
        return false;
    }
    return camera->setCaptureSize( width, height );
}

extern "C"
JNIEXPORT jboolean JNICALL
Java_ie_tcd_cs7cs5_invigilatus_modules_CameraModule_nativeConnectClassifier( JNIEnv *env,
        jobject thiz,
        jlong cam_handle, jlong clf_handle )
{
    auto camera = utils::convertLongToCls<Camera>( env, cam_handle );
    auto classifier = utils::convertLongToCls<IClassifier>( env, clf_handle );
    if( !camera || !classifier ) {
        return false;
    }
    return camera->registerClassifier( classifier );
}

extern "C"
JNIEXPORT jboolean JNICALL
Java_ie_tcd_cs7cs5_invigilatus_modules_CameraModule_nativeDisconnectClassifier( JNIEnv *env,
        jobject thiz,
        jlong cam_handle )
{
    auto camera = utils::convertLongToCls<Camera>( env, cam_handle );
    if( !camera ) {
        return false;
    }
    return camera->unloadClassifier();
}

extern "C"
JNIEXPORT void JNICALL
Java_ie_tcd_cs7cs5_invigilatus_modules_CameraModule_nativeInit( JNIEnv *env, jobject thiz )
{
    JavaVM *jvm;
}
