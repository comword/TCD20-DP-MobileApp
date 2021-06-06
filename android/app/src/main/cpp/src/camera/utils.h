#ifndef INVIGILATOR_UTILS_H
#define INVIGILATOR_UTILS_H

#include <jni.h>
#include <GLES2/gl2.h>
#include <GLES2/gl2ext.h>

namespace utils {
    void printGLString(const char *name, GLenum s);

    void checkGlError(const char *op);

    GLuint loadShader(GLenum shaderType, const char *pSource);

    GLuint createProgram(const char *pVertexSource, const char *pFragmentSource);

    void ortho(float *mat4, float left, float right, float bottom, float top, float near, float far);

    extern const char kIllegalArgumentException[];
    extern const char kIllegalStateException[];
    extern const char kNullPointerException[];
    extern const char kUnsupportedOperationException[];

    void ThrowException(JNIEnv* env, const char* clazz, const char* fmt, ...);
}
#endif //INVIGILATOR_UTILS_H
