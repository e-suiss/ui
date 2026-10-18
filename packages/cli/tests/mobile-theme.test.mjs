import { readFileSync } from "node:fs"
import path from "node:path"
import { encodePreset } from "shadcn/preset"
import { describe, expect, it } from "vitest"

import {
  applyThemeOptions,
  paletteOf,
  radiusFactor,
  themeOptionsFor,
} from "../lib/mobile/theme.mjs"

const MOBILE = path.join(import.meta.dirname, "../../mobile")
const THEMES = JSON.parse(
  readFileSync(
    path.join(import.meta.dirname, "../../web/registry/themes.json"),
    "utf8"
  )
)
const TOKENS = JSON.parse(
  readFileSync(
    path.join(import.meta.dirname, "../../tokens/tokens.json"),
    "utf8"
  )
)
const FILES = {
  uniwind: "styles/uniwind.css",
  "nativewind-css": "styles/nativewind.css",
  "nativewind-config": "styles/nativewind.config.js",
  stylesheet: "stylesheet/components/ui/theme.ts",
  swift: "swiftui/Sources/EsuissUI/Theme/Tokens.swift",
  kotlin: "kotlin/ui/src/main/kotlin/com/esuiss/ui/theme/Tokens.kt",
}
const OWN = {
  light: Object.fromEntries(
    Object.entries(TOKENS.color).map(([name, value]) => [name, value.light])
  ),
  dark: Object.fromEntries(
    Object.entries(TOKENS.color).map(([name, value]) => [name, value.dark])
  ),
}

function source(format) {
  return readFileSync(path.join(MOBILE, FILES[format]), "utf8")
}

describe("applyThemeOptions", () => {
  it.each(Object.keys(FILES))(
    "keeps %s identical for the suiss colors and radius",
    (format) => {
      const text = source(format)
      expect(applyThemeOptions(text, format, { palette: OWN })).toBe(text)
    }
  )

  it.each(Object.keys(FILES))(
    "writes the preset palette or radius into %s",
    (format) => {
      const text = source(format)
      const palette = paletteOf(THEMES, { baseColor: "zinc", theme: "blue" })
      const next = applyThemeOptions(text, format, {
        palette,
        factor: radiusFactor("large"),
      })
      expect(next).not.toBe(text)
    }
  )

  it("writes oklch to the uniwind stylesheet and hex to Swift", () => {
    const palette = paletteOf(THEMES, { baseColor: "zinc", theme: "blue" })
    const blue = THEMES.find((theme) => theme.name === "blue")
    expect(
      applyThemeOptions(source("uniwind"), "uniwind", { palette })
    ).toContain(`--color-primary: ${blue.light.primary};`)
    expect(applyThemeOptions(source("swift"), "swift", { palette })).toContain(
      "public static let primary = Color.adaptive(light: .init(0x1447E6), dark: .init(0x193CB8))"
    )
  })

  it("scales radii but keeps pills", () => {
    const next = applyThemeOptions(source("kotlin"), "kotlin", {
      factor: radiusFactor("none"),
    })
    expect(next).toContain("val md = 0.dp")
    expect(next).toContain("val button = 9999.dp")
  })
})

describe("themeOptionsFor", () => {
  const preset = encodePreset({
    style: "nova",
    baseColor: "zinc",
    theme: "blue",
    radius: "large",
    font: "inter",
    iconLibrary: "lucide",
    menuColor: "default",
    menuAccent: "subtle",
  })

  it("returns nothing without a preset", async () => {
    expect(await themeOptionsFor({}, () => THEMES)).toBeNull()
  })

  it("keeps the suiss colors with --theme suiss", async () => {
    const options = await themeOptionsFor(
      { preset, theme: "suiss" },
      () => THEMES
    )
    expect(options.palette).toBeNull()
    expect(options.factor).toBe(radiusFactor("large"))
  })

  it("merges the base color and the theme", async () => {
    const options = await themeOptionsFor({ preset }, () => THEMES)
    const blue = THEMES.find((theme) => theme.name === "blue")
    expect(options.palette.light.primary).toBe(blue.light.primary)
  })
})
