#ifndef INVIGILATOR_NETWORKREPORTER_H
#define INVIGILATOR_NETWORKREPORTER_H

#include "IResultReporter.h"

#include <memory>
#include <string>

namespace grpc
{
class CallCredentials;
}

class NetworkReporter: public IResultReporter
{
    public:
        NetworkReporter();
        virtual ~NetworkReporter();
        bool init( void *userData ) override;
        void onMLResult( const std::vector<float> &result ) override;
        void onVideoFrame( const cv::Mat &result ) override;

        bool setAuthKey( const std::string &key );
    private:
        static void delGrpcStub( void *stub );
    private:
        std::unique_ptr<void, decltype( &delGrpcStub )> grpcStub;
        std::shared_ptr<grpc::CallCredentials> authCredential;
};

#endif //INVIGILATOR_NETWORKREPORTER_H
