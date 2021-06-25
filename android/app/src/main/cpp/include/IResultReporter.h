#ifndef INVIGILATOR_IRESULTREPORTER_H
#define INVIGILATOR_IRESULTREPORTER_H

#include <vector>

namespace cv
{
class Mat;
}

class IResultReporter
{
    protected:
        IResultReporter() = default;
        virtual ~IResultReporter() = default;
    public:
        virtual bool init( void *userData ) = 0;
        virtual void onMLResult( const std::vector<float> &result ) = 0;
        virtual void onVideoFrame( const cv::Mat &result ) = 0;
};

#endif //INVIGILATOR_IRESULTREPORTER_H
