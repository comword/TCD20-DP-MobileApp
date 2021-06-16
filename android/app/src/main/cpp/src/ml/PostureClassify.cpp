#include <android/log.h>
#include <math.h>

#include <fstream>
#include <iostream>
#include <memory>
#include <string>
#include <vector>

#include "tensorflow/lite/interpreter.h"
#include "tensorflow/lite/kernels/register.h"
#include "tensorflow/lite/model.h"
#include "tensorflow/lite/optional_debug_tools.h"

#include "PostureClassify.h"

PostureClassify::PostureClassify( const void *model_data, size_t model_size, bool use_gpu )
{

}

PostureClassify::~PostureClassify()
{

}

bool PostureClassify::IsInterpreterCreated()
{
    return false;
}

std::unique_ptr<int[]> PostureClassify::DoInfer( int *img_rgb )
{
    return std::unique_ptr<int[]>();
}

