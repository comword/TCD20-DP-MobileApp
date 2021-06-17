#include "PostureClassify.h"
#include "utils.h"

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

std::unique_ptr<std::vector<float>> PostureClassify::classify( const cv::Mat &imgs )
{
    return std::unique_ptr<std::vector<float>>();
}
