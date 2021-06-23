package ie.tcd.cs7cs5.invigilatus.modules

import android.content.Context
import android.opengl.GLSurfaceView
import android.util.Log
import org.unimodules.core.ModuleRegistry
import javax.microedition.khronos.egl.EGL10
import javax.microedition.khronos.egl.EGLConfig
import javax.microedition.khronos.egl.EGLContext
import javax.microedition.khronos.egl.EGLDisplay

class CamGLView : GLSurfaceView {

    private var camRenderer: CamRenderer
    private var mModuleRegistry: ModuleRegistry

    constructor(context: Context, moduleRegistry: ModuleRegistry) : super(context) {
        mModuleRegistry = moduleRegistry
        setEGLContextFactory(object : EGLContextFactory {
            private val EGL_CONTEXT_CLIENT_VERSION = 0x3098

            override fun createContext(
                egl: EGL10,
                display: EGLDisplay?,
                config: EGLConfig?
            ): EGLContext? {
                val glContext = egl.eglCreateContext(
                    display,
                    config,
                    EGL10.EGL_NO_CONTEXT,
                    intArrayOf(EGL_CONTEXT_CLIENT_VERSION, 3, EGL10.EGL_NONE)
                )
                return if(glContext == null) {
                    setEGLContextClientVersion(2)
                    egl.eglCreateContext(
                        display,
                        config,
                        EGL10.EGL_NO_CONTEXT,
                        intArrayOf(EGL_CONTEXT_CLIENT_VERSION, 2, EGL10.EGL_NONE)
                    )
                } else
                    glContext
            }

            override fun destroyContext(
                egl: EGL10, display: EGLDisplay,
                context: EGLContext
            ) {
                if (!egl.eglDestroyContext(display, context)) {
                    Log.e("AdaptContextFactory", "display:$display context: $context")
                    Log.i("AdaptContextFactory", "tid=" + Thread.currentThread().id)
                }
            }
        })
        setEGLContextClientVersion(3)
        val cameraModule: CameraModule? = mModuleRegistry.getExportedModule("CameraGLModule") as CameraModule?
        camRenderer = CamRenderer(cameraModule?.cameraHandle)
        setRenderer(camRenderer)
    }
}
