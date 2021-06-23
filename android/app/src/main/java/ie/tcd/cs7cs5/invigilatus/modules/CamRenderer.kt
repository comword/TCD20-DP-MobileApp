package ie.tcd.cs7cs5.invigilatus.modules

import android.graphics.SurfaceTexture
import android.opengl.GLES11Ext.GL_TEXTURE_EXTERNAL_OES
import android.opengl.GLES20
import android.opengl.GLSurfaceView
import android.util.Log
import android.view.Surface
import javax.microedition.khronos.egl.EGLConfig
import javax.microedition.khronos.opengles.GL10

// Ref: https://github.com/sixo/native-camera/blob/master/app/src/main/java/eu/sisik/cam/CamRenderer.kt
class CamRenderer(camHandle: Long?) : GLSurfaceView.Renderer {
    private lateinit var surfaceTexture: SurfaceTexture
    private val texMatrix = FloatArray(16)
    @Volatile private var frameAvailable: Boolean = false
    private val lock = Object()
    private var cameraHandle: Long? = camHandle

    init {
        System.loadLibrary("camera-view")
    }

    companion object {
        val TAG = CamRenderer::class.simpleName
    }

    override fun onSurfaceCreated(gl: GL10?, config: EGLConfig?) {
        val textures = IntArray(1)
        GLES20.glGenTextures(1, textures, 0)
        GLES20.glBindTexture(GL_TEXTURE_EXTERNAL_OES, textures[0])

        surfaceTexture = SurfaceTexture(textures[0])
        surfaceTexture.setOnFrameAvailableListener {
            synchronized(lock) {
                frameAvailable = true
            }
        }

        val surface = Surface(surfaceTexture)
        if(cameraHandle == null)
            onSurfaceCreated(0, textures[0], surface)
        else {
            Log.i(TAG, "cameraHandle: $cameraHandle")
            onSurfaceCreated(cameraHandle!!, textures[0], surface)
        }
    }

    override fun onSurfaceChanged(gl: GL10?, width: Int, height: Int) {
        Log.d(TAG, "onSurfaceChanged $width x $height")
        onSurfaceChanged(width, height)
    }

    override fun onDrawFrame(gl: GL10?) {
        synchronized(lock) {
            if (frameAvailable) {
                surfaceTexture.updateTexImage()
                surfaceTexture.getTransformMatrix(texMatrix)
                frameAvailable = false
            }
        }

        onDrawFrame(texMatrix)
    }

    private external fun onSurfaceCreated(cameraHandle: Long, textureId: Int, surface: Surface)
    private external fun onSurfaceChanged(width: Int, height: Int)
    private external fun onDrawFrame(texMat: FloatArray)
}
