#include "utils.h"

#include <cstdlib>
#include <unwind.h>
#include <dlfcn.h>
#include <iomanip>
#include <cxxabi.h>

#include "dlog.h"

namespace utils
{
const char kIllegalArgumentException[] = "java/lang/IllegalArgumentException";
const char kIllegalStateException[] = "java/lang/IllegalStateException";
const char kNullPointerException[] = "java/lang/NullPointerException";
const char kUnsupportedOperationException[] =
    "java/lang/UnsupportedOperationException";

void ThrowException( JNIEnv *env, const char *clazz, const char *fmt, ... )
{
    va_list args;
    va_start( args, fmt );
    const size_t max_msg_len = 512;
    auto *message = static_cast<char *>( malloc( max_msg_len ) );
    if( message && ( vsnprintf( message, max_msg_len, fmt, args ) >= 0 ) ) {
        env->ThrowNew( env->FindClass( clazz ), message );
    } else {
        env->ThrowNew( env->FindClass( clazz ), "" );
    }
    if( message ) {
        free( message );
    }
    va_end( args );
}

static std::string demangle( const char *symbol )
{
    int status = -1;
    char *demangled = abi::__cxa_demangle( symbol, nullptr, nullptr, &status );
    if( status == 0 ) {
        std::string demangled_str( demangled );
        free( demangled );
        return demangled_str;
    }
    return std::string( symbol );
}

// Backtrace on https://stackoverflow.com/questions/8115192/android-ndk-getting-the-backtrace
struct android_backtrace_state {
    void **current;
    void **end;
};

static _Unwind_Reason_Code unwindCallback( struct _Unwind_Context *context, void *arg )
{
    android_backtrace_state *state = static_cast<android_backtrace_state *>( arg );
    uintptr_t pc = _Unwind_GetIP( context );
    if( pc ) {
        if( state->current == state->end ) {
            return _URC_END_OF_STACK;
        } else {
            *state->current++ = reinterpret_cast<void *>( pc );
        }
    }
    return _URC_NO_REASON;
}

void debugBacktrace( std::ostream &out )
{
    const size_t max = 50;
    void *buffer[max];
    android_backtrace_state state = {buffer, buffer + max};
    _Unwind_Backtrace( unwindCallback, &state );
    const std::size_t count = state.current - buffer;
    for( size_t idx = 1; idx < count && idx < max; ++idx ) {
        const void *addr = buffer[idx];
        Dl_info info;
        if( dladdr( addr, &info ) && info.dli_sname ) {
            out << "#" << std::setw( 2 ) << idx << ": " << addr << " " << demangle( info.dli_sname ) << "\n";
        }
    }
}
}
