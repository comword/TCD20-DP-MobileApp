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

        void classify( const cv::Mat &imgs ) override;
        void registerReporter( IResultReporter *rep ) override;

    private:
        tflite::FlatBufferModel *model;
        tflite::Interpreter *interpreter;
        IResultReporter *reporter = nullptr;
};

#endif
