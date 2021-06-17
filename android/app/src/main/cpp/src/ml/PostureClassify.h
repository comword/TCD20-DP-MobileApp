#ifndef NATIVE_LIBS_POSTURECLASSIFY_H
#define NATIVE_LIBS_POSTURECLASSIFY_H

#include <memory>
#include <jni.h>

namespace tflite
{
class FlatBufferModel;
class Interpreter;
}

class PostureClassify
{
    public:
        PostureClassify( tflite::FlatBufferModel *mHandle, tflite::Interpreter *iHandle );

        virtual ~PostureClassify();

        std::unique_ptr<int[]> DoInfer( int *img_rgb );

        static PostureClassify *convertLongToCls( _JNIEnv *env, long handle );

    private:
        tflite::FlatBufferModel *model;
        tflite::Interpreter *interpreter;
};

#endif
