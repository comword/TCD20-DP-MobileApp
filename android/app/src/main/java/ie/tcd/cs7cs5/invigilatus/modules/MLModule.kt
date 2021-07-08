package ie.tcd.cs7cs5.invigilatus.modules

import android.content.Context
import org.tensorflow.lite.Interpreter
import org.tensorflow.lite.gpu.CompatibilityList
import org.tensorflow.lite.gpu.GpuDelegate
import org.tensorflow.lite.nnapi.NnApiDelegate
import org.tensorflow.lite.TensorFlowLite

import android.os.Build
import android.os.Bundle
import android.util.Log
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import org.unimodules.core.ExportedModule
import org.unimodules.core.ModuleRegistry
import org.unimodules.core.Promise
import org.unimodules.core.interfaces.ExpoMethod
import org.unimodules.core.interfaces.services.EventEmitter
import java.io.File
import java.lang.RuntimeException

class MLModule(context: Context) : ExportedModule(context) {
    private lateinit var mModuleRegistry: ModuleRegistry
    var interpreter: Interpreter? = null
        private set
    private var gpuDelegate: GpuDelegate? = null
    private var nnApiDelegate: NnApiDelegate? = null
    var mPCHandle: Long = 0
        private set
    var mReporterHandle: Long = 0
        private set
    lateinit var mSrvAddr: String
        private set

    companion object {
        val TAG = MLModule::class.simpleName
    }

    init {
        System.loadLibrary("result-report")
        System.loadLibrary("mlmodel")
    }

    override fun onDestroy() {
        if(mPCHandle != 0L) {
            nativeDeInit(mPCHandle)
            mPCHandle = 0
        }
        if(mReporterHandle != 0L) {
            nativeReporterDeInit(mReporterHandle)
            mReporterHandle = 0
        }
        interpreter?.close()
        interpreter = null
        gpuDelegate?.close()
        gpuDelegate = null
        nnApiDelegate?.close()
        nnApiDelegate = null
    }

    override fun onCreate(moduleRegistry: ModuleRegistry) {
        mModuleRegistry = moduleRegistry
    }

    override fun getName(): String {
        return "PostureClassify"
    }

    @ExpoMethod
    fun initTFLite(path: String, promise: Promise) {
        if(mReporterHandle == 0L) {
            promise.reject("E_NOT_INIT", "Reporter native handle is empty.")
            return
        }
        val modelFile = File(path)
        if(!modelFile.exists()) {
            promise.reject("E_NOT_FOUND", "Model file not found.")
            return
        }
        Log.i(TAG, "Runtime: ${TensorFlowLite.runtimeVersion()}, schema: ${TensorFlowLite.schemaVersion()}")
        try {
            val options = Interpreter.Options().apply{
                val compatList = CompatibilityList()
                when {
                    Build.VERSION.SDK_INT >= Build.VERSION_CODES.P -> {
                        Log.i(TAG, "Initio interpretem cum NNAPI")
                        nnApiDelegate = NnApiDelegate()
                        this.addDelegate(nnApiDelegate)
                    }
                    compatList.isDelegateSupportedOnThisDevice -> {
                        Log.i(TAG, "Initio interpretem cum GPU")
                        val delegateOptions = compatList.bestOptionsForThisDevice
                        gpuDelegate = GpuDelegate(delegateOptions)
                        this.addDelegate(gpuDelegate)
                    }
                    else -> {
                        Log.i(TAG, "Initio interpretem cum CPU")
                        this.setNumThreads(4)
                    }
                }
            }
            GlobalScope.launch {
                val eventEmitter = mModuleRegistry.getModule(EventEmitter::class.java)
                val bundle = Bundle()
                try {
                    interpreter = Interpreter(modelFile, options)
                    mPCHandle = nativeModelInit(interpreter!!, mReporterHandle)
                    bundle.putString("path", path)
                    eventEmitter.emit("OnModelLoaded", bundle)
                } catch (err: RuntimeException) {
                    val msg = "Error in initialising TFLite interpreter: ${err.message}"
                    Log.w(TAG, msg)
                    Log.w(TAG, Log.getStackTraceString(err))
                    bundle.putInt("code", -1)
                    bundle.putString("msg", msg)
                    bundle.putBoolean("show", true)
                    eventEmitter.emit("OnPostureClassifyErr", bundle)
                }
            }
            promise.resolve(true)
        } catch (err: RuntimeException) {
            val msg = "Error in initialising TFLite interpreter: ${err.message}"
            Log.w(TAG, msg)
            promise.reject(TAG, msg)
        }
    }

    @ExpoMethod
    fun deInitTFLite(promise: Promise) {
        if(mPCHandle != 0L) {
            nativeDeInit(mPCHandle)
            mPCHandle = 0
        }
        interpreter?.close()
        interpreter = null
        gpuDelegate?.close()
        gpuDelegate = null
        nnApiDelegate?.close()
        nnApiDelegate = null
        promise.resolve(true)
    }

    @ExpoMethod
    fun getTFInitialised(promise: Promise) {
        if(mPCHandle == 0L)
            promise.resolve(false)
        else
            promise.resolve(true)
    }

    @ExpoMethod
    fun getReporterInitialised(promise: Promise) {
        if(mReporterHandle == 0L)
            promise.resolve(false)
        else
            promise.resolve(true)
    }

    @ExpoMethod
    fun initReporter(address: String, promise: Promise) {
        if(mReporterHandle != 0L) {
            if(mSrvAddr != address){
                promise.reject("E_INITED", "The network reporter has already been initialised.")
                return
            } else {
                promise.resolve(true)
                return
            }
        }

        mSrvAddr = address
        mReporterHandle = nativeReporterInit(mSrvAddr)
        if(mReporterHandle != 0L)
            promise.resolve(true)
        else
            promise.reject("E_UNKNOWN", "Native return null")
    }

    @ExpoMethod
    fun deinitReporter(promise: Promise) {
        if(mReporterHandle != 0L) {
            nativeReporterDeInit(mReporterHandle)
            mSrvAddr = ""
            mReporterHandle = 0
            promise.resolve(true)
            return
        } else
            promise.reject("E_NOT_INIT", "Native handle is empty.")
    }

    @ExpoMethod
    fun reporterSetAuth(authKey: String, promise: Promise) {
        if(mReporterHandle != 0L)
            promise.resolve(nativeReporterAuth(mReporterHandle, authKey))
        else
            promise.reject("E_NOT_INIT", "Native handle is empty.")
    }

    @ExpoMethod
    fun reporterSetExamId(examId: String, promise: Promise) {
        if(mReporterHandle != 0L)
            promise.resolve(nativeReporterExamId(mReporterHandle, examId))
        else
            promise.reject("E_NOT_INIT", "Native handle is empty.")
    }

    fun emitResult(result: FloatArray) {
        val eventEmitter = mModuleRegistry.getModule(EventEmitter::class.java)
        val bundle = Bundle()
        bundle.putFloatArray("result", result)
        eventEmitter.emit("OnModelResult", bundle)
    }

    fun emitError(name: String, reason: String) {
        val eventEmitter = mModuleRegistry.getModule(EventEmitter::class.java)
        val bundle = Bundle()
        bundle.putInt("code", -1);
        bundle.putString("msg", "$name: $reason")
        bundle.putBoolean("show", true);
        eventEmitter.emit("OnPostureClassifyErr", bundle)
    }

    private external fun nativeModelInit(interpreter: Interpreter, reporterMgrHandle: Long): Long
    private external fun nativeDeInit(pcHandle: Long)

    private external fun nativeReporterInit(address: String): Long
    private external fun nativeReporterAuth(handle:Long, authKey: String): Boolean
    private external fun nativeReporterExamId(handle:Long, examId: String): Boolean
    private external fun nativeReporterDeInit(handle: Long)
}
