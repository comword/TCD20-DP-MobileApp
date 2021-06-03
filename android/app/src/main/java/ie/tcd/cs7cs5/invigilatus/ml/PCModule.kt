package ie.tcd.cs7cs5.invigilatus.ml

import com.facebook.react.bridge.Callback
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import org.tensorflow.lite.Interpreter
import org.tensorflow.lite.gpu.CompatibilityList
import org.tensorflow.lite.gpu.GpuDelegate
import org.tensorflow.lite.nnapi.NnApiDelegate
import org.tensorflow.lite.TensorFlowLite

import android.os.Build
import android.util.Log

class PCModule(context: ReactApplicationContext) : ReactContextBaseJavaModule(context) {
    private var interpreter: Interpreter? = null
    private var gpuDelegate: GpuDelegate? = null
    private var nnApiDelegate: NnApiDelegate? = null

    companion object {
        lateinit var reactContext: ReactApplicationContext
        val TAG = PCModule::class.simpleName
    }

    init {
        reactContext = context
    }

    override fun getName(): String {
        return "PostureClassify"
    }

    @ReactMethod
    fun initTFLite(result: Callback) {
        Log.i(TAG, "Runtime: ${TensorFlowLite.runtimeVersion()}, schema: ${TensorFlowLite.schemaVersion()}")
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

        result.invoke(true)
    }

    @ReactMethod
    fun deInitTFLite() {
        interpreter?.close()
        interpreter = null
        gpuDelegate?.close()
        gpuDelegate = null
        nnApiDelegate?.close()
        nnApiDelegate = null
    }

}