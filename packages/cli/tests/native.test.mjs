import { existsSync, writeFileSync } from "node:fs"
import path from "node:path"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  addNative,
  detectNativePlatforms,
  initNative,
} from "../lib/mobile/native.mjs"
import { choose, isInteractive } from "../lib/prompt.mjs"
import {
  createProject,
  read,
  serveRegistry,
  silenceOutput,
} from "./helpers.mjs"

vi.mock("../lib/prompt.mjs", () => ({
  isInteractive: vi.fn(() => false),
  choose: vi.fn(),
}))

const SWIFT_SOURCES = "swiftui/Sources/EsuissUI"

const registry = {
  name: "esuiss-ui-mobile",
  homepage: "https://suiss.app/ui",
  styles: {},
  presets: { vega: { swift: "styles/presets/vega/Tokens.swift" } },
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
      name: "date-picker",
      type: "pattern",
      dependencies: { uniwind: [], nativewind: [], stylesheet: [] },
      requires: ["button"],
      files: ["components/patterns/date-picker.tsx"],
      swift: ["Patterns/DatePicker.swift"],
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
  "styles/presets/vega/Tokens.swift": "struct VegaTokens {}\n",
  [`${SWIFT_SOURCES}/Components/Button.swift`]: "struct EsuissButton {}\n",
  [`${SWIFT_SOURCES}/Components/Dialog.swift`]: "struct EsuissDialog {}\n",
  [`${SWIFT_SOURCES}/Patterns/DatePicker.swift`]: "struct DatePicker {}\n",
}

function xcodeProject(extra = {}) {
  return createProject({ "App.xcodeproj/project.pbxproj": "", ...extra })
}

let output

beforeEach(() => {
  serveRegistry(files)
  output = silenceOutput()
  vi.mocked(choose).mockReset()
  vi.mocked(isInteractive).mockReturnValue(false)
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

  it("writes the tokens of the chosen style on init", async () => {
    const cwd = xcodeProject()
    await initNative({ cwd, platform: "swift", style: "vega" })
    expect(read(cwd, "EsuissUI/Theme/Tokens.swift")).toBe(
      "struct VegaTokens {}\n"
    )
    expect(read(cwd, "EsuissUI/Theme/Theme.swift")).toBe(
      files[`${SWIFT_SOURCES}/Theme/Theme.swift`]
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

  it("shows every file of the items in the diff", async () => {
    const cwd = xcodeProject()
    await initNative({ cwd, platform: "swift" })
    writeFileSync(
      path.join(cwd, "EsuissUI/Components/Button.swift"),
      "struct Edited {}\n"
    )
    await addNative(["dialog"], { cwd, platform: "swift", diff: true })
    const printed = output()
    expect(printed).toContain("- struct Edited {}")
    expect(printed).toContain(
      `${path.join("EsuissUI", "Components", "Dialog.swift")} is not installed.`
    )
  })

  it("adds only the components with --all", async () => {
    const cwd = xcodeProject()
    await initNative({ cwd, platform: "swift" })
    await addNative([], { cwd, platform: "swift", all: true })
    expect(existsSync(path.join(cwd, "EsuissUI/Components/Dialog.swift"))).toBe(
      true
    )
    expect(existsSync(path.join(cwd, "EsuissUI/Patterns"))).toBe(false)
  })

  it("adds the items of the group given", async () => {
    const cwd = xcodeProject()
    await initNative({ cwd, platform: "swift" })
    await addNative([], { cwd, platform: "swift", all: true, scope: "pattern" })
    expect(read(cwd, "EsuissUI/Patterns/DatePicker.swift")).toBe(
      "struct DatePicker {}\n"
    )
    expect(existsSync(path.join(cwd, "EsuissUI/Components/Dialog.swift"))).toBe(
      false
    )
  })

  it("points to the group command for an item of another group", async () => {
    const cwd = xcodeProject()
    await initNative({ cwd, platform: "swift" })
    await expect(
      addNative(["date-picker"], { cwd, platform: "swift" })
    ).rejects.toThrow(
      '"date-picker" is a pattern. Run npx @esuiss/ui add patterns date-picker --platform swift'
    )
  })

  it("asks for --path in a Swift package with several targets", async () => {
    const cwd = createProject({
      "Package.swift": "",
      "Sources/App/App.swift": "",
      "Sources/Widgets/Widgets.swift": "",
    })
    await expect(initNative({ cwd, platform: "swift" })).rejects.toThrow(
      "This Swift package has 2 targets: App, Widgets. Pick one with --path Sources/<target>/EsuissUI."
    )
  })

  it("lets the user pick the target and keeps using it", async () => {
    const cwd = createProject({
      "Package.swift": "",
      "Sources/App/App.swift": "",
      "Sources/Widgets/Widgets.swift": "",
    })
    vi.mocked(isInteractive).mockReturnValue(true)
    vi.mocked(choose).mockResolvedValueOnce("Widgets")
    await initNative({ cwd, platform: "swift" })
    await addNative(["dialog"], { cwd, platform: "swift" })
    expect(choose).toHaveBeenCalledTimes(1)
    expect(read(cwd, "Sources/Widgets/EsuissUI/Components/Dialog.swift")).toBe(
      "struct EsuissDialog {}\n"
    )
    expect(output()).toContain(
      `SwiftUI files go to ${path.join("Sources", "Widgets", "EsuissUI")}`
    )
  })

  it("refuses registry files that point outside the folder", async () => {
    serveRegistry({
      ...files,
      "registry.json": {
        ...registry,
        items: [
          {
            name: "button",
            type: "ui",
            dependencies: {},
            requires: [],
            files: [],
            swift: ["../../Escape.swift"],
          },
        ],
      },
      [`${SWIFT_SOURCES}/../../Escape.swift`]: "struct Escape {}\n",
    })
    const cwd = xcodeProject()
    await expect(initNative({ cwd, platform: "swift" })).rejects.toThrow(
      "Refusing to write ../../Escape.swift outside the project."
    )
  })
})
