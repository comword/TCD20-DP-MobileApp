#ifndef NATIVE_LIBS_POSTURECLASSIFY_H
#define NATIVE_LIBS_POSTURECLASSIFY_H

#include <memory>
#include "IClassifier.h"

namespace tflite
{
class FlatBufferModel;
class Interpreter;
}

namespace cv
{
class Mat;
}

class PostureClassify: public IClassifier
{
    public:
        PostureClassify( tflite::FlatBufferModel *mHandle, tflite::Interpreter *iHandle );
        virtual ~PostureClassify();

        std::unique_ptr<std::vector<float>> classify( const cv::Mat &imgs );

    private:
        tflite::FlatBufferModel *model;
        tflite::Interpreter *interpreter;
};

#endif
