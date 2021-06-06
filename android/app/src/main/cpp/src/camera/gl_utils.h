#ifndef INVIGILATOR_GL_UTILS_H
#define INVIGILATOR_GL_UTILS_H

#include <GLES2/gl2.h>
#include <GLES2/gl2ext.h>

namespace glUtils {
    void printGLString(const char *name, GLenum s);

    void checkGlError(const char *op);

    GLuint loadShader(GLenum shaderType, const char *pSource);

    GLuint createProgram(const char *pVertexSource, const char *pFragmentSource);

    void ortho(float *mat4, float left, float right, float bottom, float top, float near, float far);
}
#endif //INVIGILATOR_GL_UTILS_H
