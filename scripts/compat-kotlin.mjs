import { spawn } from "node:child_process"
import {
  copyFileSync,
  createReadStream,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs"
import { createServer } from "node:http"
import { tmpdir } from "node:os"
import path from "node:path"
import { parseArgs } from "node:util"

const ROOT = path.resolve(import.meta.dirname, "..")
const MOBILE = path.join(ROOT, "packages/mobile")
const GRADLE = path.join(MOBILE, "kotlin")
const CLI = path.join(ROOT, "packages/cli/index.mjs")
const KINDS = [[], ["patterns"], ["interactions"], ["charts"], ["blocks"]]
const WRAPPER = [
  "gradlew",
  "gradlew.bat",
  "gradle/wrapper/gradle-wrapper.jar",
  "gradle/wrapper/gradle-wrapper.properties",
]
const PLUGIN_VERSION = /id\("([^"]+)"\) version "([^"]+)"/g

const { values } = parseArgs({
  options: {
    project: { type: "string", default: "catalog" },
    keep: { type: "boolean", default: false },
  },
})

function run(label, command, args, options = {}) {
  console.log(`\n> ${label}`)
  const child = spawn(command, args, { stdio: "inherit", ...options })
  return new Promise((resolve, reject) => {
    child.on("error", reject)
    child.on("exit", (code, signal) => {
      if (code === 0) resolve()
      else reject(new Error(`${label} failed with exit code ${code ?? signal}`))
    })
  })
}

function serve(dir) {
  const server = createServer((request, response) => {
    const pathname = decodeURIComponent(
      new URL(request.url, "http://localhost").pathname
    )
    const file = path.join(dir, pathname)
    if (
      !file.startsWith(dir + path.sep) ||
      !existsSync(file) ||
      !statSync(file).isFile()
    ) {
      response.writeHead(404).end()
      return
    }
    response.writeHead(200)
    createReadStream(file).pipe(response)
  })
  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => resolve(server))
  })
}

function requirements() {
  const registry = JSON.parse(
    readFileSync(path.join(MOBILE, "registry.json"), "utf8")
  )
  return registry.platforms.kotlin.requirements
}

function plugins() {
  const source = readFileSync(path.join(GRADLE, "build.gradle.kts"), "utf8")
  return Object.fromEntries(
    [...source.matchAll(PLUGIN_VERSION)].map(([, id, version]) => [id, version])
  )
}

function write(dir, files) {
  for (const [file, content] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(dir, file)), { recursive: true })
    writeFileSync(path.join(dir, file), content)
  }
}

function coordinates(dependency) {
  const [group, name, version] = dependency.split(":")
  return { group, name, version }
}

function alias(dependency) {
  const { group, name } = coordinates(dependency)
  return `${group.split(".").at(-1)}-${name}`
}

const MANIFEST = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">

    <application
        android:allowBackup="true"
        android:label="App"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.Material.Light.NoActionBar">
        <activity
            android:name=".MainActivity"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />

                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`

const ACTIVITY = `package com.example.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.material3.Text

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            Text("Hello Android!")
        }
    }
}
`

const SOURCES = {
  "app/src/main/AndroidManifest.xml": MANIFEST,
  "app/src/main/java/com/example/app/MainActivity.kt": ACTIVITY,
  "gradle.properties":
    "org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8\nandroid.useAndroidX=true\nkotlin.code.style=official\n",
}

function catalogProject(dir, { minSdk, compileSdk, bom, dependencies }) {
  const versions = plugins()
  const { version: bomVersion } = coordinates(bom)
  const libraries = dependencies.map((dependency) => {
    const { group, name, version } = coordinates(dependency)
    return `${alias(dependency)} = { group = "${group}", name = "${name}"${version ? `, version = "${version}"` : ""} }`
  })
  write(dir, {
    ...SOURCES,
    "gradle/libs.versions.toml": `[versions]
agp = "${versions["com.android.application"]}"
kotlin = "${versions["org.jetbrains.kotlin.plugin.compose"]}"
activityCompose = "1.11.0"
composeBom = "${bomVersion}"

[libraries]
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-compose-material3 = { group = "androidx.compose.material3", name = "material3" }
${libraries.join("\n")}

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
`,
    "settings.gradle.kts": `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "App"
include(":app")
`,
    "build.gradle.kts": `plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.compose) apply false
}
`,
    "app/build.gradle.kts": `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.example.app"
    compileSdk = ${compileSdk}

    defaultConfig {
        applicationId = "com.example.app"
        minSdk = ${minSdk}
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"
    }

    buildFeatures {
        compose = true
    }
}

dependencies {
    implementation(libs.androidx.activity.compose)
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.material3)
${dependencies.map((dependency) => `    implementation(libs.${alias(dependency).replaceAll("-", ".")})`).join("\n")}
}
`,
  })
}

function groovyProject(dir, { minSdk, compileSdk, bom, dependencies }) {
  const versions = plugins()
  write(dir, {
    ...SOURCES,
    "settings.gradle": `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "App"
include ':app'
`,
    "build.gradle": `plugins {
    id 'com.android.application' version '${versions["com.android.application"]}' apply false
    id 'org.jetbrains.kotlin.plugin.compose' version '${versions["org.jetbrains.kotlin.plugin.compose"]}' apply false
}
`,
    "app/build.gradle": `plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.plugin.compose'
}

android {
    namespace 'com.example.app'
    compileSdk ${compileSdk}

    defaultConfig {
        applicationId 'com.example.app'
        minSdk ${minSdk}
        targetSdk 36
        versionCode 1
        versionName '1.0'
    }

    buildFeatures {
        compose true
    }
}

dependencies {
    implementation 'androidx.activity:activity-compose:1.11.0'
    implementation platform('${bom}')
    implementation 'androidx.compose.material3:material3'
${dependencies.map((dependency) => `    implementation '${dependency}'`).join("\n")}
}
`,
  })
}

const PROJECTS = { catalog: catalogProject, groovy: groovyProject }
const create = PROJECTS[values.project]
if (!create) {
  console.error(`--project must be one of ${Object.keys(PROJECTS).join(", ")}.`)
  process.exit(1)
}

const dir = mkdtempSync(path.join(tmpdir(), "esuiss-kotlin-"))
const server = await serve(MOBILE)
const env = {
  ...process.env,
  ESUISS_MOBILE_REGISTRY: `http://127.0.0.1:${server.address().port}`,
}
try {
  create(dir, requirements())
  for (const file of WRAPPER) {
    mkdirSync(path.dirname(path.join(dir, file)), { recursive: true })
    copyFileSync(path.join(GRADLE, file), path.join(dir, file))
  }
  await run(
    "Set up the theme",
    process.execPath,
    [CLI, "init", "--yes", "--platform", "kotlin"],
    { cwd: dir, env }
  )
  for (const kind of KINDS) {
    await run(
      `Add every ${kind[0] ?? "component"}`,
      process.execPath,
      [CLI, "add", ...kind, "--all", "--yes", "--platform", "kotlin"],
      { cwd: dir, env }
    )
  }
  await run(
    "Build the app",
    path.join(dir, "gradlew"),
    ["--no-daemon", "--quiet", ":app:assembleDebug"],
    { cwd: dir }
  )
  console.log(`\nEvery item builds in a new ${values.project} project.`)
} finally {
  server.close()
  if (values.keep) console.log(`The project is in ${dir}`)
  else rmSync(dir, { recursive: true, force: true })
}
