package ie.tcd.cs7cs5.invigilatus

import android.content.Context
import ie.tcd.cs7cs5.invigilatus.ml.PCModule
import org.unimodules.core.BasePackage
import ie.tcd.cs7cs5.invigilatus.video.CameraModule
import ie.tcd.cs7cs5.invigilatus.video.CamGLViewMgr

import org.unimodules.core.ExportedModule
import org.unimodules.core.ViewManager

class ExpoPackage: BasePackage() {
    override fun createExportedModules(context: Context): List<ExportedModule> {
        return listOf(
            CameraModule(context),
            PCModule(context)
        )
    }

    override fun createViewManagers(context: Context): List<ViewManager<*>> {
        return listOf(
            CamGLViewMgr()
        )
    }
}
