import { existsSync } from "node:fs"
import path from "node:path"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  addNative,
  detectNativePlatforms,
  initNative,
} from "../../packages/cli/lib/mobile/native.mjs"
import {
  createProject,
  read,
  serveRegistry,
  silenceOutput,
} from "./helpers.mjs"

vi.mock("../../packages/cli/lib/prompt.mjs", () => ({
  isInteractive: vi.fn(() => false),
  choose: vi.fn(),
}))

const SWIFT_SOURCES = "swiftui/Sources/EsuissUI"

const registry = {
  name: "esuiss-uim",
  homepage: "https://github.com/e-suiss/uim",
  styles: {},
  platforms: {
    swift: {
      directory: SWIFT_SOURCES,
      base: ["Theme/Theme.swift", "Theme/Tokens.swift"],
      requirements: {
        ios: 17,
        packages: [
          {
            url: "https://github.com/phosphor-icons/swift",
            from: "2.1.0",
            products: ["PhosphorSwift"],
          },
        ],
      },
    },
  },
  items: [
    {
      name: "button",
      type: "ui",
      dependencies: { uniwind: [], nativewind: [], stylesheet: [] },
      requires: [],
      files: ["components/ui/button.tsx"],
      swift: ["Components/Button.swift"],
    },
    {
      name: "dialog",
      type: "ui",
      dependencies: { uniwind: [], nativewind: [], stylesheet: [] },
      requires: ["button"],
      files: ["components/ui/dialog.tsx"],
      swift: ["Components/Dialog.swift", "Components/Button.swift"],
    },
    {
      name: "chart",
      type: "chart",
      dependencies: { uniwind: [], nativewind: [], stylesheet: [] },
      requires: [],
      files: ["components/charts/chart.tsx"],
      kotlin: ["charts/Chart.kt"],
    },
  ],
}

const files = {
  "registry.json": registry,
  [`${SWIFT_SOURCES}/Theme/Theme.swift`]: "struct Theme {}\n",
  [`${SWIFT_SOURCES}/Theme/Tokens.swift`]: "struct Tokens {}\n",
  [`${SWIFT_SOURCES}/Components/Button.swift`]: "struct EsuissButton {}\n",
  [`${SWIFT_SOURCES}/Components/Dialog.swift`]: "struct EsuissDialog {}\n",
}

function xcodeProject(extra = {}) {
  return createProject({ "App.xcodeproj/project.pbxproj": "", ...extra })
}

let output

beforeEach(() => {
  serveRegistry(files)
  output = silenceOutput()
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe("detectNativePlatforms", () => {
  it("finds an Xcode project, a Swift package and an Android module", () => {
    expect(detectNativePlatforms(xcodeProject())).toEqual(["swift"])
    expect(
      detectNativePlatforms(createProject({ "Package.swift": "" }))
    ).toEqual(["swift"])
    expect(
      detectNativePlatforms(
        createProject({
          "app/build.gradle": "apply plugin: 'com.android.application'\n",
        })
      )
    ).toEqual(["kotlin"])
  })

  it("ignores Android plugins applied with apply false", () => {
    const cwd = createProject({
      "build.gradle.kts":
        'plugins {\n  id("com.android.application") version "9.0.0" apply false\n}\n',
    })
    expect(detectNativePlatforms(cwd)).toEqual([])
  })
})

describe("native init and add", () => {
  it("writes the theme and the button on init", async () => {
    const cwd = xcodeProject()
    await initNative({ cwd, platform: "swift" })
    expect(read(cwd, "EsuissUI/Theme/Theme.swift")).toBe(
      files[`${SWIFT_SOURCES}/Theme/Theme.swift`]
    )
    expect(read(cwd, "EsuissUI/Components/Button.swift")).toBe(
      files[`${SWIFT_SOURCES}/Components/Button.swift`]
    )
    expect(output()).toContain(
      "Swift package https://github.com/phosphor-icons/swift from 2.1.0 (PhosphorSwift)"
    )
  })

  it("writes component files into EsuissUI after init", async () => {
    const cwd = xcodeProject()
    await initNative({ cwd, platform: "swift" })
    await addNative(["dialog"], { cwd, platform: "swift" })
    expect(read(cwd, "EsuissUI/Components/Dialog.swift")).toBe(
      files[`${SWIFT_SOURCES}/Components/Dialog.swift`]
    )
    expect(output()).toContain("Created 1 file")
  })

  it("writes component files under --path", async () => {
    const cwd = xcodeProject()
    await initNative({ cwd, platform: "swift", path: "Shared/UI" })
    await addNative(["dialog"], { cwd, platform: "swift", path: "Shared/UI" })
    expect(read(cwd, "Shared/UI/Components/Dialog.swift")).toBe(
      files[`${SWIFT_SOURCES}/Components/Dialog.swift`]
    )
    expect(existsSync(path.join(cwd, "EsuissUI"))).toBe(false)
  })

  it("asks for init when the theme is missing", async () => {
    const cwd = xcodeProject()
    await expect(
      addNative(["button"], { cwd, platform: "swift", path: "Shared/UI" })
    ).rejects.toThrow(
      "No SwiftUI theme found in Shared/UI. Run `npx @esuiss/ui init --platform swift --path Shared/UI` first."
    )
  })

  it("names the platforms an item is available for", async () => {
    const cwd = xcodeProject()
    await initNative({ cwd, platform: "swift" })
    await expect(
      addNative(["chart"], { cwd, platform: "swift" })
    ).rejects.toThrow(
      "chart is not available for SwiftUI, only for React Native and Compose."
    )
  })

  it("rejects an unknown component with the platform's list", async () => {
    const cwd = xcodeProject()
    await initNative({ cwd, platform: "swift" })
    await expect(
      addNative(["sidebar"], { cwd, platform: "swift" })
    ).rejects.toThrow(
      "Unknown component: sidebar.\nAvailable for SwiftUI: button, dialog"
    )
  })

  it("reports when the registry has no files for the platform", async () => {
    const cwd = createProject({
      "build.gradle.kts": 'plugins { id("com.android.library") }\n',
    })
    await expect(
      addNative(["chart"], { cwd, platform: "kotlin" })
    ).rejects.toThrow("The registry has no Compose files.")
  })
})
