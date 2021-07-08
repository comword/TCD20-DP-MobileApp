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

bool ReporterMgr::init( void *userData )
{
    return true;
}

void ReporterMgr::registerMgr( ReporterMgr *mgr ) {}

bool ReporterMgr::start()
{
    return true;
}

void ReporterMgr::stop() {}

const char *ReporterMgr::getName()
{
    return "ReporterMgr";
}

void ReporterMgr::addReporter( IResultReporter *reporter )
{
    assert( reporter );
    reporter->registerMgr( this );
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

void ReporterMgr::onMLResult( const std::vector<float> &result )
{
    for( const auto &it : reporterMap ) {
        it.second->onMLResult( result );
    }
}

void ReporterMgr::onVideoFrame( const cv::Mat &result )
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
