package ie.tcd.cs7cs5.invigilatus.video

import android.Manifest
import android.content.Context
import android.util.Log
import org.unimodules.core.ExportedModule
import org.unimodules.core.Promise
import org.unimodules.core.interfaces.ExpoMethod
import org.unimodules.interfaces.permissions.Permissions
import org.unimodules.core.ModuleRegistry
import java.lang.Exception

class CameraModule(context: Context): ExportedModule(context) {
    private lateinit var mModuleRegistry: ModuleRegistry
    var cameraHandle: Long = 0
        private set
    var mCameraIdx: Int = 0
        private set
    var mCameraRunning: Boolean = false
        private set

    init {
        System.loadLibrary("camera-view")
        cameraHandle = nativeInitCamera()
        Log.i("CameraModule", "cameraHandle: $cameraHandle")
    }

    override fun onDestroy() {
        if(cameraHandle != 0L)
            nativeDeInitCamera(cameraHandle)
    }

    override fun onCreate(moduleRegistry: ModuleRegistry) {
        mModuleRegistry = moduleRegistry
    }

    override fun getName(): String {
        return "CameraGLModule"
    }

    @ExpoMethod
    fun requestPermissionsAsync(promise: Promise) {
        val permissionsManager: Permissions = mModuleRegistry.getModule(Permissions::class.java)
        if (permissionsManager == null) {
            promise.reject(
                "E_NO_PERMISSIONS",
                "Permissions module is null. Are you sure all the installed Expo modules are properly linked?"
            )
            return
        }
        permissionsManager.askForPermissionsWithPromise(promise, Manifest.permission.CAMERA)
    }

    @ExpoMethod
    fun requestCameraPermissionsAsync(promise: Promise) {
        val permissionsManager: Permissions? = mModuleRegistry.getModule(Permissions::class.java)
        if (permissionsManager == null) {
            promise.reject(
                "E_NO_PERMISSIONS",
                "Permissions module is null. Are you sure all the installed Expo modules are properly linked?"
            )
            return
        }
        permissionsManager.askForPermissionsWithPromise(promise, Manifest.permission.CAMERA)
    }

    @ExpoMethod
    fun requestMicrophonePermissionsAsync(promise: Promise) {
        val permissionsManager: Permissions? = mModuleRegistry.getModule(Permissions::class.java)
        if (permissionsManager == null) {
            promise.reject(
                "E_NO_PERMISSIONS",
                "Permissions module is null. Are you sure all the installed Expo modules are properly linked?"
            )
            return
        }
        permissionsManager.askForPermissionsWithPromise(promise, Manifest.permission.RECORD_AUDIO)
    }

    @ExpoMethod
    fun getPermissionsAsync(promise: Promise) {
        val permissionsManager: Permissions? = mModuleRegistry.getModule(Permissions::class.java)
        if (permissionsManager == null) {
            promise.reject(
                "E_NO_PERMISSIONS",
                "Permissions module is null. Are you sure all the installed Expo modules are properly linked?"
            )
            return
        }
        permissionsManager.getPermissionsWithPromise(promise, Manifest.permission.CAMERA)
    }

    @ExpoMethod
    fun getCameraPermissionsAsync(promise: Promise) {
        val permissionsManager: Permissions? = mModuleRegistry.getModule(Permissions::class.java)
        if (permissionsManager == null) {
            promise.reject(
                "E_NO_PERMISSIONS",
                "Permissions module is null. Are you sure all the installed Expo modules are properly linked?"
            )
            return
        }
        permissionsManager.getPermissionsWithPromise(promise, Manifest.permission.CAMERA)
    }

    @ExpoMethod
    fun getMicrophonePermissionsAsync(promise: Promise) {
        val permissionsManager: Permissions? = mModuleRegistry.getModule(Permissions::class.java)
        if (permissionsManager == null) {
            promise.reject(
                "E_NO_PERMISSIONS",
                "Permissions module is null. Are you sure all the installed Expo modules are properly linked?"
            )
            return
        }
        permissionsManager.getPermissionsWithPromise(promise, Manifest.permission.RECORD_AUDIO)
    }

    @ExpoMethod
    fun setCameraIndex(camIdx: Int, promise: Promise) {
        if(cameraHandle == 0L) {
            promise.reject("E_NOT_INIT", "Native cameraHandle is empty, please call initCamera first.")
            return
        }
        if (mCameraIdx != camIdx) {
            mCameraIdx = camIdx
            if(mCameraRunning) {
                nativeCameraStop(cameraHandle)
                nativeCameraStart(cameraHandle, camIdx)
            }
        }
        promise.resolve(true)
    }

    @ExpoMethod
    fun startCamera(promise: Promise) {
        if(mCameraRunning) {
            promise.reject("E_RUNNING", "The camera is running")
            return
        }
        nativeCameraStart(cameraHandle, mCameraIdx)
        mCameraRunning = true
        promise.resolve(true)
    }

    @ExpoMethod
    fun stopCamera(promise: Promise) {
        if(!mCameraRunning) {
            promise.reject("E_RUNNING", "The camera is not running")
            return
        }
        nativeCameraStop(cameraHandle)
        mCameraRunning = false
        promise.resolve(true)
    }

    private external fun nativeInitCamera(): Long
    private external fun nativeDeInitCamera(camHandle: Long)
    private external fun nativeCameraStart(camHandle: Long, camIdx: Int): Boolean
    private external fun nativeCameraStop(camHandle: Long)
    private external fun nativeCameraSize(camHandle: Long, width: Int, height: Int): Boolean
}
