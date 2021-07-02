#include "ReporterMgr.h"
#include <cassert>

#include "dlog.h"
#include "IResultReporter.h"
#include "JavaReporter.h"

ReporterMgr::ReporterMgr() = default;

ReporterMgr::~ReporterMgr()
{
    for( auto it = reporterMap.begin(); it != reporterMap.end(); ) {
        delete it->second;
        it = reporterMap.erase( it );
    }
}

void ReporterMgr::addReporter( IResultReporter *reporter )
{
    assert( reporter );
    auto name = reporter->getName();
    reporterMap[name] = reporter;
}

bool ReporterMgr::removeReporter( const char *name )
{
    if( reporterMap.find( name ) == reporterMap.end() ) {
        return false;    //Not exist
    }
    delete reporterMap[name];
    reporterMap.erase( name );
    return true;
}

IResultReporter *ReporterMgr::findReporter( const char *name )
{
    if( reporterMap.find( name ) == reporterMap.end() ) {
        return nullptr;
    }
    return reporterMap[name];
}

void ReporterMgr::broadcastMLResult( const std::vector<float> &result )
{
    for( const auto &it : reporterMap ) {
        it.second->onMLResult( result );
    }
}

void ReporterMgr::broadcastVideoFrame( const cv::Mat &result )
{
    for( const auto &it : reporterMap ) {
        it.second->onVideoFrame( result );
    }
}

std::string ReporterMgr::getCurrentExamId()
{
    return mExamId;
}

void ReporterMgr::setCurrentExamId( std::string &id )
{
    mExamId = id;
}

void ReporterMgr::notifyError( const char *name, const char *reason )
{
    auto reporter = reinterpret_cast<JavaReporter *>( findReporter( "JavaReporter" ) );
    if( !reporter ) {
        LOGW( "JavaReporter not found in ReporterMgr registry." );
        return;
    }
    reporter->reportError( name, reason );
}
