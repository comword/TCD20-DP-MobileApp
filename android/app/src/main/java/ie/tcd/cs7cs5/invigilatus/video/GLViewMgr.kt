package ie.tcd.cs7cs5.invigilatus.video

import android.content.Context
import org.unimodules.core.ViewManager

class GLViewMgr: ViewManager<GLView>() {
    override fun getName(): String {
        return "CameraGLView"
    }

    override fun createViewInstance(context: Context): GLView {
        return GLView(context)
    }

    override fun getViewManagerType(): ViewManagerType {
        return ViewManagerType.SIMPLE
    }
}
