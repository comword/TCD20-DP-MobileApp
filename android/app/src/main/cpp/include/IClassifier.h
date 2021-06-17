#ifndef INVIGILATOR_ICLASSIFIER_H
#define INVIGILATOR_ICLASSIFIER_H

#include <memory>
#include <vector>

namespace cv
{
class Mat;
}

class IClassifier
{
    protected:
        IClassifier() = default;
        virtual ~IClassifier() = default;
    public:
        virtual std::unique_ptr<std::vector<float>> classify( const cv::Mat &imgs ) = 0;
};
#endif //INVIGILATOR_ICLASSIFIER_H
