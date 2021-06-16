#include <cstdlib>

#include "utils.h"
#include "dlog.h"

#include <unwind.h>
#include <dlfcn.h>
#include <iomanip>
#include <cxxabi.h>

namespace utils {

    void printGLString(const char *name, GLenum s) {
        const char *v = (const char *) glGetString(s);
        LOGI("GL %s = %s\n", name, v);
    }

    void checkGlError(const char *op) {
        for (GLint error = glGetError(); error; error
                                                        = glGetError()) {
            LOGI("after %s() glError (0x%x)\n", op, error);
        }
    }

    GLuint loadShader(GLenum shaderType, const char *pSource) {
        GLuint shader = glCreateShader(shaderType);
        if (shader) {
            glShaderSource(shader, 1, &pSource, NULL);
            glCompileShader(shader);
            GLint compiled = 0;
            glGetShaderiv(shader, GL_COMPILE_STATUS, &compiled);
            if (!compiled) {
                GLint infoLen = 0;
                glGetShaderiv(shader, GL_INFO_LOG_LENGTH, &infoLen);
                if (infoLen) {
                    char *buf = (char *) malloc(infoLen);
                    if (buf) {
                        glGetShaderInfoLog(shader, infoLen, NULL, buf);
                        LOGE("Could not compile shader %d:\n%s\n",
                             shaderType, buf);
                        free(buf);
                    }
                    glDeleteShader(shader);
                    shader = 0;
                }
            }
        }
        return shader;
    }

    GLuint createProgram(const char *pVertexSource, const char *pFragmentSource) {
        GLuint vertexShader = loadShader(GL_VERTEX_SHADER, pVertexSource);
        if (!vertexShader) {
            return 0;
        }

        GLuint pixelShader = loadShader(GL_FRAGMENT_SHADER, pFragmentSource);
        if (!pixelShader) {
            return 0;
        }

        GLuint program = glCreateProgram();
        if (program) {
            glAttachShader(program, vertexShader);
            checkGlError("glAttachShader");
            glAttachShader(program, pixelShader);
            checkGlError("glAttachShader");
            glLinkProgram(program);
            GLint linkStatus = GL_FALSE;
            glGetProgramiv(program, GL_LINK_STATUS, &linkStatus);
            if (linkStatus != GL_TRUE) {
                GLint bufLength = 0;
                glGetProgramiv(program, GL_INFO_LOG_LENGTH, &bufLength);
                if (bufLength) {
                    char *buf = (char *) malloc(bufLength);
                    if (buf) {
                        glGetProgramInfoLog(program, bufLength, NULL, buf);
                        LOGE("Could not link program:\n%s\n", buf);
                        free(buf);
                    }
                }
                glDeleteProgram(program);
                program = 0;
            }
        }
        return program;
    }

    void
    ortho(float *mat4, float left, float right, float bottom, float top, float near, float far) {
        float rl = right - left;
        float tb = top - bottom;
        float fn = far - near;

        mat4[0] = 2.0f / rl;
        mat4[12] = -(right + left) / rl;

        mat4[5] = 2.0f / tb;
        mat4[13] = -(top + bottom) / tb;

        mat4[10] = -2.0f / fn;
        mat4[14] = -(far + near) / fn;
    }

    const char kIllegalArgumentException[] = "java/lang/IllegalArgumentException";
    const char kIllegalStateException[] = "java/lang/IllegalStateException";
    const char kNullPointerException[] = "java/lang/NullPointerException";
    const char kUnsupportedOperationException[] =
            "java/lang/UnsupportedOperationException";

    void ThrowException(JNIEnv* env, const char* clazz, const char* fmt, ...) {
        va_list args;
        va_start(args, fmt);
        const size_t max_msg_len = 512;
        auto* message = static_cast<char*>(malloc(max_msg_len));
        if (message && (vsnprintf(message, max_msg_len, fmt, args) >= 0)) {
            env->ThrowNew(env->FindClass(clazz), message);
        } else {
            env->ThrowNew(env->FindClass(clazz), "");
        }
        if (message) {
            free(message);
        }
        va_end(args);
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
