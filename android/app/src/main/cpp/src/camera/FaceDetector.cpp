#include "FaceDetector.h"

#include <thread>
#include <memory>
#include <iterator>
#include <vector>

#include "IClassifier.h"
#include "dlog.h"

#include <sys/stat.h>
#include <opencv2/core/types_c.h>
#include <opencv2/videoio.hpp>
#include <opencv2/imgproc.hpp>
#include <opencv2/objdetect.hpp>
#include <opencv2/face/facemarkLBF.hpp>
#include <tbb/pipeline.h>

using namespace std;

FaceDetector::FaceDetector()
{
    cvFaceCascade = shared_ptr<cv::CascadeClassifier>( new cv::CascadeClassifier() );
}

FaceDetector::~FaceDetector()
{

}

inline bool isFileExist( const std::string &name )
{
    struct stat buffer {};
    return ( stat( name.c_str(), &buffer ) == 0 );
}

bool FaceDetector::loadModels( const char *haarCascade, const char *modelLBF )
{
    using namespace cv::face;
    auto cascadePath = string( haarCascade );
    if( isFileExist( cascadePath ) ) {
        auto loadedHaarCascade = cvFaceCascade->load( cascadePath );
        if( loadedHaarCascade ) {
            LOGI( "HaarCascade model found and loaded" );
        } else {
            LOGW( "HaarCascade model load failed" );
        }
    } else {
        LOGW( "HaarCascade model not found" );
    }
    auto modelLBFPath = string( modelLBF );
    if( isFileExist( modelLBFPath ) ) {
        FacemarkLBF::Params params;
        params.model_filename = modelLBFPath;
        params.cascade_face = cascadePath;
        cvFaceMark = FacemarkLBF::create( params );
        cvFaceMark->loadModel( modelLBFPath );
        auto loadedFacemarkLBF = !cvFaceMark->empty();
        if( loadedFacemarkLBF ) {
            cvFaceMark->setFaceDetector( reinterpret_cast<FN_FaceDetector>( &FaceDetector::detect ), this );
            LOGI( "FacemarkLBF model found and loaded" );
        } else {
            LOGW( "FacemarkLBF model load failed" );
        }
    } else {
        LOGW( "FacemarkLBF model not found" );
    }
    return true;
}

bool FaceDetector::detect( cv::InputArray image, cv::OutputArray faces, FaceDetector *cls )
{

    std::vector<cv::Rect> faces_;
    std::vector<std::vector<cv::Point2f>> landmarks;
    cls->cvFaceCascade->detectMultiScale( image, faces_,
                                          1.1, 3, 0
                                          | cv::CASCADE_FIND_BIGGEST_OBJECT
                                          //                                          | cv::CASCADE_DO_ROUGH_SEARCH
                                          | cv::CASCADE_SCALE_IMAGE,
                                          cv::Size( 30, 30 ) );
    cv::Mat( faces_ ).copyTo( faces );
    return true;
}

bool FaceDetector::isPipelineStop() const
{
    return pipelineStop;
}

void FaceDetector::stopPipeline()
{
    pipelineStop = true;
}

void FaceDetector::pipeline( cv::VideoCapture &cpt,
                             tbb::concurrent_bounded_queue<ProcessingChainData *> &queue )
{
    using namespace cv;
    using namespace tbb;
    const static cv::Scalar colors[] = {
        Scalar( 0, 0, 255 ), //BGR
        Scalar( 0, 255, 0 ),
        Scalar( 255, 0, 0 ),
    };
    parallel_pipeline( 5,
                       make_filter<void, ProcessingChainData *>( filter::serial_in_order, [&](
    flow_control & fc )->ProcessingChainData* {
        if( pipelineStop )
        {
            fc.stop();
            return nullptr;
        }
        auto pData = new ProcessingChainData;
        try
        {
            cpt >> pData->img;
        } catch( ... )
        {
            delete pData;
            return nullptr;
        }
        if( pData->img.empty() )
        {
            delete pData;
            return nullptr;
        }
        if( cachedIndex == 0 )
            rotate( pData->img, pData->img, ROTATE_90_CLOCKWISE );
        else if( cachedIndex == 1 )
            rotate( pData->img, pData->img, ROTATE_90_COUNTERCLOCKWISE );
        pData->anonImg = pData->img.clone();
        return pData;
    } ) & make_filter<ProcessingChainData *, ProcessingChainData *>( filter::serial_in_order,
    [&]( ProcessingChainData * pData )->ProcessingChainData* {
        if( pData == nullptr )
            return nullptr;
        Mat gray;
        cvtColor( pData->img, gray, COLOR_BGR2GRAY );
        resize( gray, pData->scaleHalf, Size(), .5f, .5f, INTER_LINEAR );
        equalizeHist( pData->scaleHalf, pData->scaleHalf );
        return pData;
    } ) & make_filter<ProcessingChainData *, ProcessingChainData *>( filter::serial_in_order,
    [&]( ProcessingChainData * pData )->ProcessingChainData* {
        if( pData == nullptr )
            return nullptr;
        if( cvFaceMark->empty() || !classifier )
            return pData;
        cvFaceMark->getFaces( pData->scaleHalf, pData->faces );
        cvFaceMark->fit( pData->scaleHalf, pData->faces, pData->landmarks );
        return pData;
    } ) & make_filter<ProcessingChainData *, ProcessingChainData *>( filter::serial_in_order,
    [&]( ProcessingChainData * pData )->ProcessingChainData* {
        if( pData == nullptr )
            return nullptr;
        for( size_t i = 0; i < pData->faces.size(); i++ )
        {
            Rect r = pData->faces[i];
            Point center;
            Scalar color = colors[i % 3];
            float scale = 2.0f;
            int radius;

            double aspect_ratio = ( double )r.width / r.height;
            if( 0.75 < aspect_ratio && aspect_ratio < 1.3 ) {
                center.x = cvRound( ( r.x + r.width * 0.5 ) * scale );
                center.y = cvRound( ( r.y + r.height * 0.5 ) * scale );
                radius = cvRound( ( r.width + r.height ) * 0.27 * scale );
                circle( pData->anonImg, center, radius, Scalar( 0, 0, 0 ), -1 );
            } else {
                rectangle( pData->anonImg, cvPoint( cvRound( r.x * scale ), cvRound( r.y * scale ) ),
                           cvPoint( cvRound( ( r.x + r.width - 1 ) * scale ), cvRound( ( r.y + r.height - 1 ) * scale ) ),
                           Scalar( 0, 0, 0 ), -1 );
            }

            vector<Point2f> pts = pData->landmarks[i];
            for( const auto &it : pts ) {
                center.x = cvRound( it.x * scale );
                center.y = cvRound( it.y * scale );
                circle( pData->anonImg, center, 2, color, -1 );
            }
        }
        return pData;
    } ) & make_filter<ProcessingChainData *, void>( filter::serial_in_order,
    [&]( ProcessingChainData * pData ) {
        if( pData != nullptr && !pipelineStop ) {
            try {
                Mat cvtRgba, toMLModel;
                resize( pData->img, toMLModel, Size( 224, 224 ), 0, 0, INTER_LINEAR );
                if( classifier ) {
                    classifier->addImages( toMLModel );
                }
                cvtColor( pData->anonImg, cvtRgba, COLOR_BGR2RGBA );
                pData->anonImg = cvtRgba.clone();
                queue.push( pData );
            } catch( ... ) {
                LOGW( "Pipeline caught an exception on the queue" );
                pipelineStop = true;
            }
        }
    } ) );
}

shared_ptr<thread> FaceDetector::startThread( cv::VideoCapture &cpt,
        tbb::concurrent_bounded_queue<ProcessingChainData *> &queue, int index )
{
    pipelineStop = false;
    cachedIndex = index;
    return make_shared<thread>( &FaceDetector::pipeline, this, ref( cpt ), ref( queue ) );
}

bool FaceDetector::registerClassifier( IClassifier *ml )
{
    classifier = ml;
    mInferThread = make_shared<thread>( &FaceDetector::inferThread, this );
    mInferThread->detach();
    return true;
}

bool FaceDetector::unloadClassifier()
{
    if( classifier ) {
        classifier = nullptr;
    }
    return true;
}

void FaceDetector::inferThread()
{
    while( !pipelineStop ) {
        if( !classifier ) {
            break;
        }
        classifier->classify();
    }
}
