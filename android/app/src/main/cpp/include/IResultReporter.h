#ifndef INVIGILATOR_IRESULTREPORTER_H
#define INVIGILATOR_IRESULTREPORTER_H

#include <vector>

class IResultReporter
{
    protected:
        IResultReporter() = default;
        virtual ~IResultReporter() = default;
    public:
        virtual bool init( void *userData ) = 0;
        virtual void deInit() = 0;
        virtual void onResult( const std::vector<float> &result ) = 0;
};

#endif //INVIGILATOR_IRESULTREPORTER_H