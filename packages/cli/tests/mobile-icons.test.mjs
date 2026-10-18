import { spawnSync } from "node:child_process"
import { encodePreset } from "shadcn/preset"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { add } from "../lib/mobile/add.mjs"
import {
  checkIconLibrary,
  detectIconLibrary,
  resolveIconLibrary,
  transformIcons,
} from "../lib/mobile/icons.mjs"
import { addNative } from "../lib/mobile/native.mjs"
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
})
