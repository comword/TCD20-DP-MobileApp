#include "PostureClassify.h"

#include <fstream>
#include <iostream>
#include <memory>
#include <string>
#include <vector>
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

using namespace std;
using namespace cv;

PostureClassify::PostureClassify( tflite::FlatBufferModel *mHandle,
                                  tflite::Interpreter *iHandle ) : model( mHandle ), interpreter( iHandle )
{
    imgsBuffer =
        make_unique<TripleBuffer<queue<FrameData>>>();
}

PostureClassify::~PostureClassify() = default;

void PostureClassify::classify()
{
    auto imgs = imgsBuffer->readLastBlock();
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
    auto buf = &imgsBuffer->getWriteRef();
    // Do temporal sampling, 16 frames
    auto timeNow = getTimeNsec();
    auto timeDiff = double( timeNow - lastTime ) / 1e9;
    uint32_t frameIdx = round( timeDiff / 10 * TARGET_FPS - 0.4 );
    if( frameIdx >= ( MAX_POSITION_EMBEDDINGS - 2 ) ) {
        lastTime = timeNow;
        frameIdx = 0;
        while( !buf->empty() ) {
            buf->pop();
        }
    }
    // drop over samples, only add to queue in time linear sep
    if( frameIdx >= buf->size() ) {
        LOGD( "PUSH queue timeDiff=%.3f, frameIdx=%d", timeDiff, frameIdx );
        buf->push( {.img = img, .frame_idx = frameIdx} );
        if( buf->size() == BATCH_FRAME_NUM ) {
            lastTime = timeNow;
            imgsBuffer->flipWriter();
            auto newBuf = &imgsBuffer->getWriteRef();
            while( !newBuf->empty() ) {
                newBuf->pop();
            }
        }
    }
}

uint64_t PostureClassify::getTimeNsec()
{
    struct timespec now;
    clock_gettime( CLOCK_MONOTONIC, &now );
    return now.tv_sec * 1000000000LL + now.tv_nsec;
}
