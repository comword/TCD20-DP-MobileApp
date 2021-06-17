#include "PostureClassify.h"
#include "utils.h"
#include <jni.h>

#include <fstream>
#include <iostream>
#include <memory>
#include <string>
#include <vector>

#include "tensorflow/lite/interpreter.h"
#include "tensorflow/lite/kernels/register.h"
#include "tensorflow/lite/model.h"
#include "tensorflow/lite/optional_debug_tools.h"

PostureClassify::PostureClassify( tflite::FlatBufferModel *mHandle,
                                  tflite::Interpreter *iHandle ) : model( mHandle ), interpreter( iHandle ) {}

PostureClassify::~PostureClassify() = default;

PostureClassify *PostureClassify::convertLongToCls( JNIEnv *env, jlong handle )
{
    if( handle == 0 ) {
        utils::ThrowException( env, utils::kIllegalArgumentException,
                               "Internal error: Invalid handle to PostureClassify." );
        return nullptr;
    }
    return reinterpret_cast<PostureClassify *>( handle );
}

std::unique_ptr<int[]> PostureClassify::DoInfer( int *img_rgb )
{
    return std::unique_ptr<int[]>();
}

