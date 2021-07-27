#include <iostream>
#include <memory>
#include <chrono>
#include <thread>
#include <ctime>
#include <cmath>
#include <cstdio>
#include <queue>
#include "TripleBuffer.hpp"

#define MAX_POSITION_EMBEDDINGS 288
#define TARGET_FPS 25.0
#define BATCH_FRAME_NUM 16.0

std::unique_ptr<TripleBuffer<std::queue<uint32_t>>> imgsBuffer;
uint64_t lastTime = 0;

uint64_t getTimeNsec()
{
    struct timespec now;
    clock_gettime( CLOCK_MONOTONIC, &now );
    return now.tv_sec * 1000000000LL + now.tv_nsec;
}

void addImages( uint32_t frame )
{
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
    if( frameIdx >= buf->size() ) {
        printf( "PUSH frame=%d, timeDiff=%.3f, frameIdx=%d\n", frame, timeDiff, frameIdx );
        buf->push( frame );
        if( buf->size() == BATCH_FRAME_NUM ) {
            printf( "FLIP\n" );
            lastTime = timeNow;
            imgsBuffer->flipWriter();
            auto newBuf = &imgsBuffer->getWriteRef();
            while( !newBuf->empty() ) {
                newBuf->pop();
            }
        }
    }
}

void generator()
{
    using namespace std::chrono_literals;
    uint32_t frameCount = 0;
    auto startTime = getTimeNsec();
    while( true ) {
        std::this_thread::sleep_for( 35ms ); // 1 / 25
        addImages( frameCount );
        frameCount++;
    }
}

int main()
{
    imgsBuffer = std::make_unique<TripleBuffer<std::queue<uint32_t>>>();
    auto tGenerator = std::thread( generator );
    tGenerator.join();
    return 0;
}
