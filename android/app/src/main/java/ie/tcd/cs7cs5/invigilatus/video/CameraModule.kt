package ie.tcd.cs7cs5.invigilatus.video

import android.Manifest
import android.content.Context
import org.unimodules.core.ExportedModule
import org.unimodules.core.Promise
import org.unimodules.core.interfaces.ExpoMethod
import org.unimodules.interfaces.permissions.Permissions
import org.unimodules.core.ModuleRegistry

class CameraModule(context: Context): ExportedModule(context) {
    private lateinit var mModuleRegistry: ModuleRegistry

    override fun onCreate(moduleRegistry: ModuleRegistry) {
        mModuleRegistry = moduleRegistry
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
    fun requestMicrophonePermissionsAsync(promise: Promise) {
        val permissionsManager: Permissions = mModuleRegistry.getModule(Permissions::class.java)
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
        val permissionsManager: Permissions = mModuleRegistry.getModule(Permissions::class.java)
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
        val permissionsManager: Permissions = mModuleRegistry.getModule(Permissions::class.java)
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
        val permissionsManager: Permissions = mModuleRegistry.getModule(Permissions::class.java)
        if (permissionsManager == null) {
            promise.reject(
                "E_NO_PERMISSIONS",
                "Permissions module is null. Are you sure all the installed Expo modules are properly linked?"
            )
            return
        }
        permissionsManager.getPermissionsWithPromise(promise, Manifest.permission.RECORD_AUDIO)
    }

    override fun getName(): String {
        return "CameraPermissions"
    }
}
