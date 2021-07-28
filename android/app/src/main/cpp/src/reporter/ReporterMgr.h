#ifndef INVIGILATOR_REPORTERMGR_H
#define INVIGILATOR_REPORTERMGR_H

#include <vector>
#include <string>
#include <unordered_map>
#include "IResultReporter.h"

namespace cv
{
class Mat;
}

class ReporterMgr: public virtual IResultReporter
{
    public:
        ReporterMgr();
        virtual ~ReporterMgr();
        bool init( void *userData ) override;
        void registerMgr( ReporterMgr *mgr ) override;
        bool start() override;
        void stop() override;
        const char *getName() override;
        void onMLResult( const std::vector<float> &result ) override;
        void onVideoFrame( const cv::Mat &result ) override;
        void onError( const char *name, const char *reason ) override;
    public:
        void addReporter( IResultReporter *reporter );
        bool removeReporter( const char *name );
        IResultReporter *findReporter( const char *name );
        std::string getCurrentExamId();
        void setCurrentExamId( std::string &id );
    private:
        std::unordered_map<std::string, IResultReporter *> reporterMap;
        std::string mExamId;
};


#endif //INVIGILATOR_REPORTERMGR_H
