#ifndef INVIGILATOR_UTILS_H
#define INVIGILATOR_UTILS_H

#include <jni.h>
#include <ostream>

#include "export.h"

namespace utils
{
DLL_PUBLIC extern const char kIllegalArgumentException[];
DLL_PUBLIC extern const char kIllegalStateException[];
DLL_PUBLIC extern const char kNullPointerException[];
DLL_PUBLIC extern const char kUnsupportedOperationException[];

DLL_PUBLIC void ThrowException( JNIEnv *env, const char *clazz, const char *fmt, ... );
DLL_PUBLIC void debugBacktrace( std::ostream &out );

template<class T>
T *convertLongToCls( JNIEnv *env, jlong handle )
{
    if( handle == 0 ) {
        utils::ThrowException( env, utils::kIllegalArgumentException,
                               "Internal error: Invalid handle to class." );
        return nullptr;
    }
    return reinterpret_cast<T *>( handle );
}
}
#endif //INVIGILATOR_UTILS_H
