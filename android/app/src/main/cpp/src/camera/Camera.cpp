#include "Camera.h"

#include <memory>
#include <stdexcept>

#include "FaceDetector.h"
#include "IClassifier.h"
#include "dlog.h"
#include "utils.h"

#include <camera/NdkCameraManager.h>
#include <media/NdkImageReader.h>

#include <opencv2/videoio.hpp>
#include <opencv2/imgproc/imgproc.hpp>

using namespace std;

static inline void deleter_ACameraManager( ACameraManager *cameraManager )
{
    ACameraManager_delete( cameraManager );
}

static inline void deleter_ANativeWindow( ANativeWindow *nativeWindow )
{
    ANativeWindow_release( nativeWindow );
}

Camera::Camera()
{
    cvCapture = shared_ptr<cv::VideoCapture>( new cv::VideoCapture() );
    cameraManager = shared_ptr<ACameraManager>( ACameraManager_create(), deleter_ACameraManager );
    if( !cameraManager ) {
        throw logic_error( "ACameraManager could not be created." );
    }
}

Camera::~Camera() = default;

void Camera::initFaceDetector( const string &haarCascadePath, const string &modelLBFPath )
{
    faceDetector = shared_ptr<FaceDetector>( new FaceDetector() );
    if( haarCascadePath.empty() || modelLBFPath.empty() ) {
        LOGW( "Face detector model is not initialised due to missing HaarCascade or landmark LBF model" );
        return;
    }
    LOGI( "Loading HaarCascade from %s, and landmark LBF from %s", haarCascadePath.c_str(),
          modelLBFPath.c_str() );
    faceDetector->loadModels( haarCascadePath.c_str(), modelLBFPath.c_str() );
}

bool Camera::start( int index )
{
    if( cvCapture->isOpened() ) {
        LOGI( "Camera is already opened" );
        return false;
    }
    cvCapture->open( index, cv::CAP_ANDROID, vector<int>( {
        cv::CAP_PROP_FRAME_WIDTH, cacheWidth,
        cv::CAP_PROP_FRAME_HEIGHT, cacheHeight} ) );
    if( !cvCapture->isOpened() ) {
        LOGW( "Unable to open camera" );
        return false;
    }
    renderStop = false;
    auto cptThread = thread( [ = ]() {
        if( !textureWindow ) {
            LOGW( "Camera output did not bind to target surface." );
            return;
        }
        tbb::concurrent_bounded_queue<FaceDetector::ProcessingChainData *> procQueue;
        procQueue.set_capacity( 2 );
        auto pipelineRunner = faceDetector->startThread( *cvCapture, procQueue, index );
        FaceDetector::ProcessingChainData *recvData = nullptr;
        for( ; !renderStop && !faceDetector->isPipelineStop(); ) {
            procQueue.pop( recvData );
            if( recvData == nullptr ) {
                continue;
            }
            auto srcWidth = recvData->anonImg.size().width;
            auto srcHeight = recvData->anonImg.size().height;
            ANativeWindow_acquire( textureWindow.get() );
            ANativeWindow_Buffer buffer;
            ANativeWindow_setBuffersGeometry( textureWindow.get(), srcWidth, srcHeight,
                                              0/* format unchanged */ );
            if( int32_t err = ANativeWindow_lock( textureWindow.get(), &buffer, nullptr ) ) {
                LOGE( "ANativeWindow_lock failed with error code: %d\n", err );
                ANativeWindow_release( textureWindow.get() );
                return;
            }
            auto dstLumaPtr = reinterpret_cast<uint8_t *>( buffer.bits );
            cv::Mat dstRgba( buffer.height, buffer.stride, CV_8UC4, dstLumaPtr );
            auto sbuf = recvData->anonImg.data;
            for( int i = 0; i < recvData->anonImg.rows; i++ ) {
                auto dbuf = dstRgba.data + i * buffer.stride * 4;
                memcpy( dbuf, sbuf, recvData->anonImg.cols * 4 );
                sbuf += recvData->anonImg.cols * 4;
            }

            ANativeWindow_unlockAndPost( textureWindow.get() );
            ANativeWindow_release( textureWindow.get() );
            delete recvData;
            recvData = nullptr;
        }
        LOGI( "Camera render thread stopping" );
        if( !faceDetector->isPipelineStop() ) {
            faceDetector->stopPipeline();
        }
        do {
            delete recvData;
        } while( procQueue.try_pop( recvData ) );
        pipelineRunner->join();
    } );
    cptThread.detach();
    return true;
}

void Camera::stop()
{
    if( cvCapture->isOpened() ) {
        renderStop = true;
        auto delayDestroyThread = thread( [ = ]() {
            using namespace chrono_literals;
            this_thread::sleep_for( 1000ms );
            cvCapture->release();
            LOGD( "Camera closed" );
        } );
        delayDestroyThread.detach();
    }
}

bool Camera::setCaptureSize( int width, int height )
{
    if( cvCapture->isOpened() ) {
        LOGW( "Camera is already opened" );
        return false;
    }
    cacheWidth = width;
    cacheHeight = height;
    return true;
}

std::tuple<int, int> Camera::getCaptureSize()
{
    return make_tuple( cacheWidth, cacheHeight );
}

void Camera::initSurface( ANativeWindow *window )
{
    textureWindow = shared_ptr<ANativeWindow>( window, deleter_ANativeWindow );
}

bool Camera::registerClassifier( IClassifier *ml )
{
    if( faceDetector ) {
        return faceDetector->registerClassifier( ml );
    }
    return false;
}

bool Camera::unloadClassifier()
{
    if( faceDetector ) {
        return faceDetector->unloadClassifier();
    }
    return false;
}
