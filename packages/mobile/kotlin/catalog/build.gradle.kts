plugins {
  id("com.android.application")
  id("org.jetbrains.kotlin.plugin.compose")
  id("io.github.takahirom.roborazzi")
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

  testOptions {
    unitTests {
      isIncludeAndroidResources = true
      all { test ->
        test.systemProperty("only", providers.gradleProperty("only").getOrElse(""))
        test.maxHeapSize = "2g"
        test.jvmArgs("--add-opens=java.base/jdk.internal.access=ALL-UNNAMED")
      }
    }
  }
}

roborazzi {
  outputDir.set(rootProject.file("../tests/screenshots/mobile/compose"))
}

dependencies {
  val composeBom = platform("androidx.compose:compose-bom:2026.09.00")
  implementation(composeBom)
  implementation(project(":ui"))
  implementation("androidx.compose.foundation:foundation")
  implementation("androidx.compose.ui:ui")
  implementation("androidx.activity:activity-compose:1.11.0")
  implementation("com.adamglin:phosphor-icon-android:1.0.0")

  testImplementation(composeBom)
  testImplementation("androidx.compose.ui:ui-test-junit4")
  testImplementation("org.robolectric:robolectric:4.17")
  testImplementation("io.github.takahirom.roborazzi:roborazzi:1.77.0")
  testImplementation("io.github.takahirom.roborazzi:roborazzi-compose:1.77.0")
  debugImplementation("androidx.compose.ui:ui-test-manifest")
}
