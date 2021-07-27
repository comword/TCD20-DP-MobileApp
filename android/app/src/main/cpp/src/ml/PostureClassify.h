#ifndef NATIVE_LIBS_POSTURECLASSIFY_H
#define NATIVE_LIBS_POSTURECLASSIFY_H

#include <memory>
#include <queue>
#include <type_traits>

#include "IClassifier.h"

#include <opencv2/core/types_c.h>

// from model training parameters config
#define BATCH_FRAME_NUM 16.0
#define TARGET_FPS 25.0
#define MAX_POSITION_EMBEDDINGS 288

namespace tflite
{
class FlatBufferModel;
class Interpreter;
}

template <typename T> class TripleBuffer;

class PostureClassify: public IClassifier
{
    public:
        struct FrameData {
            cv::Mat img;
            uint32_t frame_idx;
        };
    public:
        PostureClassify( tflite::FlatBufferModel *mHandle, tflite::Interpreter *iHandle );
        virtual ~PostureClassify();

        void classify() override;
        void addImages( const cv::Mat &img ) override;
        void registerReporter( IResultReporter *rep ) override;

    private:
        tflite::FlatBufferModel *model;
        tflite::Interpreter *interpreter;
        IResultReporter *reporter = nullptr;
        std::unique_ptr<TripleBuffer<std::queue<FrameData>>> imgsBuffer;
        uint64_t lastTime = 0;

    private:
        static uint64_t getTimeNsec();
};

#endif
