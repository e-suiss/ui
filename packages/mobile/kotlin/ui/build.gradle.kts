plugins {
  id("com.android.library")
  id("org.jetbrains.kotlin.plugin.compose")
}

android {
  namespace = "com.esuiss.ui"
  compileSdk = 37

  defaultConfig {
    minSdk = 24
    testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
  }

  buildFeatures {
    compose = true
  }
}

dependencies {
  val composeBom = platform("androidx.compose:compose-bom:2026.09.00")
  implementation(composeBom)
  implementation("androidx.compose.foundation:foundation")
  implementation("androidx.compose.ui:ui")
  implementation("com.adamglin:phosphor-icon-android:1.0.0")

  androidTestImplementation(composeBom)
  androidTestImplementation("androidx.compose.ui:ui-test-junit4")
  androidTestImplementation("androidx.test.ext:junit:1.3.0")
  debugImplementation("androidx.compose.ui:ui-test-manifest")
}
