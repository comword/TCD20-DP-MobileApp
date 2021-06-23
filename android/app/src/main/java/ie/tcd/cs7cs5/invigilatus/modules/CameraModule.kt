package ie.tcd.cs7cs5.invigilatus.modules

import android.Manifest
import android.content.Context
import android.util.Log
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import org.unimodules.core.ExportedModule
import org.unimodules.core.Promise
import org.unimodules.core.interfaces.ExpoMethod
import org.unimodules.interfaces.permissions.Permissions
import org.unimodules.core.ModuleRegistry
import org.unimodules.core.interfaces.services.EventEmitter
import android.os.Bundle

class CameraModule(context: Context): ExportedModule(context) {
    private lateinit var mModuleRegistry: ModuleRegistry
    var cameraHandle: Long = 0
        private set
    var mCameraIdx: Int = 0
        private set
    var mCameraRunning: Boolean = false
        private set
    lateinit var haarCascadePath: String
        private set
    lateinit var modelLBFPath: String
        private set

    init {
        System.loadLibrary("camera-view")
        nativeInit()
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
                promise.resolve(nativeCameraStart(cameraHandle, camIdx))
            }
        }
    }

    @ExpoMethod
    fun startCamera(promise: Promise) {
        if(mCameraRunning) {
            promise.reject("E_RUNNING", "The camera is running")
            return
        }
        mCameraRunning = nativeCameraStart(cameraHandle, mCameraIdx)
        promise.resolve(mCameraRunning)
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

    @ExpoMethod
    fun startInvigilate(promise: Promise) {
        if(cameraHandle == 0L) {
            promise.reject("E_NOT_INIT", "Native cameraHandle is empty, please call initCamera first.")
            return
        }
        val classifierModule = mModuleRegistry.getExportedModule("PostureClassify") as MLModule?
        if (classifierModule == null) {
            promise.reject(
                "E_NO_CLASSIFIER",
                "Posture classifier module is null."
            )
            return
        }
        if(classifierModule.mPCHandle == 0L) {
            promise.reject(
                "E_CLASSIFIER",
                "Posture classifier module has null native handle."
            )
            return
        }
        promise.resolve(nativeConnectClassifier(cameraHandle, classifierModule.mPCHandle))
    }

    @ExpoMethod
    fun stopInvigilate(promise: Promise) {
        if(cameraHandle == 0L) {
            promise.reject("E_NOT_INIT", "Native cameraHandle is empty, please call initCamera first.")
            return
        }
        promise.resolve(nativeDisconnectClassifier(cameraHandle))
    }

    @ExpoMethod
    fun setCameraSize(width: Int, height: Int, promise: Promise) {
        if(cameraHandle == 0L) {
            promise.reject("E_NOT_INIT", "Native cameraHandle is empty, please call initCamera first.")
            return
        }
        promise.resolve(nativeCameraSize(cameraHandle, width, height))
    }

    @ExpoMethod
    fun initCamera(haarCascade: String, modelLBF: String, promise: Promise) {
        haarCascadePath = haarCascade
        modelLBFPath = modelLBF
        GlobalScope.launch {
            cameraHandle = nativeInitCamera()
            Log.i("CameraModule", "cameraHandle: $cameraHandle")
            emitModelLoaded(haarCascadePath)
            emitModelLoaded(modelLBFPath)
        }
        promise.resolve(true)
    }

    fun emitModelLoaded(path: String) {
        val eventEmitter = mModuleRegistry.getModule(EventEmitter::class.java)
        val bundle = Bundle()
        bundle.putString("path", path)
        eventEmitter.emit("OnModelLoaded", bundle)
    }

    private external fun nativeInit()
    private external fun nativeInitCamera(): Long
    private external fun nativeDeInitCamera(camHandle: Long)
    private external fun nativeCameraStart(camHandle: Long, camIdx: Int): Boolean
    private external fun nativeCameraStop(camHandle: Long)
    private external fun nativeCameraSize(camHandle: Long, width: Int, height: Int): Boolean
    private external fun nativeConnectClassifier(camHandle: Long, clfHandle: Long): Boolean
    private external fun nativeDisconnectClassifier(camHandle: Long): Boolean
}
