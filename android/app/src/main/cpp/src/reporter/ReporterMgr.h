#ifndef INVIGILATOR_REPORTERMGR_H
#define INVIGILATOR_REPORTERMGR_H

#include <vector>
#include <string>
#include <unordered_map>

namespace cv
{
class Mat;
}

class IResultReporter;

class ReporterMgr
{
    public:
        ReporterMgr();
        virtual ~ReporterMgr();
        void addReporter( IResultReporter *reporter );
        bool removeReporter( const char *name );
        IResultReporter *findReporter( const char *name );
        void broadcastMLResult( const std::vector<float> &result );
        void broadcastVideoFrame( const cv::Mat &result );
        std::string getCurrentExamId();
        void setCurrentExamId( std::string &id );
        void notifyError( const char *name, const char *reason );
    private:
        std::unordered_map<std::string, IResultReporter *> reporterMap;
        std::string mExamId;
};


#endif //INVIGILATOR_REPORTERMGR_H
