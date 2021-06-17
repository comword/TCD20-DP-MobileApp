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
}
#endif //INVIGILATOR_UTILS_H
