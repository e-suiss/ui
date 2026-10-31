import { spawnSync } from "node:child_process"
import { existsSync, readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { encodePreset } from "shadcn/preset"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { add } from "../lib/mobile/add.mjs"
import {
  checkIconLibrary,
  detectIconLibrary,
  resolveIconLibrary,
  restoreIcons,
  switchIcons,
  transformIcons,
} from "../lib/mobile/icons.mjs"
import { apply as applyMobile } from "../lib/mobile/init.mjs"
import { addNative, applyNative, initNative } from "../lib/mobile/native.mjs"
import {
  createProject,
  read,
  serveRegistry,
  silenceOutput,
} from "./helpers.mjs"

vi.hoisted(() => {
  process.env.ESUISS_MOBILE_REGISTRY = "https://registry.test/mobile/"
})

vi.mock("node:child_process", () => ({
  spawnSync: vi.fn(() => ({ status: 0 })),
}))

vi.mock("../lib/prompt.mjs", () => ({
  isInteractive: vi.fn(() => false),
  choose: vi.fn(),
}))

const RN_BUTTON = `import { CheckIcon, type Icon } from "phosphor-react-native"
export function Button() {}
`
const SWIFT_BUTTON = `import PhosphorSwift
import SwiftUI

let icon = Ph.check.bold
`
const KOTLIN_BUTTON = `package com.esuiss.ui.components

import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.bold.Check

val icon = PhosphorIcons.Bold.Check
`

const icons = (library, dependencies) => ({
  rn: `icons/rn/${library}.tsx`,
  swift: [`icons/swift/${library}/Icons/EsuissIcons.swift`],
  kotlin: [
    `icons/kotlin/${library}/icons/EsuissIcons.kt`,
    `icons/kotlin/${library}/icons/bold/Bold.kt`,
  ],
  dependencies,
})

const registry = {
  name: "esuiss-ui-mobile",
  homepage: "https://suiss.app/ui",
  styles: {
    uniwind: { stylesheet: "styles/uniwind.css", directory: "uniwind" },
    nativewind: {
      stylesheet: "styles/nativewind.css",
      directory: "nativewind",
    },
    stylesheet: {
      theme: "stylesheet/components/ui/theme.ts",
      directory: "stylesheet",
    },
  },
  platforms: {
    swift: {
      directory: "swiftui/Sources/EsuissUI",
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
    kotlin: {
      directory: "kotlin/ui/src/main/kotlin/com/esuiss/ui",
      base: ["theme/Theme.kt", "theme/Tokens.kt"],
      requirements: {
        minSdk: 24,
        compileSdk: 37,
        dependencies: [
          "androidx.compose.ui:ui",
          "com.adamglin:phosphor-icon-android:1.0.0",
        ],
      },
    },
  },
  icons: {
    lucide: icons("lucide", ["lucide-react-native"]),
    tabler: icons("tabler", ["@tabler/icons-react-native"]),
  },
  items: [
    {
      name: "button",
      type: "ui",
      dependencies: {
        uniwind: ["phosphor-react-native"],
        nativewind: ["phosphor-react-native"],
        stylesheet: ["phosphor-react-native"],
      },
      requires: [],
      files: ["components/ui/button.tsx"],
      swift: ["Components/Button.swift"],
      kotlin: ["components/Button.kt"],
    },
  ],
}

const files = {
  "registry.json": registry,
  "registry/themes.json": [],
  "components/ui/button.tsx": RN_BUTTON,
  "icons/rn/lucide.tsx": 'import {} from "lucide-react-native"\n',
  "icons/rn/tabler.tsx": 'import {} from "@tabler/icons-react-native"\n',
  "swiftui/Sources/EsuissUI/Components/Button.swift": SWIFT_BUTTON,
  "icons/swift/lucide/Icons/EsuissIcons.swift":
    'public enum EsuissIcon {\n  public static let library = "lucide"\n}\n',
  "kotlin/ui/src/main/kotlin/com/esuiss/ui/components/Button.kt": KOTLIN_BUTTON,
  "icons/kotlin/lucide/icons/EsuissIcons.kt":
    'object EsuissIcons {\n  const val LIBRARY = "lucide"\n}\n',
  "icons/kotlin/lucide/icons/bold/Bold.kt":
    "package com.esuiss.ui.icons.bold\n",
}

function expoProject(extra = {}) {
  return createProject({
    "package.json": {
      dependencies: { expo: "55.0.0", "react-native": "0.83.0", uniwind: "1" },
    },
    "tsconfig.json": {
      compilerOptions: { baseUrl: ".", paths: { "@/*": ["./src/*"] } },
    },
    ...extra,
  })
}

let output

beforeEach(() => {
  output = silenceOutput()
  vi.mocked(spawnSync).mockClear()
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe("icon transforms", () => {
  it("keeps Phosphor sources as they are", () => {
    expect(transformIcons("rn", RN_BUTTON, "phosphor")).toBe(RN_BUTTON)
    expect(transformIcons("swift", SWIFT_BUTTON, "phosphor")).toBe(SWIFT_BUTTON)
    expect(transformIcons("kotlin", KOTLIN_BUTTON, "phosphor")).toBe(
      KOTLIN_BUTTON
    )
  })

  it("points React Native imports at the local icons file", () => {
    expect(transformIcons("rn", RN_BUTTON, "lucide")).toBe(
      'import { CheckIcon, type Icon } from "@/components/ui/icons"\nexport function Button() {}\n'
    )
  })

  it("swaps the SwiftUI icon enum and drops the package import", () => {
    expect(transformIcons("swift", SWIFT_BUTTON, "tabler")).toBe(
      "import SwiftUI\n\nlet icon = EsuissIcon.check.bold\n"
    )
  })

  it("swaps the Compose icon objects and imports", () => {
    expect(transformIcons("kotlin", KOTLIN_BUTTON, "hugeicons")).toBe(
      `package com.esuiss.ui.components

import com.esuiss.ui.icons.EsuissIcons
import com.esuiss.ui.icons.Bold
import com.esuiss.ui.icons.bold.Check

val icon = EsuissIcons.Bold.Check
`
    )
  })
})

describe("icon library options", () => {
  it("rejects unknown libraries", () => {
    expect(() => checkIconLibrary("feather")).toThrow(
      "--icon-library needs phosphor, lucide, tabler, hugeicons or remixicon."
    )
  })

  it("prefers the flag over the preset", () => {
    const preset = encodePreset({ iconLibrary: "tabler" })
    expect(resolveIconLibrary({ preset })).toBe("tabler")
    expect(resolveIconLibrary({ preset, iconLibrary: "lucide" })).toBe("lucide")
    expect(resolveIconLibrary({})).toBeUndefined()
  })

  it("reads the installed library back from the icons file", () => {
    const cwd = createProject({
      "components/ui/icons.tsx":
        'import {} from "@tabler/icons-react-native"\n',
      "Icons/EsuissIcons.swift": 'public static let library = "remixicon"\n',
      "icons/EsuissIcons.kt": 'const val LIBRARY = "lucide"\n',
    })
    expect(detectIconLibrary("rn", cwd)).toBe("tabler")
    expect(detectIconLibrary("swift", cwd)).toBe("remixicon")
    expect(detectIconLibrary("kotlin", cwd)).toBe("lucide")
  })
})

describe("mobile add with an icon library", () => {
  it("rewrites imports, adds the icons file and swaps the package", async () => {
    serveRegistry(files)
    const cwd = expoProject()
    await add(["button"], { cwd, iconLibrary: "lucide" })
    expect(read(cwd, "src/components/ui/button.tsx")).toContain(
      'from "@/components/ui/icons"'
    )
    expect(read(cwd, "src/components/ui/icons.tsx")).toBe(
      files["icons/rn/lucide.tsx"]
    )
    expect(spawnSync).toHaveBeenCalledWith(
      "npx",
      ["expo", "install", "lucide-react-native"],
      expect.objectContaining({ cwd })
    )
  })

  it("keeps the library of the installed icons file", async () => {
    serveRegistry(files)
    const cwd = expoProject({
      "src/components/ui/icons.tsx": files["icons/rn/tabler.tsx"],
    })
    await add(["button"], { cwd })
    expect(read(cwd, "src/components/ui/button.tsx")).toContain(
      'from "@/components/ui/icons"'
    )
    expect(spawnSync).toHaveBeenCalledWith(
      "npx",
      ["expo", "install", "@tabler/icons-react-native"],
      expect.objectContaining({ cwd })
    )
  })

  it("leaves Phosphor projects unchanged", async () => {
    serveRegistry(files)
    const cwd = expoProject()
    await add(["button"], { cwd })
    expect(read(cwd, "src/components/ui/button.tsx")).toBe(RN_BUTTON)
    expect(spawnSync).toHaveBeenCalledWith(
      "npx",
      ["expo", "install", "phosphor-react-native"],
      expect.objectContaining({ cwd })
    )
  })
})

describe("native add with an icon library", () => {
  it("writes the SwiftUI icons and drops the Phosphor package", async () => {
    serveRegistry(files)
    const cwd = createProject({
      "App.xcodeproj/project.pbxproj": "",
      "EsuissUI/Theme/Theme.swift": "",
      "EsuissUI/Theme/Tokens.swift": "",
    })
    await addNative(["button"], {
      cwd,
      platform: "swift",
      iconLibrary: "lucide",
    })
    expect(read(cwd, "EsuissUI/Components/Button.swift")).toBe(
      "import SwiftUI\n\nlet icon = EsuissIcon.check.bold\n"
    )
    expect(read(cwd, "EsuissUI/Icons/EsuissIcons.swift")).toBe(
      files["icons/swift/lucide/Icons/EsuissIcons.swift"]
    )
    expect(output()).not.toContain("phosphor-icons")
  })

  it("writes the Compose icons next to the components", async () => {
    serveRegistry(files)
    const cwd = createProject({
      "build.gradle.kts":
        'plugins { id("com.android.application") }\nandroid { defaultConfig { minSdk = 26 } }\n',
      "src/main/kotlin/com/esuiss/ui/theme/Theme.kt": "",
      "src/main/kotlin/com/esuiss/ui/theme/Tokens.kt": "",
    })
    await addNative(["button"], {
      cwd,
      platform: "kotlin",
      iconLibrary: "lucide",
    })
    expect(
      read(cwd, "src/main/kotlin/com/esuiss/ui/components/Button.kt")
    ).toContain("import com.esuiss.ui.icons.bold.Check")
    expect(read(cwd, "src/main/kotlin/com/esuiss/ui/icons/bold/Bold.kt")).toBe(
      files["icons/kotlin/lucide/icons/bold/Bold.kt"]
    )
    expect(output()).not.toContain("phosphor-icon-android")
  })

  it.each([
    ["compileSdk = 36", true],
    ["compileSdk = 37", false],
    ["compileSdk { version = release(36) }", true],
    ["compileSdk { version = release(37) }", false],
    ["compileSdkVersion 37", false],
  ])("asks for compileSdk 37 when the module has %s", async (setting, asks) => {
    serveRegistry(files)
    const cwd = createProject({
      "build.gradle.kts": `plugins { id("com.android.application") }\nandroid {\n  ${setting}\n  defaultConfig { minSdk = 26 }\n}\n`,
      "src/main/kotlin/com/esuiss/ui/theme/Theme.kt": "",
      "src/main/kotlin/com/esuiss/ui/theme/Tokens.kt": "",
    })
    await addNative(["button"], { cwd, platform: "kotlin" })
    expect(output().includes("android { compileSdk = 37 }")).toBe(asks)
  })

  it("reads the dependencies a module takes from the version catalog", async () => {
    serveRegistry(files)
    const cwd = createProject({
      "gradle/libs.versions.toml":
        '[versions]\nui = "1.0.0"\n\n[libraries]\nandroidx-ui = { group = "androidx.compose.ui", name = "ui" }\nphosphor = { module = "com.adamglin:phosphor-icon-android", version = "1.0.0" }\nunused = "com.example:unused:1.0.0"\n\n[plugins]\nandroid-application = { id = "com.android.application", version = "9.0.0" }\n',
      "app/build.gradle.kts":
        "plugins {\n  alias(libs.plugins.android.application)\n  alias(libs.plugins.kotlin.compose)\n}\nandroid {\n  compileSdk = 37\n  defaultConfig { minSdk = 26 }\n  buildFeatures { compose = true }\n}\ndependencies {\n  implementation(libs.androidx.ui)\n  implementation(libs.phosphor)\n}\n",
      "app/src/main/kotlin/com/esuiss/ui/theme/Theme.kt": "",
      "app/src/main/kotlin/com/esuiss/ui/theme/Tokens.kt": "",
    })
    await addNative(["button"], { cwd, platform: "kotlin" })
    expect(output()).not.toContain("Add to")
  })

  it("asks for catalog libraries the module does not use", async () => {
    serveRegistry(files)
    const cwd = createProject({
      "gradle/libs.versions.toml":
        '[libraries]\nandroidx-ui = { group = "androidx.compose.ui", name = "ui" }\nandroidx-ui-tooling = { group = "androidx.compose.ui", name = "ui-tooling" }\n',
      "app/build.gradle.kts":
        "plugins {\n  alias(libs.plugins.android.application)\n  alias(libs.plugins.kotlin.compose)\n}\nandroid {\n  compileSdk = 37\n  defaultConfig { minSdk = 26 }\n  buildFeatures { compose = true }\n}\ndependencies {\n  debugImplementation(libs.androidx.ui.tooling)\n}\n",
      "app/src/main/kotlin/com/esuiss/ui/theme/Theme.kt": "",
      "app/src/main/kotlin/com/esuiss/ui/theme/Tokens.kt": "",
    })
    await addNative(["button"], { cwd, platform: "kotlin" })
    expect(output()).toContain('implementation("androidx.compose.ui:ui")')
  })
})

const MOBILE = path.join(import.meta.dirname, "../../mobile")

function sourcesOf(directory, extension) {
  const found = []
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(file)
      else if (file.endsWith(extension)) found.push(file)
    }
  }
  walk(path.join(MOBILE, directory))
  return found
}

describe("restoreIcons", () => {
  it.each([
    ["rn", "uniwind/components", ".tsx"],
    ["rn", "stylesheet/components", ".tsx"],
    ["swift", "swiftui/Sources/EsuissUI", ".swift"],
    ["kotlin", "kotlin/ui/src/main/kotlin/com/esuiss/ui", ".kt"],
  ])(
    "undoes the %s icon transform of every registry source in %s",
    (platform, directory, extension) => {
      const sources = sourcesOf(directory, extension)
      expect(sources.length).toBeGreaterThan(0)
      for (const file of sources) {
        const original = readFileSync(file, "utf8")
        expect(
          restoreIcons(platform, transformIcons(platform, original, "lucide")),
          file
        ).toBe(original)
      }
    }
  )
})

const LUCIDE_BUTTON = transformIcons("rn", RN_BUTTON, "lucide")

describe("switching the icon library", () => {
  it("swaps the React Native icons file between custom libraries", async () => {
    serveRegistry(files)
    const cwd = createProject({
      "components/ui/icons.tsx": files["icons/rn/lucide.tsx"],
      "components/ui/button.tsx": LUCIDE_BUTTON,
    })
    const result = await switchIcons({
      platform: "rn",
      root: cwd,
      registry,
      library: "tabler",
      fetchText: (source) =>
        fetch(`https://registry.test/mobile/${source}`).then((response) =>
          response.text()
        ),
    })
    expect(read(cwd, "components/ui/icons.tsx")).toBe(
      files["icons/rn/tabler.tsx"]
    )
    expect(read(cwd, "components/ui/button.tsx")).toBe(LUCIDE_BUTTON)
    expect(result.dependencies).toEqual(["@tabler/icons-react-native"])
    expect(result.unused).toEqual(["lucide-react-native"])
  })

  it("does nothing when the library is already installed", async () => {
    const cwd = createProject({
      "components/ui/icons.tsx": files["icons/rn/lucide.tsx"],
    })
    expect(
      await switchIcons({
        platform: "rn",
        root: cwd,
        registry,
        library: "lucide",
      })
    ).toBeNull()
  })

  it("moves React Native components back to Phosphor on apply", async () => {
    serveRegistry({
      ...files,
      "styles/uniwind.css": "@variant light {\n}\n@variant dark {\n}\n",
    })
    const cwd = expoProject({
      "src/global.css": "@variant light {\n}\n@variant dark {\n}\n",
      "src/components/ui/icons.tsx": files["icons/rn/lucide.tsx"],
      "src/components/ui/button.tsx": LUCIDE_BUTTON,
      "src/components/patterns/picker.tsx": LUCIDE_BUTTON,
    })
    await applyMobile({
      cwd,
      preset: encodePreset({ iconLibrary: "phosphor" }),
      iconLibrary: "phosphor",
    })
    expect(read(cwd, "src/components/ui/button.tsx")).toBe(RN_BUTTON)
    expect(read(cwd, "src/components/patterns/picker.tsx")).toBe(RN_BUTTON)
    expect(existsSync(`${cwd}/src/components/ui/icons.tsx`)).toBe(false)
    expect(spawnSync).toHaveBeenCalledWith(
      "npx",
      ["expo", "install", "phosphor-react-native"],
      expect.objectContaining({ cwd })
    )
    expect(output()).toContain("lucide-react-native is no longer used")
  })

  it("switches the installed components when add gets another library", async () => {
    serveRegistry(files)
    const cwd = expoProject({
      "src/components/ui/icons.tsx": files["icons/rn/lucide.tsx"],
      "src/components/ui/card.tsx": LUCIDE_BUTTON,
    })
    await add(["button"], { cwd, iconLibrary: "tabler" })
    expect(read(cwd, "src/components/ui/icons.tsx")).toBe(
      files["icons/rn/tabler.tsx"]
    )
    expect(read(cwd, "src/components/ui/card.tsx")).toBe(LUCIDE_BUTTON)
    expect(spawnSync).toHaveBeenCalledWith(
      "npx",
      ["expo", "install", "@tabler/icons-react-native"],
      expect.objectContaining({ cwd })
    )
  })

  it("switches SwiftUI components to a custom library on apply", async () => {
    serveRegistry({
      ...files,
      "swiftui/Sources/EsuissUI/Theme/Tokens.swift": "struct Tokens {}\n",
    })
    const cwd = createProject({
      "App.xcodeproj/project.pbxproj": "",
      "EsuissUI/Theme/Theme.swift": "",
      "EsuissUI/Theme/Tokens.swift": "struct Tokens {}\n",
      "EsuissUI/Components/Button.swift": SWIFT_BUTTON,
    })
    await applyNative({
      cwd,
      platform: "swift",
      preset: encodePreset({ iconLibrary: "lucide" }),
      iconLibrary: "lucide",
    })
    expect(read(cwd, "EsuissUI/Components/Button.swift")).toBe(
      transformIcons("swift", SWIFT_BUTTON, "lucide")
    )
    expect(read(cwd, "EsuissUI/Icons/EsuissIcons.swift")).toBe(
      files["icons/swift/lucide/Icons/EsuissIcons.swift"]
    )
    expect(output()).not.toContain("phosphor-icons")
  })

  it("moves Compose components back to Phosphor and removes the icon files", async () => {
    serveRegistry({
      ...files,
      "kotlin/ui/src/main/kotlin/com/esuiss/ui/theme/Tokens.kt":
        "object Tokens\n",
    })
    const root = "src/main/kotlin/com/esuiss/ui"
    const cwd = createProject({
      "build.gradle.kts":
        'plugins { id("com.android.application") }\nandroid { defaultConfig { minSdk = 26 } }\n',
      [`${root}/theme/Theme.kt`]: "",
      [`${root}/theme/Tokens.kt`]: "object Tokens\n",
      [`${root}/components/Button.kt`]: transformIcons(
        "kotlin",
        KOTLIN_BUTTON,
        "lucide"
      ),
      [`${root}/icons/EsuissIcons.kt`]:
        files["icons/kotlin/lucide/icons/EsuissIcons.kt"],
      [`${root}/icons/bold/Bold.kt`]:
        files["icons/kotlin/lucide/icons/bold/Bold.kt"],
    })
    await applyNative({
      cwd,
      platform: "kotlin",
      preset: encodePreset({ iconLibrary: "phosphor" }),
      iconLibrary: "phosphor",
    })
    expect(read(cwd, `${root}/components/Button.kt`)).toBe(KOTLIN_BUTTON)
    expect(existsSync(`${cwd}/${root}/icons/EsuissIcons.kt`)).toBe(false)
    expect(existsSync(`${cwd}/${root}/icons/bold/Bold.kt`)).toBe(false)
    expect(existsSync(`${cwd}/${root}/icons`)).toBe(false)
    expect(output()).toContain("com.adamglin:phosphor-icon-android:1.0.0")
  })
})

describe("native init with an icon library", () => {
  it("writes the icon files even when the init files use no icons", async () => {
    serveRegistry({
      ...files,
      "swiftui/Sources/EsuissUI/Theme/Theme.swift": "struct Theme {}\n",
      "swiftui/Sources/EsuissUI/Theme/Tokens.swift": "struct Tokens {}\n",
      "swiftui/Sources/EsuissUI/Components/Button.swift":
        "import SwiftUI\n\nstruct EsuissButton {}\n",
    })
    const cwd = createProject({ "App.xcodeproj/project.pbxproj": "" })
    await initNative({ cwd, platform: "swift", iconLibrary: "lucide" })
    expect(read(cwd, "EsuissUI/Icons/EsuissIcons.swift")).toBe(
      files["icons/swift/lucide/Icons/EsuissIcons.swift"]
    )
    serveRegistry(files)
    await addNative(["button"], { cwd, platform: "swift", overwrite: true })
    expect(read(cwd, "EsuissUI/Components/Button.swift")).not.toContain(
      "PhosphorSwift"
    )
  })
})
