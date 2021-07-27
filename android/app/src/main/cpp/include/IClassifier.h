#ifndef INVIGILATOR_ICLASSIFIER_H
#define INVIGILATOR_ICLASSIFIER_H

#include <memory>

namespace cv
{
class Mat;
}

class IResultReporter;

class IClassifier
{
    protected:
        IClassifier() = default;
        virtual ~IClassifier() = default;
    public:
        virtual void classify() = 0;
        virtual void addImages( const cv::Mat &img ) = 0;
        virtual void registerReporter( IResultReporter *rep ) = 0;
};
#endif //INVIGILATOR_ICLASSIFIER_H
