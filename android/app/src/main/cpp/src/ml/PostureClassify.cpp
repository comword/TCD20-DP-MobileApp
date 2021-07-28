#include "PostureClassify.h"

#include <fstream>
#include <iostream>
#include <memory>
#include <string>
#include <stdexcept>
#include <vector>
#include <cassert>
#include <ctime>
#include <cmath>

#include "dlog.h"
#include "utils.h"
#include "IResultReporter.h"
#include "TripleBuffer.hpp"

#include "opencv2/core/types_c.h"
#include "tensorflow/lite/interpreter.h"
#include "tensorflow/lite/kernels/register.h"
#include "tensorflow/lite/model.h"
#include "tensorflow/lite/optional_debug_tools.h"
#include "tensorflow/lite/java/src/main/native/jni_utils.h"

using namespace std;
using namespace cv;

PostureClassify::PostureClassify( tflite::FlatBufferModel *mHandle,
                                  tflite::Interpreter *iHandle ) : model( mHandle ), interpreter( iHandle )
{
    if( iHandle->inputs().size() != 2 ) {
        throw runtime_error( "Model input tensor size should be 2, one is for images and another is for frame index." );
    }
    imgsBuffer =
        make_unique<TripleBuffer<deque<FrameData>>>();
}

PostureClassify::~PostureClassify() = default;

void PostureClassify::classify()
{
    ostringstream errMsg;
    auto frames = imgsBuffer->readLastBlock();

    auto errorReporter = reinterpret_cast<tflite::jni::BufferErrorReporter *>
                         ( model->error_reporter() );
    TfLiteStatus status = interpreter->AllocateTensors();
    if( status != kTfLiteOk ) {
        errMsg << "Internal error: Failed to allocate tensors: " <<
               errorReporter->CachedErrorMessage();
        auto strErrMsg = errMsg.str();
        reporter->onError( "PostureClassify", strErrMsg.c_str() );
        LOGE( "%s", strErrMsg.c_str() );
    }
    auto tensorInputImgs = interpreter->tensor( interpreter->inputs()[0] );
    auto tensorFrameIdx = interpreter->tensor( interpreter->inputs()[1] );

    if( tensorInputImgs->bytes != 3 * BATCH_FRAME_NUM * INPUT_IMGS_HW * INPUT_IMGS_HW * sizeof(
            float ) ||
        tensorFrameIdx->bytes != BATCH_FRAME_NUM * sizeof( float ) ) {
        errMsg << "Internal error: model has unexpected input shape. Found image length: " <<
               tensorInputImgs->bytes << ", index length: " << tensorFrameIdx->bytes <<
               "Image shape should be [3, " <<
               BATCH_FRAME_NUM << ", " << INPUT_IMGS_HW << ", " << INPUT_IMGS_HW <<
               "], and index shape should be [" << BATCH_FRAME_NUM << "].";
        auto strErrMsg = errMsg.str();
        reporter->onError( "PostureClassify", strErrMsg.c_str() );
        LOGE( "%s", strErrMsg.c_str() );
        return;
    }
    for( int frameNum = 0; frameNum < BATCH_FRAME_NUM; frameNum++ ) {
        if( frames[frameNum].img.rows != INPUT_IMGS_HW || frames[frameNum].img.cols != INPUT_IMGS_HW ) {
            errMsg << "Internal error: a captured image has different size HxW: " << frames[frameNum].img.rows
                   << "x" << frames[frameNum].img.cols << ", however, the model accepts squared shape of " <<
                   INPUT_IMGS_HW;
            auto strErrMsg = errMsg.str();
            reporter->onError( "PostureClassify", strErrMsg.c_str() );
            LOGE( "%s", strErrMsg.c_str() );
            return;
        }
        auto sbuf = frames[frameNum].img.data;
        auto step = frames[frameNum].img.step.buf;
        assert( step[0] == 3 * INPUT_IMGS_HW && step[1] == 3 );
        for( int channel = 0; channel < 3; channel++ )
            for( int h = 0; h < INPUT_IMGS_HW; h++ )
                for( int w = 0; w < INPUT_IMGS_HW; w++ ) {
                    inferImgBuf[2-channel][frameNum][h][w] = ( float )sbuf[h * step[0] + w * step[1] + channel];
                }
    }
    for( int i = 0; i < BATCH_FRAME_NUM; i++ ) {
        inferIndexBuf[i] = frames[i].frame_idx;
    }
    memcpy( tensorInputImgs->data.raw, inferImgBuf,
            3 * BATCH_FRAME_NUM * INPUT_IMGS_HW * INPUT_IMGS_HW * sizeof( float ) );
    memcpy( tensorFrameIdx->data.raw, inferIndexBuf,
            BATCH_FRAME_NUM * sizeof( float ) );
    LOGD( "Run model inference" );
    status = interpreter->Invoke();
    if( status != kTfLiteOk ) {
        errMsg << "Internal error: Failed to run on the given Interpreter: " <<
               errorReporter->CachedErrorMessage();
        auto strErrMsg = errMsg.str();
        reporter->onError( "PostureClassify", strErrMsg.c_str() );
        LOGE( "%s", strErrMsg.c_str() );
    } else {
        auto tensorOutput = interpreter->tensor( interpreter->outputs()[0] );
        if( tensorOutput->bytes != sizeof( float ) * OUTPUT_NUM_CLASS ) {
            errMsg << "Internal error: model has unexpected output shape, it should be: [" << OUTPUT_NUM_CLASS
                   << "]";
            auto strErrMsg = errMsg.str();
            reporter->onError( "PostureClassify", strErrMsg.c_str() );
            LOGE( "%s", strErrMsg.c_str() );
            return;
        }
        memcpy( inferOutBuf, tensorOutput->data.raw, sizeof( float ) * OUTPUT_NUM_CLASS );
        auto vecOutput = vector<float>( inferOutBuf, inferOutBuf + OUTPUT_NUM_CLASS );
        ostringstream oss;
        copy( vecOutput.begin(), vecOutput.end() - 1,
              ostream_iterator<float>( oss, ", " ) );
        oss << vecOutput.back();
        LOGI( "Model output: [%s]", oss.str().c_str() );
        reporter->onMLResult( vecOutput );
    }
}

void PostureClassify::registerReporter( IResultReporter *rep )
{
    reporter = rep;
}

void PostureClassify::addImages( const Mat &img )
{
    if( reporter ) {
        reporter->onVideoFrame( img );
    }
    static uint32_t frameCounter = 0;
    auto buf = &imgsBuffer->getWriteRef();
    // Do temporal sampling, 16 frames
    auto timeNow = getTimeNsec();
    auto timeDiff = double( timeNow - lastTime ) / 1e9;
    uint32_t frameIdx = round( timeDiff / 10 * TARGET_FPS - 0.4 );
    if( frameIdx >= ( MAX_POSITION_EMBEDDINGS - 2 ) ) {
        lastTime = timeNow;
        frameIdx = 0;
        while( !buf->empty() ) {
            buf->pop_back();
        }
    }
    // drop over samples, only add to deque in time linear sep
    if( frameIdx >= buf->size() ) {
        LOGD( "PUSH deque timeDiff=%.3f, frameIdx=%d, frameCounter=%d", timeDiff, frameIdx, frameCounter );
        buf->push_back( {.img = img, .frame_idx = frameCounter} );
        if( buf->size() == BATCH_FRAME_NUM ) {
            lastTime = timeNow;
            imgsBuffer->flipWriter();
            auto newBuf = &imgsBuffer->getWriteRef();
            while( !newBuf->empty() ) {
                newBuf->pop_back();
            }
            frameCounter = 0;
        }
    }
    frameCounter++;
}

uint64_t PostureClassify::getTimeNsec()
{
    struct timespec now;
    clock_gettime( CLOCK_MONOTONIC, &now );
    return now.tv_sec * 1000000000LL + now.tv_nsec;
}
