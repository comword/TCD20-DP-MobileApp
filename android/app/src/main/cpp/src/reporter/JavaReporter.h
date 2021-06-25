#ifndef INVIGILATOR_JAVAREPORTER_H
#define INVIGILATOR_JAVAREPORTER_H

#include "IResultReporter.h"

struct _JavaVM;
struct _JNIEnv;
class _jobject;
typedef _JNIEnv JNIEnv;
typedef _JavaVM JavaVM;
typedef _jobject *jobject;

class JavaReporter: public IResultReporter
{
    public:
        JavaReporter();
        virtual ~JavaReporter();
        bool init( void *userData ) override;
        void onMLResult( const std::vector<float> &result ) override;
        void onVideoFrame( const cv::Mat &result ) override;
    private:
        JavaVM *mJvm = nullptr;
        jobject mCls = nullptr;
    private:
        class ScopedEnv final
        {
            public:
                explicit ScopedEnv( const JavaReporter &parent );
                ~ScopedEnv();
                JNIEnv *GetEnv() const;

                ScopedEnv( ScopedEnv const & ) = delete;
                ScopedEnv &operator=( ScopedEnv const & ) = delete;
            private:
                const JavaReporter &mParent;
                bool mAttached = false;
                JNIEnv *mEnv = nullptr;
            private:
                static bool GetJniEnv( JavaVM *vm, JNIEnv **jnienv );
        };
};

#endif //INVIGILATOR_JAVAREPORTER_H
