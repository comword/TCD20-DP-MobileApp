package ie.tcd.cs7cs5.invigilatus

import expo.modules.splashscreen.singletons.SplashScreen.show
import com.facebook.react.ReactActivity
import android.content.Intent
import android.content.res.Configuration
import android.os.Bundle
import expo.modules.splashscreen.SplashScreenImageResizeMode
import com.facebook.react.ReactRootView
import com.facebook.react.ReactActivityDelegate
import com.swmansion.gesturehandler.react.RNGestureHandlerEnabledRootView

class MainActivity : ReactActivity() {
    // Added automatically by Expo Config
    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        val intent = Intent("onConfigurationChanged")
        intent.putExtra("newConfig", newConfig)
        sendBroadcast(intent)
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(null)
        // SplashScreen.show(...) has to be called after super.onCreate(...)
        // Below line is handled by '@expo/configure-splash-screen' command and it's discouraged to modify it manually
        show(this, SplashScreenImageResizeMode.CONTAIN, ReactRootView::class.java, false)
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    override fun getMainComponentName(): String? {
        return "main"
    }

    override fun createReactActivityDelegate(): ReactActivityDelegate {
        return object : ReactActivityDelegate(this, mainComponentName) {
            override fun createRootView(): ReactRootView {
                return RNGestureHandlerEnabledRootView(this@MainActivity)
            }
        }
    }
}