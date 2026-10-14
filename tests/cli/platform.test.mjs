import { execFile } from "node:child_process"
import { existsSync } from "node:fs"
import { createServer } from "node:http"
import { afterAll, beforeAll, describe, expect, it } from "vitest"

import { createProject, read } from "./helpers.mjs"

const entry = new URL("../../packages/cli/index.mjs", import.meta.url).pathname

const webRegistry = {
  stylesheet: "styles/globals.css",
  items: [
    {
      name: "button",
      type: "ui",
      requires: [],
      dependencies: ["@base-ui/react"],
      files: ["components/ui/button.tsx"],
    },
  ],
}

const mobileRegistry = {
  name: "esuiss-uim",
  homepage: "https://github.com/e-suiss/uim",
  styles: {
    uniwind: { stylesheet: "styles/uniwind.css", directory: "uniwind" },
    stylesheet: {
      theme: "stylesheet/components/ui/theme.ts",
      directory: "stylesheet",
    },
  },
  platforms: {
    swift: {
      directory: "swiftui/Sources/EsuissUI",
      base: ["Theme/Theme.swift"],
      requirements: { ios: 17, packages: [] },
    },
    kotlin: {
      directory: "kotlin/ui/src/main/kotlin/com/esuiss/ui",
      base: ["theme/Theme.kt"],
      requirements: { minSdk: 24, bom: null, dependencies: [] },
    },
  },
  items: [
    {
      name: "button",
      type: "ui",
      dependencies: {
        uniwind: ["class-variance-authority"],
        stylesheet: [],
      },
      requires: [],
      files: ["components/ui/button.tsx"],
      overrides: ["uniwind", "stylesheet"],
      swift: ["Components/Button.swift"],
      kotlin: ["components/Button.kt"],
    },
  ],
}

const files = {
  "/web/registry.json": JSON.stringify(webRegistry),
  "/web/components/ui/button.tsx": "export function WebButton() {}\n",
  "/mobile/registry.json": JSON.stringify(mobileRegistry),
  "/mobile/uniwind/components/ui/button.tsx":
    "export function UniwindButton() {}\n",
  "/mobile/swiftui/Sources/EsuissUI/Components/Button.swift":
    "struct EsuissButton {}\n",
  "/mobile/kotlin/ui/src/main/kotlin/com/esuiss/ui/components/Button.kt":
    "fun EsuissButton() {}\n",
}

let server
let origin

beforeAll(async () => {
  server = createServer((request, response) => {
    const body = files[request.url]
    response.writeHead(body === undefined ? 404 : 200)
    response.end(body ?? "missing")
  })
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve))
  origin = `http://127.0.0.1:${server.address().port}`
})

afterAll(() => new Promise((resolve) => server.close(resolve)))

function run(...args) {
  return new Promise((resolve) => {
    execFile(
      "node",
      [entry, ...args],
      {
        encoding: "utf8",
        env: {
          ...process.env,
          NO_COLOR: "1",
          ESUISS_REGISTRY: `${origin}/web`,
          ESUISS_MOBILE_REGISTRY: `${origin}/mobile`,
        },
      },
      (error, stdout, stderr) => {
        resolve({ code: error ? error.code : 0, stdout, stderr })
      }
    )
  })
}

function nextProject() {
  return createProject({
    "package.json": {
      dependencies: {
        next: "16.0.0",
        react: "19.0.0",
        "@base-ui/react": "1.0.0",
      },
    },
    "tsconfig.json": {
      compilerOptions: { paths: { "@/*": ["./*"] } },
    },
  })
}

function expoProject() {
  return createProject({
    "package.json": {
      dependencies: {
        expo: "55.0.0",
        "react-native": "0.83.0",
        uniwind: "1.0.0",
        "class-variance-authority": "0.7.1",
      },
    },
    "tsconfig.json": {
      compilerOptions: { paths: { "@/*": ["./*"] } },
    },
  })
}

function xcodeProject(extra = {}) {
  return createProject({
    "App.xcodeproj/project.pbxproj": "",
    ...extra,
  })
}

function gradleModule(extra = {}) {
  return createProject({
    "build.gradle.kts":
      'plugins {\n  id("com.android.application")\n}\nandroid {\n  defaultConfig { minSdk = 26 }\n  buildFeatures { compose = true }\n}\n// org.jetbrains.kotlin.plugin.compose\n',
    ...extra,
  })
}

describe("platform routing", () => {
  it("adds web components to a Next.js project", async () => {
    const cwd = nextProject()
    const result = await run("add", "button", "--cwd", cwd)
    expect(result.code).toBe(0)
    expect(read(cwd, "components/ui/button.tsx")).toBe(
      files["/web/components/ui/button.tsx"]
    )
  })

  it("adds React Native components to an Expo project", async () => {
    const cwd = expoProject()
    const result = await run("add", "button", "--cwd", cwd)
    expect(result.code).toBe(0)
    expect(read(cwd, "components/ui/button.tsx")).toBe(
      files["/mobile/uniwind/components/ui/button.tsx"]
    )
  })

  it("adds SwiftUI files to a folder with an Xcode project", async () => {
    const cwd = xcodeProject({ "EsuissUI/Theme/Theme.swift": "" })
    const result = await run("add", "button", "--cwd", cwd)
    expect(result.code).toBe(0)
    expect(result.stdout).toContain("Found a SwiftUI project.")
    expect(read(cwd, "EsuissUI/Components/Button.swift")).toBe(
      files["/mobile/swiftui/Sources/EsuissUI/Components/Button.swift"]
    )
  })

  it("adds Compose files to an Android Gradle module", async () => {
    const cwd = gradleModule({
      "src/main/kotlin/com/esuiss/ui/theme/Theme.kt": "",
    })
    const result = await run("add", "button", "--cwd", cwd)
    expect(result.code).toBe(0)
    expect(result.stdout).toContain("Found a Jetpack Compose project.")
    expect(
      read(cwd, "src/main/kotlin/com/esuiss/ui/components/Button.kt")
    ).toBe(
      files[
        "/mobile/kotlin/ui/src/main/kotlin/com/esuiss/ui/components/Button.kt"
      ]
    )
  })

  it("explains when the folder has no project", async () => {
    const cwd = createProject({})
    const result = await run("add", "button", "--cwd", cwd)
    expect(result.code).toBe(1)
    expect(result.stderr).toContain(
      `No React, React Native, Xcode or Android Gradle project found in ${cwd}. Run this in your project folder, or pass --cwd or --platform.`
    )
  })

  it("asks for --platform when several projects are found", async () => {
    const cwd = xcodeProject({
      "package.json": { dependencies: { expo: "55.0.0" } },
    })
    const result = await run("add", "button", "--cwd", cwd)
    expect(result.code).toBe(1)
    expect(result.stderr).toContain(
      "This folder has React Native and SwiftUI projects. Pick one with --platform rn|swift."
    )
  })

  it("lets --platform override the detected project", async () => {
    const cwd = xcodeProject({
      "package.json": { dependencies: { expo: "55.0.0" } },
      "EsuissUI/Theme/Theme.swift": "",
    })
    const result = await run(
      "add",
      "button",
      "--platform",
      "swift",
      "--cwd",
      cwd
    )
    expect(result.code).toBe(0)
    expect(existsSync(`${cwd}/EsuissUI/Components/Button.swift`)).toBe(true)
    expect(existsSync(`${cwd}/components/ui/button.tsx`)).toBe(false)
  })

  it("uses the React Native flow when --platform rn is given", async () => {
    const cwd = nextProject()
    const result = await run("add", "button", "-p", "rn", "--cwd", cwd)
    expect(result.code).toBe(1)
    expect(result.stderr).toContain(
      "Only React Native and Expo projects are supported."
    )
  })

  it("rejects --styling outside React Native", async () => {
    const cwd = nextProject()
    const result = await run(
      "add",
      "button",
      "--styling",
      "uniwind",
      "--cwd",
      cwd
    )
    expect(result.code).toBe(1)
    expect(result.stderr).toContain(
      "--styling works with React Native projects."
    )
  })

  it.each([
    ["web", nextProject],
    ["rn", expoProject],
  ])("rejects --path with --platform %s", async (platform, project) => {
    const cwd = project()
    const result = await run(
      "add",
      "button",
      "--platform",
      platform,
      "--path",
      "Sources",
      "--cwd",
      cwd
    )
    expect(result.code).toBe(1)
    expect(result.stderr).toContain(
      "--path works with --platform swift or kotlin."
    )
  })

  it("rejects an unknown --platform value", async () => {
    const result = await run("add", "button", "--platform", "flutter")
    expect(result.code).toBe(1)
    expect(result.stderr).toContain("--platform needs web, rn, swift, kotlin.")
  })

  it("writes SwiftUI files under --path", async () => {
    const cwd = xcodeProject({ "Shared/UI/Theme/Theme.swift": "" })
    const result = await run(
      "add",
      "button",
      "--path",
      "Shared/UI",
      "--cwd",
      cwd
    )
    expect(result.code).toBe(0)
    expect(read(cwd, "Shared/UI/Components/Button.swift")).toBe(
      files["/mobile/swiftui/Sources/EsuissUI/Components/Button.swift"]
    )
  })
})
