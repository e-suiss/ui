import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import { encodePreset } from "shadcn/preset"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { normalizeColor } from "../lib/color.mjs"
import { add } from "../lib/mobile/add.mjs"
import { apply } from "../lib/mobile/init.mjs"
import { applyNative } from "../lib/mobile/native.mjs"
import {
  applyThemeOptions,
  paletteOf,
  radiusFactor,
  themeOptionsFor,
} from "../lib/mobile/theme.mjs"
import { createProject, read, silenceOutput } from "./helpers.mjs"

vi.hoisted(() => {
  process.env.ESUISS_MOBILE_REGISTRY = "https://registry.test/mobile/"
  process.env.ESUISS_REGISTRY = "https://registry.test/web/"
})

vi.mock("node:child_process", () => ({
  spawnSync: vi.fn(() => ({ status: 0 })),
}))

const MOBILE = path.join(import.meta.dirname, "../../mobile")
const WEB = path.join(import.meta.dirname, "../../web")
const REGISTRY = JSON.parse(
  readFileSync(path.join(MOBILE, "registry.json"), "utf8")
)
const THEMES = JSON.parse(
  readFileSync(path.join(WEB, "registry/themes.json"), "utf8")
)
const OWN = REGISTRY.colors
const PALETTE = paletteOf(THEMES, { baseColor: "stone", theme: "rose" })
const NONE = radiusFactor("none")
const SWIFT_TOKENS = "EsuissUI/Theme/Tokens.swift"
const KOTLIN_TOKENS = "app/src/main/kotlin/com/esuiss/ui/theme/Tokens.kt"

function mobileSource(file) {
  return readFileSync(path.join(MOBILE, file), "utf8")
}

function serveMobile(registry = REGISTRY) {
  vi.stubGlobal(
    "fetch",
    vi.fn((url) => {
      const address = String(url)
      if (address.endsWith("/mobile/registry.json")) {
        return Promise.resolve(new Response(JSON.stringify(registry)))
      }
      if (address.endsWith("/registry/themes.json")) {
        return Promise.resolve(new Response(JSON.stringify(THEMES)))
      }
      const file = path.join(
        MOBILE,
        address.slice(address.indexOf("/mobile/") + "/mobile/".length)
      )
      return Promise.resolve(
        existsSync(file)
          ? new Response(readFileSync(file, "utf8"))
          : new Response("missing", { status: 404 })
      )
    })
  )
}

function preset(style) {
  return REGISTRY.presets[style]
}

function expoProject(packages, files) {
  return createProject({
    "package.json": {
      dependencies: { expo: "55.0.0", "react-native": "0.83.0", ...packages },
    },
    "tsconfig.json": {
      compilerOptions: { baseUrl: ".", paths: { "@/*": ["./*"] } },
    },
    "App.tsx": "",
    ...files,
  })
}

let output

beforeEach(() => {
  serveMobile()
  output = silenceOutput()
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe("apply --style without a preset", () => {
  const themedRhea = (file, format) =>
    applyThemeOptions(mobileSource(file), format, {
      palette: PALETTE,
      factor: NONE,
    })

  it("keeps the Uniwind radius and colors", async () => {
    const cwd = expoProject(
      { uniwind: "1.0.0" },
      { "global.css": themedRhea(preset("rhea").uniwind, "uniwind") }
    )
    await apply({ cwd, style: "vega", yes: true })
    expect(read(cwd, "global.css")).toBe(
      applyThemeOptions(mobileSource(preset("vega").uniwind), "uniwind", {
        palette: PALETTE,
        factor: NONE,
      })
    )
  })

  it("keeps the StyleSheet radius and colors", async () => {
    const cwd = expoProject(
      {},
      {
        "components/ui/theme.ts": themedRhea(
          preset("rhea").stylesheet,
          "stylesheet"
        ),
      }
    )
    await apply({ cwd, style: "vega", yes: true })
    expect(read(cwd, "components/ui/theme.ts")).toBe(
      applyThemeOptions(mobileSource(preset("vega").stylesheet), "stylesheet", {
        palette: PALETTE,
        factor: NONE,
      })
    )
  })

  it("keeps the NativeWind radius in the Tailwind config", async () => {
    const cwd = expoProject(
      { nativewind: "4.2.0" },
      {
        "global.css": mobileSource(REGISTRY.styles.nativewind.stylesheet),
        "tailwind.config.js": applyThemeOptions(
          mobileSource(preset("rhea").nativewind),
          "nativewind-config",
          { factor: NONE }
        ),
      }
    )
    await apply({ cwd, style: "vega", yes: true })
    expect(read(cwd, "tailwind.config.js")).toBe(
      applyThemeOptions(
        mobileSource(preset("vega").nativewind),
        "nativewind-config",
        { factor: NONE }
      )
    )
  })

  it("keeps the other colors when a primary comes with the style", async () => {
    const cwd = expoProject(
      { uniwind: "1.0.0" },
      { "global.css": themedRhea(preset("rhea").uniwind, "uniwind") }
    )
    await apply({ cwd, style: "vega", primary: "#2563eb", yes: true })
    const css = read(cwd, "global.css")
    expect(css).toContain(`--color-background: ${PALETTE.light.background};`)
    expect(css).toContain(`--color-primary: ${normalizeColor("#2563eb")};`)
  })

  it("keeps the Compose radius", async () => {
    const original = mobileSource(preset("rhea").kotlin)
    const cwd = createProject({
      "app/build.gradle.kts": 'plugins { id("com.android.application") }\n',
      [KOTLIN_TOKENS]: applyThemeOptions(original, "kotlin", {
        palette: PALETTE,
        factor: NONE,
      }),
    })
    await applyNative({ cwd, platform: "kotlin", style: "vega", yes: true })
    expect(read(cwd, KOTLIN_TOKENS)).toBe(
      applyThemeOptions(mobileSource(preset("vega").kotlin), "kotlin", {
        palette: PALETTE,
        factor: NONE,
      })
    )
  })
})

describe("apply --primary with a bold menu accent", () => {
  const bold = encodePreset({
    style: "suiss",
    baseColor: "neutral",
    theme: "green",
    radius: "medium",
    font: "inter",
    iconLibrary: "phosphor",
    menuColor: "inverted",
    menuAccent: "bold",
  })
  const color = normalizeColor("#e11d48")

  it("moves the Uniwind menu accent like init", async () => {
    const theme = await themeOptionsFor({ preset: bold }, () => THEMES, OWN)
    const cwd = expoProject(
      { uniwind: "1.0.0" },
      {
        "global.css": applyThemeOptions(
          mobileSource(REGISTRY.styles.uniwind.stylesheet),
          "uniwind",
          theme
        ),
      }
    )
    await apply({ cwd, primary: "#e11d48" })
    const expected = await themeOptionsFor(
      { preset: bold, primary: "#e11d48" },
      () => THEMES,
      OWN
    )
    expect(read(cwd, "global.css")).toBe(
      applyThemeOptions(
        mobileSource(REGISTRY.styles.uniwind.stylesheet),
        "uniwind",
        expected
      )
    )
    expect(read(cwd, "global.css")).toContain(`--color-menu-accent: ${color};`)
  })

  it("moves the SwiftUI menu accent", async () => {
    const tokens = mobileSource(
      `${REGISTRY.platforms.swift.directory}/Theme/Tokens.swift`
    )
    const theme = await themeOptionsFor({ preset: bold }, () => THEMES, OWN)
    const cwd = createProject({
      "App.xcodeproj/project.pbxproj": "",
      [SWIFT_TOKENS]: applyThemeOptions(tokens, "swift", theme),
    })
    await applyNative({ cwd, platform: "swift", primary: "#e11d48" })
    const expected = await themeOptionsFor(
      { preset: bold, primary: "#e11d48" },
      () => THEMES,
      OWN
    )
    expect(read(cwd, SWIFT_TOKENS)).toBe(
      applyThemeOptions(tokens, "swift", expected)
    )
  })
})

describe("a refused icon dependency", () => {
  const hostile = {
    ...REGISTRY,
    icons: {
      ...REGISTRY.icons,
      lucide: {
        ...REGISTRY.icons.lucide,
        dependencies: ["--ignore-scripts=false", "lucide-react-native"],
      },
    },
  }
  const button = mobileSource("uniwind/components/ui/button.tsx")

  it("leaves the components alone on add", async () => {
    serveMobile(hostile)
    const cwd = expoProject(
      { uniwind: "1.0.0" },
      { "global.css": "", "components/ui/button.tsx": button }
    )
    await expect(
      add(["badge"], { cwd, iconLibrary: "lucide", yes: true })
    ).rejects.toThrow("--ignore-scripts=false")
    expect(read(cwd, "components/ui/button.tsx")).toBe(button)
    expect(existsSync(path.join(cwd, "components/ui/icons.tsx"))).toBe(false)
    expect(existsSync(path.join(cwd, "components/ui/badge.tsx"))).toBe(false)
  })

  it("leaves the theme and components alone on apply", async () => {
    serveMobile(hostile)
    const css = mobileSource(REGISTRY.styles.uniwind.stylesheet)
    const cwd = expoProject(
      { uniwind: "1.0.0" },
      { "global.css": css, "components/ui/button.tsx": button }
    )
    await expect(
      apply({
        cwd,
        preset: encodePreset({ style: "vega", iconLibrary: "lucide" }),
        style: "vega",
        iconLibrary: "lucide",
      })
    ).rejects.toThrow("--ignore-scripts=false")
    expect(read(cwd, "global.css")).toBe(css)
    expect(read(cwd, "components/ui/button.tsx")).toBe(button)
  })
})

describe("the StyleSheet theme on add", () => {
  const theme = applyThemeOptions(
    mobileSource(preset("rhea").stylesheet),
    "stylesheet",
    { palette: PALETTE, factor: NONE }
  )

  it("keeps the preset with --overwrite", async () => {
    const cwd = expoProject({}, { "components/ui/theme.ts": theme })
    await add(["theme"], { cwd, overwrite: true, yes: true })
    expect(read(cwd, "components/ui/theme.ts")).toBe(theme)
  })

  it("does not list the theme as changed", async () => {
    const cwd = expoProject({}, { "components/ui/theme.ts": theme })
    await add(["theme"], { cwd, yes: true })
    expect(output()).not.toContain("components/ui/theme.ts")
  })
})
