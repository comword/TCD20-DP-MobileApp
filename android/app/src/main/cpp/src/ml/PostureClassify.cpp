#include "PostureClassify.h"

#include <fstream>
#include <iostream>
#include <memory>
#include <string>
#include <vector>

#include "utils.h"
#include "IResultReporter.h"

#include "tensorflow/lite/interpreter.h"
#include "tensorflow/lite/kernels/register.h"
#include "tensorflow/lite/model.h"
#include "tensorflow/lite/optional_debug_tools.h"

PostureClassify::PostureClassify( tflite::FlatBufferModel *mHandle,
                                  tflite::Interpreter *iHandle ) : model( mHandle ), interpreter( iHandle ) {}

PostureClassify::~PostureClassify() = default;

void PostureClassify::classify( const cv::Mat &imgs )
{
    if( reporter ) {
        reporter->onVideoFrame( imgs );
    }
    //    return std::unique_ptr<std::vector<float>>();
}

void PostureClassify::registerReporter( IResultReporter *rep )
{
    reporter = rep;
}
