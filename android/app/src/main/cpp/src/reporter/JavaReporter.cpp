#include "JavaReporter.h"

#include <cassert>
#include <jni.h>
#include <tuple>

#include "dlog.h"

JavaReporter::JavaReporter() = default;
JavaReporter::~JavaReporter()
{
    ScopedEnv scopedEnv( *this );
    if( mCls ) {
        scopedEnv.GetEnv()->DeleteGlobalRef( mCls );
    }
}

bool JavaReporter::init( void *userData )
{
    JNIEnv *env = nullptr;
    jobject cls = nullptr;
    std::tie( env, cls ) = *static_cast<std::tuple<JNIEnv *, jobject> *>( userData );
    assert( env != nullptr );
    assert( cls != nullptr );
    mCls = env->NewGlobalRef( cls );
    return env->GetJavaVM( &mJvm ) == 0;
}

void JavaReporter::onMLResult( const std::vector<float> &result )
{
    ScopedEnv scopedEnv( *this );
    auto env = scopedEnv.GetEnv();
    jclass mlClass = env->GetObjectClass( mCls );
    jmethodID idEmitResult = env->GetMethodID( mlClass, "emitResult",
                             "([F)V" );
    auto jfArr = env->NewFloatArray( result.size() );
    if( jfArr == nullptr ) {
        return;
    }
    env->SetFloatArrayRegion( jfArr, 0, result.size(), &result[0] );
    env->CallVoidMethod( mCls, idEmitResult, jfArr );
}

void JavaReporter::onVideoFrame( const cv::Mat &result ) {}

JavaReporter::ScopedEnv::ScopedEnv( const JavaReporter &parent ): mParent( parent )
{
    mAttached = GetJniEnv( mParent.mJvm, &mEnv );
}

JavaReporter::ScopedEnv::~ScopedEnv()
{
    if( mAttached ) {
        mParent.mJvm->DetachCurrentThread();
        mAttached = false;
    }
}

JNIEnv *JavaReporter::ScopedEnv::GetEnv() const
{
    if( mAttached ) {
        return mEnv;
    } else {
        return nullptr;
    }
}

//reference: https://stackoverflow.com/questions/30026030/what-is-the-best-way-to-save-jnienv
bool JavaReporter::ScopedEnv::GetJniEnv( JavaVM *vm, JNIEnv **jnienv )
{
    bool did_attach_thread = false;
    *jnienv = nullptr;
    // Check if the current thread is attached to the VM
    auto get_env_result = vm->GetEnv( ( void ** )jnienv, JNI_VERSION_1_6 );
    if( get_env_result == JNI_EDETACHED ) {
        if( vm->AttachCurrentThread( jnienv, nullptr ) == JNI_OK ) {
            did_attach_thread = true;
        } else {
            // Failed to attach thread. Throw an exception if you want to.
            LOGE( "Failed to attach thread" );
        }
    } else if( get_env_result == JNI_EVERSION ) {
        // Unsupported JNI version. Throw an exception if you want to.
        LOGE( "Unsupported JNI version" );
    }
    return did_attach_thread;
}
