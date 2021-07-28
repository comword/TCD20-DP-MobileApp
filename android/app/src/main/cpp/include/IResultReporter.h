#ifndef INVIGILATOR_IRESULTREPORTER_H
#define INVIGILATOR_IRESULTREPORTER_H

#include <vector>

namespace cv
{
class Mat;
}

class ReporterMgr;

class IResultReporter
{
    protected:
        IResultReporter() = default;
    public:
        virtual ~IResultReporter() = default;
        virtual bool init( void *userData ) = 0;
        virtual void registerMgr( ReporterMgr *mgr ) = 0;
        virtual bool start() = 0;
        virtual void stop() = 0;
        virtual const char *getName() = 0;
        virtual void onMLResult( const std::vector<float> &result ) = 0;
        virtual void onVideoFrame( const cv::Mat &result ) = 0;
        virtual void onError( const char *name, const char *reason ) = 0;
};

#endif //INVIGILATOR_IRESULTREPORTER_H
