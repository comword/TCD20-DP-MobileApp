#include "NetworkReporter.h"

#include <memory>

#include "dlog.h"

#include <grpc/grpc.h>
#include <grpcpp/channel.h>
#include <grpcpp/client_context.h>
#include <grpcpp/create_channel.h>
#include <grpcpp/security/credentials.h>
#include <opencv2/core.hpp>

#include "student.grpc.pb.h"

using namespace std;
using grpc::AccessTokenCredentials;
using grpc::Channel;
using student::StudentApp;

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
    } catch( const std::exception &err ) {
        LOGW( "Exception in initialising NetworkReporter grpcStub: %s", err.what() );
        return false;
    }
}

void NetworkReporter::delGrpcStub( void *stub )
{
    auto castedPtr = static_cast<StudentApp::Stub *>( stub );
    delete castedPtr;
}

bool NetworkReporter::setAuthKey( const std::string &key )
{
    authCredential = grpc::AccessTokenCredentials( key );
    return authCredential != nullptr;
}

void NetworkReporter::onMLResult( const std::vector<float> &result )
{

}

void NetworkReporter::onVideoFrame( const cv::Mat &result )
{

}
