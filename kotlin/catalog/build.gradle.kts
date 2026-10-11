plugins {
  id("com.android.application")
  id("org.jetbrains.kotlin.plugin.compose")
}

android {
  namespace = "com.esuiss.catalog"
  compileSdk = 37

  defaultConfig {
    applicationId = "com.esuiss.catalog"
    minSdk = 24
    targetSdk = 37
    versionCode = 1
    versionName = "1.0"
  }

  buildFeatures {
    compose = true
  }
}

dependencies {
  val composeBom = platform("androidx.compose:compose-bom:2026.09.00")
  implementation(composeBom)
  implementation(project(":ui"))
  implementation("androidx.compose.foundation:foundation")
  implementation("androidx.compose.ui:ui")
  implementation("androidx.activity:activity-compose:1.11.0")
  implementation("com.adamglin:phosphor-icon-android:1.0.0")
}
