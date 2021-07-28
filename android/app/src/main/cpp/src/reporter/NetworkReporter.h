#ifndef INVIGILATOR_NETWORKREPORTER_H
#define INVIGILATOR_NETWORKREPORTER_H

#include "IResultReporter.h"

#include <memory>
#include <string>
#include <thread>
#include <tbb/concurrent_queue.h>

namespace grpc
{
class CallCredentials;
}

namespace cv
{
class Mat;
}

class NetworkReporter: public IResultReporter
{
    public:
        NetworkReporter();
        virtual ~NetworkReporter();
        bool init( void *userData ) override;
        bool start() override;
        void stop() override;
        void registerMgr( ReporterMgr *mgr ) override;
        const char *getName() override;
        void onMLResult( const std::vector<float> &result ) override;
        void onVideoFrame( const cv::Mat &result ) override;
        void onError( const char *name, const char *reason ) override;
        bool setAuthKey( const std::string &key );
    private:
        static void delGrpcStub( void *stub );
        void streamThread( std::string &examId );
    private:
        std::unique_ptr<void, decltype( &delGrpcStub )> grpcStub;
        std::shared_ptr<grpc::CallCredentials> authCredential;
        std::shared_ptr<tbb::concurrent_bounded_queue<cv::Mat *>> imgQueue;
        std::shared_ptr<std::thread> mStreamThread;
        ReporterMgr *reporterMgr = nullptr;
        volatile bool pipelineStop = true;
};

#endif //INVIGILATOR_NETWORKREPORTER_H
