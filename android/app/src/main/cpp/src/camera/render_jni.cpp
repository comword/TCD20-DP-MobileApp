#include <jni.h>

#include <cstdlib>

#include "Camera.h"
#include "dlog.h"
#include "glUtils.h"
#include "utils.h"

#include <android/native_window_jni.h>

using namespace utils;

auto vertexShaderSrc = R"(
        precision highp float;
        attribute vec3 vertexPosition;
        attribute vec2 uvs;
        varying vec2 varUvs;
        uniform mat4 texMatrix;
        uniform mat4 mvp;
        void main()
        {
            varUvs = (texMatrix * vec4(uvs.x, uvs.y, 0, 1.0)).xy;
            gl_Position = mvp * vec4(vertexPosition, 1.0);
        }
)";

auto fragmentShaderSrc = R"(
        #extension GL_OES_EGL_image_external : require
        precision mediump float;
        varying vec2 varUvs;
        uniform samplerExternalOES texSampler;
        void main()
        {
            gl_FragColor = texture2D(texSampler, varUvs);
        }
)";

static GLuint gProgram;

static GLint vtxPosAttrib;
static GLint uvsAttrib;
static GLint mvpMatrix;
static GLint texMatrix;
static GLint texSampler;
static GLuint buf[2];
static GLuint textureId;

static int width = 0;
static int height = 0;

static void initSurface(jint texId)
{
    printGLString("Version", GL_VERSION);
    printGLString("Vendor", GL_VENDOR);
    printGLString("Renderer", GL_RENDERER);
    printGLString("Extensions", GL_EXTENSIONS);
    gProgram = createProgram(vertexShaderSrc, fragmentShaderSrc);

    // Store attribute and uniform locations
    vtxPosAttrib = glGetAttribLocation(gProgram, "vertexPosition");
    uvsAttrib = glGetAttribLocation(gProgram, "uvs");
    mvpMatrix = glGetUniformLocation(gProgram, "mvp");
    texMatrix = glGetUniformLocation(gProgram, "texMatrix");
    texSampler = glGetUniformLocation(gProgram, "texSampler");

    // Prepare buffers
    glGenBuffers(2, buf);

    // Set up vertices
    float vertices[] {
            // x, y, z, u, v
            -1, -1, 0, 0, 0,
            -1, 1, 0, 0, 1,
            1, 1, 0, 1, 1,
            1, -1, 0, 1, 0
    };
    glBindBuffer(GL_ARRAY_BUFFER, buf[0]);
    glBufferData(GL_ARRAY_BUFFER, sizeof(vertices), vertices, GL_DYNAMIC_DRAW);

    // Set up indices
    GLuint indices[] { 2, 1, 0, 0, 3, 2 };
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, buf[1]);
    glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(indices), indices, GL_DYNAMIC_DRAW);

    // We can use the id to bind to GL_TEXTURE_EXTERNAL_OES
    textureId = texId;
}

static void drawFrame(JNIEnv* env, jfloatArray texMatArray)
{
    glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT | GL_STENCIL_BUFFER_BIT);
    glClearColor(0, 0, 0, 1);

    glUseProgram(gProgram);

    // Configure main transformations
    float mvp[] = {
            1.0f, 0, 0, 0,
            0, 1.0f, 0, 0,
            0, 0, 1.0f, 0,
            0, 0, 0, 1.0f
    };

    float aspect = width > height ? float(width)/float(height) : float(height)/float(width);
    if (width < height) // portrait
        ortho(mvp, -1.0f, 1.0f, -aspect, aspect, -1.0f, 1.0f);
    else // landscape
        ortho(mvp, -aspect, aspect, -1.0f, 1.0f, -1.0f, 1.0f);

    glUniformMatrix4fv(mvpMatrix, 1, false, mvp);

    glActiveTexture(GL_TEXTURE0);
    glBindTexture(GL_TEXTURE_EXTERNAL_OES, textureId);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

    // Pass SurfaceTexture transformations to shader
    float* tm = env->GetFloatArrayElements(texMatArray, 0);
    glUniformMatrix4fv(texMatrix, 1, false, tm);
    env->ReleaseFloatArrayElements(texMatArray, tm, 0);

    // Set the SurfaceTexture sampler
    glUniform1i(texSampler, 0);

    // Set up vertices/indices and draw
    glBindBuffer(GL_ARRAY_BUFFER, buf[0]);
    glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, buf[1]);

    glEnableVertexAttribArray(vtxPosAttrib);
    glVertexAttribPointer(vtxPosAttrib, 3, GL_FLOAT, GL_FALSE, sizeof(float) * 5, (void*)0);

    glEnableVertexAttribArray(uvsAttrib);
    glVertexAttribPointer(uvsAttrib, 2, GL_FLOAT, GL_FALSE, sizeof(float) * 5, (void *)(3 * sizeof(float)));

    glViewport(0, 0, width, height);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_CLAMP_TO_EDGE);
    glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_CLAMP_TO_EDGE);

    glDrawElements(GL_TRIANGLES, 6, GL_UNSIGNED_INT, 0);
}

extern "C"
JNIEXPORT void JNICALL
Java_ie_tcd_cs7cs5_invigilatus_modules_CamRenderer_onSurfaceCreated(JNIEnv *env, jobject thiz, jlong camera_handle, jint texture_id, jobject surface) {
    auto camera = utils::convertLongToCls<Camera>(env, camera_handle);
    if(!camera)
        return;
    auto [tWidth, tHeight] = camera->getCaptureSize();
    LOGI("onSurface create, camera input size: %dx%d", tWidth, tHeight);
    initSurface(texture_id);
    camera->initSurface(ANativeWindow_fromSurface( env, surface ));
}

extern "C"
JNIEXPORT void JNICALL
Java_ie_tcd_cs7cs5_invigilatus_modules_CamRenderer_onSurfaceChanged(JNIEnv *env, jobject thiz, jint w, jint h) {
    width = w;
    height = h;
    LOGI("onSurfaceChanged, size: %dx%d", w, h);
}

extern "C"
JNIEXPORT void JNICALL
Java_ie_tcd_cs7cs5_invigilatus_modules_CamRenderer_onDrawFrame(JNIEnv *env, jobject thiz, jfloatArray texMatArray) {
    drawFrame(env, texMatArray);
}
