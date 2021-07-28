#include <jni.h>

#include "PostureClassify.h"
#include "IResultReporter.h"
#include "dlog.h"
#include "utils.h"

#include <memory>

using namespace std;

extern "C"
JNIEXPORT jlong JNICALL
Java_ie_tcd_cs7cs5_invigilatus_modules_MLModule_nativeModelInit( JNIEnv *env, jobject thiz,
        jobject interpreter, jlong reporter_mgr_handle )
{
    auto interpClass = env->GetObjectClass( interpreter );
    auto idNativeInterpWrapper = env->GetFieldID( interpClass, "wrapper",
                                 "Lorg/tensorflow/lite/NativeInterpreterWrapper;" );
    auto nativeInterpWrapper = env->GetObjectField( interpreter, idNativeInterpWrapper );

    auto nativeInterpWrapperClass = env->GetObjectClass( nativeInterpWrapper );
    auto idInterpreterHandle = env->GetFieldID( nativeInterpWrapperClass, "interpreterHandle",
                               "J" );
    auto idModelHandle = env->GetFieldID( nativeInterpWrapperClass, "modelHandle",
                                          "J" );
    auto interpreterHandle = env->GetLongField( nativeInterpWrapper, idInterpreterHandle );
    auto modelHandle = env->GetLongField( nativeInterpWrapper, idModelHandle );
    try {
        unique_ptr<PostureClassify> posture( new PostureClassify(
                reinterpret_cast<tflite::FlatBufferModel *>( modelHandle ),
                reinterpret_cast<tflite::Interpreter *>( interpreterHandle ) ) );
        posture->registerReporter( utils::convertLongToCls<IResultReporter>( env, reporter_mgr_handle ) );
        return reinterpret_cast<jlong>( posture.release() );
    } catch( std::runtime_error &e ) {
        utils::ThrowException( env, utils::kIllegalStateException,
                               "Internal error: %s", e.what() );
        return 0;
    }
}

extern "C"
JNIEXPORT void JNICALL
Java_ie_tcd_cs7cs5_invigilatus_modules_MLModule_nativeDeInit( JNIEnv *env, jobject thiz,
        jlong pc_handle )
{
    delete utils::convertLongToCls<PostureClassify>( env, pc_handle );
}
