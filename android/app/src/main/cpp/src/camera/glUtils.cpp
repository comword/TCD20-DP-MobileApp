#include "glUtils.h"

#include <cstdlib>

#include "dlog.h"

namespace utils
{

void printGLString( const char *name, GLenum s )
{
    const char *v = ( const char * ) glGetString( s );
    LOGI( "GL %s = %s\n", name, v );
}

void checkGlError( const char *op )
{
    for( GLint error = glGetError(); error; error
         = glGetError() ) {
        LOGI( "after %s() glError (0x%x)\n", op, error );
    }
}

GLuint loadShader( GLenum shaderType, const char *pSource )
{
    GLuint shader = glCreateShader( shaderType );
    if( shader ) {
        glShaderSource( shader, 1, &pSource, NULL );
        glCompileShader( shader );
        GLint compiled = 0;
        glGetShaderiv( shader, GL_COMPILE_STATUS, &compiled );
        if( !compiled ) {
            GLint infoLen = 0;
            glGetShaderiv( shader, GL_INFO_LOG_LENGTH, &infoLen );
            if( infoLen ) {
                char *buf = ( char * ) malloc( infoLen );
                if( buf ) {
                    glGetShaderInfoLog( shader, infoLen, NULL, buf );
                    LOGE( "Could not compile shader %d:\n%s\n",
                          shaderType, buf );
                    free( buf );
                }
                glDeleteShader( shader );
                shader = 0;
            }
        }
    }
    return shader;
}

GLuint createProgram( const char *pVertexSource, const char *pFragmentSource )
{
    GLuint vertexShader = loadShader( GL_VERTEX_SHADER, pVertexSource );
    if( !vertexShader ) {
        return 0;
    }

    GLuint pixelShader = loadShader( GL_FRAGMENT_SHADER, pFragmentSource );
    if( !pixelShader ) {
        return 0;
    }

    GLuint program = glCreateProgram();
    if( program ) {
        glAttachShader( program, vertexShader );
        checkGlError( "glAttachShader" );
        glAttachShader( program, pixelShader );
        checkGlError( "glAttachShader" );
        glLinkProgram( program );
        GLint linkStatus = GL_FALSE;
        glGetProgramiv( program, GL_LINK_STATUS, &linkStatus );
        if( linkStatus != GL_TRUE ) {
            GLint bufLength = 0;
            glGetProgramiv( program, GL_INFO_LOG_LENGTH, &bufLength );
            if( bufLength ) {
                char *buf = ( char * ) malloc( bufLength );
                if( buf ) {
                    glGetProgramInfoLog( program, bufLength, NULL, buf );
                    LOGE( "Could not link program:\n%s\n", buf );
                    free( buf );
                }
            }
            glDeleteProgram( program );
            program = 0;
        }
    }
    return program;
}

void
ortho( float *mat4, float left, float right, float bottom, float top, float near, float far )
{
    float rl = right - left;
    float tb = top - bottom;
    float fn = far - near;

    mat4[0] = 2.0f / rl;
    mat4[12] = -( right + left ) / rl;

    mat4[5] = 2.0f / tb;
    mat4[13] = -( top + bottom ) / tb;

    mat4[10] = -2.0f / fn;
    mat4[14] = -( far + near ) / fn;
}
}
