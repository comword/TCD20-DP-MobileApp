package ie.tcd.cs7cs5.invigilatus.video

import android.content.Context
import org.unimodules.core.ViewManager
import org.unimodules.core.ModuleRegistry
import org.unimodules.core.interfaces.services.UIManager

class CamGLViewMgr: ViewManager<CamGLView>() {
    private lateinit var mModuleRegistry: ModuleRegistry

    override fun onCreate(moduleRegistry: ModuleRegistry) {
        mModuleRegistry = moduleRegistry
    }

    override fun getName(): String {
        return "CameraGLView"
    }

    override fun createViewInstance(context: Context): CamGLView {
        return CamGLView(context, mModuleRegistry)
    }

    override fun getViewManagerType(): ViewManagerType {
        return ViewManagerType.SIMPLE
    }

    override fun onDropViewInstance(view: CamGLView) {
        mModuleRegistry.getModule(UIManager::class.java).unregisterLifecycleEventListener(view)
        view.onHostPause()
    }

}
