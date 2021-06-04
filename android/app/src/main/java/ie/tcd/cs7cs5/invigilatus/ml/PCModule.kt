package ie.tcd.cs7cs5.invigilatus.ml

import android.content.Context
import org.tensorflow.lite.Interpreter
import org.tensorflow.lite.gpu.CompatibilityList
import org.tensorflow.lite.gpu.GpuDelegate
import org.tensorflow.lite.nnapi.NnApiDelegate
import org.tensorflow.lite.TensorFlowLite

import android.os.Build
import android.util.Log
import org.unimodules.core.ExportedModule
import org.unimodules.core.Promise
import org.unimodules.core.interfaces.ExpoMethod
import java.io.FileInputStream
import java.lang.RuntimeException
import java.nio.MappedByteBuffer
import java.nio.channels.FileChannel

class PCModule(context: Context) : ExportedModule(context) {
    var interpreter: Interpreter? = null
        private set
    private var gpuDelegate: GpuDelegate? = null
    private var nnApiDelegate: NnApiDelegate? = null

    companion object {
        val TAG = PCModule::class.simpleName
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
//            interpreter = Interpreter(loadModelFile(path, context), options)
            result.resolve(true)
        } catch (err: RuntimeException) {
            val msg = "Error in initiatio TFLite interpreter: ${err.message}"
            Log.w(TAG, msg)
            result.reject(TAG, msg)
        }
    }

    @ExpoMethod
    fun deInitTFLite(promise: Promise) {
        interpreter?.close()
        interpreter = null
        gpuDelegate?.close()
        gpuDelegate = null
        nnApiDelegate?.close()
        nnApiDelegate = null
        promise.resolve(true)
    }

    @ExpoMethod
    fun getTFLiteInitialised(promise: Promise) {
        if(interpreter == null)
            promise.resolve(false)
        else
            promise.resolve(true)
    }

}
