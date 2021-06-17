#ifndef INVIGILATOR_UTILS_H
#define INVIGILATOR_UTILS_H

#include <jni.h>
#include <ostream>

namespace utils
{
extern const char kIllegalArgumentException[];
extern const char kIllegalStateException[];
extern const char kNullPointerException[];
extern const char kUnsupportedOperationException[];

void ThrowException( JNIEnv *env, const char *clazz, const char *fmt, ... );
void debugBacktrace( std::ostream &out );
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
