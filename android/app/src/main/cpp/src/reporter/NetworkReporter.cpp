#include "NetworkReporter.h"

#include <memory>

#include "dlog.h"
#include "ReporterMgr.h"

#include <grpc/grpc.h>
#include <grpcpp/channel.h>
#include <grpcpp/client_context.h>
#include <grpcpp/create_channel.h>
#include <grpcpp/security/credentials.h>
#include <opencv2/core.hpp>
#include <tbb/pipeline.h>
#include <opencv2/imgcodecs.hpp>

#include "student.grpc.pb.h"

using namespace std;
using grpc::AccessTokenCredentials;
using grpc::Channel;
using grpc::ClientContext;
using grpc::ClientReader;
using grpc::ClientReaderWriter;
using grpc::ClientWriter;
using grpc::Status;
using student::MetaData;
using student::StudentApp;
using student::StreamVideoRequest;
using student::CommonGetResponse;

NetworkReporter::NetworkReporter(): grpcStub( nullptr, &delGrpcStub ) {}
NetworkReporter::~NetworkReporter() = default;

bool NetworkReporter::init( void *userData )
{
    try {
        auto castedPtr = static_cast<shared_ptr<Channel>*>( userData );
        auto pChannel = move( *castedPtr );
        grpcStub = unique_ptr<void, decltype( &delGrpcStub )>( StudentApp::NewStub( pChannel ).release(),
                   &delGrpcStub );
        return grpcStub != nullptr;
    } catch( const exception &err ) {
        LOGW( "Exception in initialising NetworkReporter grpcStub: %s", err.what() );
        return false;
    }
}

void NetworkReporter::delGrpcStub( void *stub )
{
    auto castedPtr = static_cast<StudentApp::Stub *>( stub );
    delete castedPtr;
}

bool NetworkReporter::setAuthKey( const string &key )
{
    authCredential = grpc::AccessTokenCredentials( key );
    return authCredential != nullptr;
}

bool NetworkReporter::start()
{
    pipelineStop = false;
    imgQueue = make_shared<tbb::concurrent_bounded_queue<cv::Mat *>>();
    imgQueue->set_capacity( 5 );
    auto examId = reporterMgr->getCurrentExamId();
    mStreamThread = make_shared<thread>( &NetworkReporter::streamThread, this, ref( examId ) );
    return true;
}

void NetworkReporter::onMLResult( const vector<float> &result ) {}

void NetworkReporter::onVideoFrame( const cv::Mat &result )
{
    if( !pipelineStop ) {
        auto img = new cv::Mat();
        result.copyTo( *img );
        auto success = imgQueue->try_push( img );
        if( !success ) {
            LOGI( "Frame queue is full, so a frame is dropped, please check your Internet connection" );
        }
    }
}

void NetworkReporter::streamThread( string &examId )
{
    using namespace tbb;
    ClientContext context;
    auto _stub = static_cast<StudentApp::Stub *>( grpcStub.get() );
    unique_ptr<ClientReaderWriter<StreamVideoRequest, CommonGetResponse> > stream(
        _stub->StreamVideo(
            &context ) );

    {
        //push examId
        StreamVideoRequest req;
        MetaData metaData;
        metaData.set_examid( examId );
        req.mutable_metadata()->CopyFrom( metaData );
        stream->Write( req );
    }

    std::vector<int> jpgParam( 2 );
    jpgParam[0] = cv::IMWRITE_JPEG_QUALITY;
    jpgParam[1] = 80; //default(95) 0-100
    cv::Mat *img = nullptr;
    parallel_pipeline( 2,
                       make_filter<void, void>
                       ( filter::parallel, [&](
    flow_control & fc ) {
        // send thread
        if( pipelineStop ) {
            fc.stop();
            return;
        }
        imgQueue->pop( img );
        if( img == nullptr ) {
            return;
        }
        std::vector<uchar> buff;
        cv::imencode( ".jpg", *img, buff, jpgParam );
        StreamVideoRequest req;
        req.set_chunkdata( &buff.front(), buff.size() );
        stream->Write( req );
        delete img;
        img = nullptr;
    } ) & make_filter<void, void>
    ( filter::parallel,
    [&]( flow_control & fc ) {
        // receive thread
        if( pipelineStop ) {
            fc.stop();
            return;
        }
        CommonGetResponse rsp;
        auto readDone = stream->Read( &rsp );
        if( !readDone ) {
            const char *errMsg =
                "Failed reading data from server, please check your Internet connection and restart streaming";
            LOGI( "%s", errMsg );
            reporterMgr->notifyError( getName(), errMsg );
            pipelineStop = true;
            fc.stop();
            return;
        }
    } ) );
}

const char *NetworkReporter::getName()
{
    return "NetworkReporter";
}

void NetworkReporter::registerMgr( ReporterMgr *mgr )
{
    reporterMgr = mgr;
}

void NetworkReporter::stop()
{
    pipelineStop = true;
}
