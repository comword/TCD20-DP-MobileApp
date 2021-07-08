#include <jni.h>

#include "JavaReporter.h"
#include "NetworkReporter.h"
#include "ReporterMgr.h"
#include "dlog.h"
#include "utils.h"

#include <tuple>
#include <string>

#include <grpcpp/create_channel.h>

extern "C"
JNIEXPORT jlong JNICALL
Java_ie_tcd_cs7cs5_invigilatus_modules_MLModule_nativeReporterInit( JNIEnv *env, jobject thiz,
        jstring address )
{
    std::unique_ptr<ReporterMgr> repMgr( new ReporterMgr() );
    if( !repMgr->init( nullptr ) ) {
        LOGE( "ReporterMgr init failed" );
        return 0;
    }
    std::unique_ptr<JavaReporter> javaRep( new JavaReporter() );
    auto tuple = std::make_tuple( env, thiz );
    if( !javaRep->init( &tuple ) ) {
        LOGE( "JavaReporter init failed" );
        return 0;
    }
    repMgr->addReporter( javaRep.release() );

    std::unique_ptr<NetworkReporter> netRep( new NetworkReporter() );
    auto addrStr = env->GetStringUTFChars( address, nullptr );
    auto channel = grpc::CreateChannel( addrStr,
                                        grpc::SslCredentials( grpc::SslCredentialsOptions() ) );
    //    auto channel = grpc::CreateChannel( addrStr, grpc::InsecureChannelCredentials() );
    env->ReleaseStringUTFChars( address, addrStr );
    if( !netRep->init( &channel ) ) {
        LOGE( "NetworkReporter init failed" );
        return 0;
    }
    repMgr->addReporter( netRep.release() );
    return reinterpret_cast<jlong>( repMgr.release() );
}

extern "C"
JNIEXPORT void JNICALL
Java_ie_tcd_cs7cs5_invigilatus_modules_MLModule_nativeReporterDeInit( JNIEnv *env, jobject thiz,
        jlong handle )
{
    delete utils::convertLongToCls<ReporterMgr>( env, handle );
}

extern "C"
JNIEXPORT jboolean JNICALL
Java_ie_tcd_cs7cs5_invigilatus_modules_MLModule_nativeReporterAuth( JNIEnv *env, jobject thiz,
        jlong handle, jstring auth_key )
{
    auto mgr = utils::convertLongToCls<ReporterMgr>( env, handle );
    if( !mgr ) {
        return false;
    }
    auto netRprt = reinterpret_cast<NetworkReporter *>( mgr->findReporter( "NetworkReporter" ) );
    if( !netRprt ) {
        return false;
    }
    auto keyStr = env->GetStringUTFChars( auth_key, nullptr );
    auto res = netRprt->setAuthKey( keyStr );
    env->ReleaseStringUTFChars( auth_key, keyStr );
    return res;
}

extern "C"
JNIEXPORT jboolean JNICALL
Java_ie_tcd_cs7cs5_invigilatus_modules_MLModule_nativeReporterExamId( JNIEnv *env, jobject thiz,
        jlong handle,
        jstring exam_id )
{
    auto mgr = utils::convertLongToCls<ReporterMgr>( env, handle );
    if( !mgr ) {
        return false;
    }
    auto keyStr = env->GetStringUTFChars( exam_id, nullptr );
    std::string str( keyStr );
    mgr->setCurrentExamId( str );
    env->ReleaseStringUTFChars( exam_id, keyStr );
    return true;
}
