import { spawn } from "node:child_process"
import {
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
const CLI = path.join(ROOT, "packages/cli/index.mjs")
const KINDS = [[], ["patterns"], ["interactions"], ["charts"], ["blocks"]]
const DESTINATION = "generic/platform=iOS Simulator"
const GIT_SUFFIX = /\.git$/
const APP_TARGET = /\.target\(\s*name: "App"/
const TARGETS = /^ {4}targets: \[/m

const { values } = parseArgs({
  options: {
    project: { type: "string", default: "package" },
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
  return registry.platforms.swift.requirements
}

function identity(url) {
  return new URL(url).pathname.split("/").at(-1).replace(GIT_SUFFIX, "")
}

async function swiftPackage(dir, { ios, packages }) {
  await run(
    "Create a Swift package",
    "swift",
    ["package", "init", "--type", "library", "--name", "App"],
    { cwd: dir }
  )
  const manifest = path.join(dir, "Package.swift")
  const source = readFileSync(manifest, "utf8")
  const dependencies = packages
    .map(({ url, from }) => `.package(url: "${url}", from: "${from}")`)
    .join(", ")
  const products = packages
    .flatMap(({ url, products }) =>
      products.map(
        (product) => `.product(name: "${product}", package: "${identity(url)}")`
      )
    )
    .join(", ")
  const updated = source
    .replace('name: "App",', `name: "App",\n    platforms: [.iOS(.v${ios})],`)
    .replace(TARGETS, `    dependencies: [${dependencies}],\n    targets: [`)
    .replace(APP_TARGET, `.target(name: "App", dependencies: [${products}]`)
  if (
    !(
      updated.includes("platforms:") &&
      updated.includes("dependencies: [.package") &&
      updated.includes(".product(")
    )
  ) {
    throw new Error(`Could not add the requirements to:\n${source}`)
  }
  writeFileSync(manifest, updated)
  return ["-scheme", "App"]
}

function settings(ios, extra) {
  return Object.entries({
    IPHONEOS_DEPLOYMENT_TARGET: `${ios}.0`,
    SDKROOT: "iphoneos",
    SWIFT_VERSION: "5.0",
    SWIFT_APPROACHABLE_CONCURRENCY: "YES",
    SWIFT_DEFAULT_ACTOR_ISOLATION: "MainActor",
    SWIFT_UPCOMING_FEATURE_MEMBER_IMPORT_VISIBILITY: "YES",
    ...extra,
  })
    .map(([key, value]) => `\t\t\t\t${key} = ${JSON.stringify(value)};`)
    .join("\n")
}

function xcodeProject(dir, { ios, packages }) {
  const products = packages.flatMap(({ url, from, products }, index) =>
    products.map((product, offset) => ({
      id: `B${index}${offset}`,
      build: `C${index}${offset}`,
      reference: `D${index}`,
      url,
      from,
      product,
    }))
  )
  const references = packages.map(
    ({ url, from }, index) =>
      `\t\tD${index} = {isa = XCRemoteSwiftPackageReference; repositoryURL = "${url}"; requirement = {kind = upToNextMajorVersion; minimumVersion = ${from};}; };`
  )
  const target = settings(ios, {
    CODE_SIGNING_ALLOWED: "NO",
    GENERATE_INFOPLIST_FILE: "YES",
    INFOPLIST_KEY_UILaunchScreen_Generation: "YES",
    PRODUCT_BUNDLE_IDENTIFIER: "com.example.App",
    PRODUCT_NAME: "$(TARGET_NAME)",
    TARGETED_DEVICE_FAMILY: "1,2",
  })
  const project = `// !$*UTF8*$!
{
\tarchiveVersion = 1;
\tclasses = {
\t};
\tobjectVersion = 77;
\tobjects = {
\t\tA1 = {isa = PBXFileReference; explicitFileType = wrapper.application; includeInIndex = 0; path = App.app; sourceTree = BUILT_PRODUCTS_DIR; };
\t\tA2 = {isa = PBXFileSystemSynchronizedRootGroup; path = App; sourceTree = "<group>"; };
\t\tA3 = {isa = PBXFileSystemSynchronizedRootGroup; path = EsuissUI; sourceTree = "<group>"; };
\t\tA4 = {isa = PBXGroup; children = (A2, A3, A5); sourceTree = "<group>"; };
\t\tA5 = {isa = PBXGroup; children = (A1); name = Products; sourceTree = "<group>"; };
\t\tA6 = {isa = PBXSourcesBuildPhase; buildActionMask = 2147483647; files = (); runOnlyForDeploymentPostprocessing = 0; };
\t\tA7 = {isa = PBXFrameworksBuildPhase; buildActionMask = 2147483647; files = (${products.map(({ build }) => build).join(", ")}); runOnlyForDeploymentPostprocessing = 0; };
\t\tA8 = {isa = PBXResourcesBuildPhase; buildActionMask = 2147483647; files = (); runOnlyForDeploymentPostprocessing = 0; };
\t\tA9 = {isa = PBXNativeTarget; buildConfigurationList = A11; buildPhases = (A6, A7, A8); buildRules = (); dependencies = (); fileSystemSynchronizedGroups = (A2, A3); name = App; packageProductDependencies = (${products.map(({ id }) => id).join(", ")}); productName = App; productReference = A1; productType = "com.apple.product-type.application"; };
\t\tA10 = {isa = PBXProject; attributes = {BuildIndependentTargetsInParallel = 1; LastSwiftUpdateCheck = 2600; LastUpgradeCheck = 2600; }; buildConfigurationList = A12; developmentRegion = en; hasScannedForEncodings = 0; knownRegions = (en, Base); mainGroup = A4; minimizedProjectReferenceProxies = 1; packageReferences = (${packages.map((_, index) => `D${index}`).join(", ")}); preferredProjectObjectVersion = 77; productRefGroup = A5; projectDirPath = ""; projectRoot = ""; targets = (A9); };
\t\tA11 = {isa = XCConfigurationList; buildConfigurations = (A13, A14); defaultConfigurationIsVisible = 0; defaultConfigurationName = Release; };
\t\tA12 = {isa = XCConfigurationList; buildConfigurations = (A15, A16); defaultConfigurationIsVisible = 0; defaultConfigurationName = Release; };
\t\tA13 = {isa = XCBuildConfiguration; buildSettings = {
${target}
\t\t\t}; name = Debug; };
\t\tA14 = {isa = XCBuildConfiguration; buildSettings = {
${target}
\t\t\t}; name = Release; };
\t\tA15 = {isa = XCBuildConfiguration; buildSettings = {
${settings(ios, { ONLY_ACTIVE_ARCH: "YES", SWIFT_OPTIMIZATION_LEVEL: "-Onone" })}
\t\t\t}; name = Debug; };
\t\tA16 = {isa = XCBuildConfiguration; buildSettings = {
${settings(ios, { SWIFT_COMPILATION_MODE: "wholemodule" })}
\t\t\t}; name = Release; };
${references.join("\n")}
${products.map(({ id, reference, product }) => `\t\t${id} = {isa = XCSwiftPackageProductDependency; package = ${reference}; productName = ${product}; };`).join("\n")}
${products.map(({ id, build }) => `\t\t${build} = {isa = PBXBuildFile; productRef = ${id}; };`).join("\n")}
\t};
\trootObject = A10;
}
`
  mkdirSync(path.join(dir, "App.xcodeproj"), { recursive: true })
  mkdirSync(path.join(dir, "App"))
  writeFileSync(path.join(dir, "App.xcodeproj/project.pbxproj"), project)
  writeFileSync(
    path.join(dir, "App/AppApp.swift"),
    `import SwiftUI

@main
struct AppApp: App {
  var body: some Scene {
    WindowGroup {
      ContentView()
    }
  }
}
`
  )
  writeFileSync(
    path.join(dir, "App/ContentView.swift"),
    `import SwiftUI

struct ContentView: View {
  var body: some View {
    VStack {
      Image(systemName: "globe")
      Text("Hello, world!")
    }
    .padding()
  }
}
`
  )
  return ["-project", "App.xcodeproj", "-scheme", "App"]
}

const PROJECTS = { package: swiftPackage, xcode: xcodeProject }
const create = PROJECTS[values.project]
if (!create) {
  console.error(`--project must be one of ${Object.keys(PROJECTS).join(", ")}.`)
  process.exit(1)
}

const dir = mkdtempSync(path.join(tmpdir(), "esuiss-swift-"))
const server = await serve(MOBILE)
const env = {
  ...process.env,
  ESUISS_MOBILE_REGISTRY: `http://127.0.0.1:${server.address().port}`,
}
try {
  const scheme = await create(dir, requirements())
  await run(
    "Set up the theme",
    process.execPath,
    [CLI, "init", "--yes", "--platform", "swift"],
    { cwd: dir, env }
  )
  for (const kind of KINDS) {
    await run(
      `Add every ${kind[0] ?? "component"}`,
      process.execPath,
      [CLI, "add", ...kind, "--all", "--yes", "--platform", "swift"],
      { cwd: dir, env }
    )
  }
  await run(
    "Build the app",
    "xcodebuild",
    [
      ...scheme,
      "-destination",
      DESTINATION,
      "-derivedDataPath",
      path.join(dir, ".build-xcode"),
      "build",
      "-quiet",
    ],
    { cwd: dir }
  )
  console.log(`\nEvery item builds in a new ${values.project} project.`)
} finally {
  server.close()
  if (values.keep) console.log(`The project is in ${dir}`)
  else rmSync(dir, { recursive: true, force: true })
}
