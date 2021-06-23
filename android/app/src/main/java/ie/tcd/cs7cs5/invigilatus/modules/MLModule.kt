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
import java.io.FileInputStream
import java.lang.RuntimeException
import java.nio.MappedByteBuffer
import java.nio.channels.FileChannel

class MLModule(context: Context) : ExportedModule(context) {
    private lateinit var mModuleRegistry: ModuleRegistry
    var interpreter: Interpreter? = null
        private set
    private var gpuDelegate: GpuDelegate? = null
    private var nnApiDelegate: NnApiDelegate? = null
    var mPCHandle: Long = 0
        private set

    companion object {
        val TAG = MLModule::class.simpleName
    }

    init {
        System.loadLibrary("mlmodel")
    }

    override fun onDestroy() {
        if(mPCHandle != 0L)
            nativeDeInit(mPCHandle)
    }

    override fun onCreate(moduleRegistry: ModuleRegistry) {
        mModuleRegistry = moduleRegistry
    }

    override fun getName(): String {
        return "PostureClassify"
    }

    private fun loadModelFile(path: String, context: Context): MappedByteBuffer {
        val fileDescriptor = context.assets.openFd(path)
        val inputStream = FileInputStream(fileDescriptor.fileDescriptor)
        return inputStream.channel.map(
            FileChannel.MapMode.READ_ONLY, fileDescriptor.startOffset, fileDescriptor.declaredLength
        )
    }

    @ExpoMethod
    fun initTFLite(path: String, result: Promise) {
        Log.i(TAG, "Runtime: ${TensorFlowLite.runtimeVersion()}, schema: ${TensorFlowLite.schemaVersion()}")
        try {
            val options = Interpreter.Options().apply{
                val compatList = CompatibilityList()
                when {
                    Build.VERSION.SDK_INT >= Build.VERSION_CODES.P -> {
                        Log.i(TAG, "Initio interpretem cum NNAPI")
                        nnApiDelegate = NnApiDelegate()
                        this.addDelegate(nnApiDelegate)
                        this.setUseNNAPI(true)
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
                    interpreter = Interpreter(loadModelFile(path, context), options)
                    mPCHandle = nativeModelInit(interpreter!!)
                    bundle.putString("path", path)
                    eventEmitter.emit("OnModelLoaded", bundle)
                } catch (err: RuntimeException) {
                    val msg = "Error in initialising TFLite interpreter: ${err.message}"
                    Log.w(TAG, msg)
                    bundle.putInt("code", -1)
                    bundle.putString("msg", msg)
                    bundle.putBoolean("show", true)
                    eventEmitter.emit("OnPostureClassifyErr", bundle)
                }
            }
            result.resolve(true)
        } catch (err: RuntimeException) {
            val msg = "Error in initialising TFLite interpreter: ${err.message}"
            Log.w(TAG, msg)
            result.reject(TAG, msg)
        }
    }

    @ExpoMethod
    fun deInitTFLite(promise: Promise) {
        if(mPCHandle != 0L)
            nativeDeInit(mPCHandle)
        interpreter?.close()
        interpreter = null
        gpuDelegate?.close()
        gpuDelegate = null
        nnApiDelegate?.close()
        nnApiDelegate = null
        promise.resolve(true)
    }

    @ExpoMethod
    fun getInitialised(promise: Promise) {
        if(mPCHandle == 0L)
            promise.resolve(false)
        else
            promise.resolve(true)
    }

    private external fun nativeModelInit(interpreter: Interpreter): Long
    private external fun nativeDeInit(pcHandle: Long)
}
