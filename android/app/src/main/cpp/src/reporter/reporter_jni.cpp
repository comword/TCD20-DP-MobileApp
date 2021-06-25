#include <jni.h>

#include "JavaReporter.h"
#include "NetworkReporter.h"
#include "dlog.h"
#include "utils.h"

#include <tuple>

#include <grpcpp/create_channel.h>

extern "C"
JNIEXPORT jlong JNICALL
Java_ie_tcd_cs7cs5_invigilatus_modules_MLModule_nativeReporterInit( JNIEnv *env, jobject thiz )
{
    jclass mlClass = env->GetObjectClass( thiz );
    jmethodID idEmitResult = env->GetMethodID( mlClass, "emitResult",
                             "([F)V" );

    std::unique_ptr<JavaReporter> reporter( new JavaReporter() );
    auto tuple = std::make_tuple( env, thiz );
    if( reporter->init( &tuple ) ) {
        return reinterpret_cast<jlong>( reporter.release() );
    } else {
        LOGE( "JavaReporter init failed" );
        return 0;
    }
}

extern "C"
JNIEXPORT void JNICALL
Java_ie_tcd_cs7cs5_invigilatus_modules_MLModule_nativeReporterDeInit( JNIEnv *env, jobject thiz,
        jlong handle )
{
    delete utils::convertLongToCls<JavaReporter>( env, handle );
}

extern "C"
JNIEXPORT jlong JNICALL
Java_ie_tcd_cs7cs5_invigilatus_modules_MLModule_nativeNetReporterInit( JNIEnv *env, jobject thiz,
        jstring address )
{
    std::unique_ptr<NetworkReporter> reporter( new NetworkReporter() );
    // gRPC connection
    auto addrStr = env->GetStringUTFChars( address, nullptr );
    //    auto channel = grpc::CreateChannel(addrStr, grpc::SslCredentials(grpc::SslCredentialsOptions()));
    auto channel = grpc::CreateChannel( addrStr, grpc::InsecureChannelCredentials() );
    env->ReleaseStringUTFChars( address, addrStr );
    if( reporter->init( &channel ) ) {
        return reinterpret_cast<jlong>( reporter.release() );
    } else {
        LOGE( "NetworkReporter init failed" );
        return 0;
    }
}

extern "C"
JNIEXPORT void JNICALL
Java_ie_tcd_cs7cs5_invigilatus_modules_MLModule_nativeNetReporterDeInit( JNIEnv *env, jobject thiz,
        jlong handle )
{
    delete utils::convertLongToCls<NetworkReporter>( env, handle );
}

extern "C"
JNIEXPORT jboolean JNICALL
Java_ie_tcd_cs7cs5_invigilatus_modules_MLModule_nativeNetReporterAuth( JNIEnv *env, jobject thiz,
        jlong handle,
        jstring auth_key )
{
    auto reporter = utils::convertLongToCls<NetworkReporter>( env, handle );
    if( !reporter ) {
        return false;
    }
    auto keyStr = env->GetStringUTFChars( auth_key, nullptr );
    auto res = reporter->setAuthKey( keyStr );
    env->ReleaseStringUTFChars( auth_key, keyStr );
    return res;
}
