import { readFileSync } from "node:fs"
import path from "node:path"
import { encodePreset } from "shadcn/preset"
import { describe, expect, it } from "vitest"

import {
  applyFonts,
  expoFontPlugin,
  fontModule,
  presetFonts,
} from "../lib/mobile/fonts.mjs"
import { createProject } from "./helpers.mjs"

const MOBILE = path.join(import.meta.dirname, "../../mobile")

function preset(font, fontHeading = "inherit") {
  return encodePreset({
    style: "nova",
    baseColor: "neutral",
    theme: "neutral",
    radius: "default",
    font,
    fontHeading,
    iconLibrary: "lucide",
    menuColor: "default",
    menuAccent: "subtle",
  })
}

describe("presetFonts", () => {
  it("keeps the system font for the default font", () => {
    expect(presetFonts({ preset: preset("inter") })).toBeNull()
    expect(presetFonts({})).toBeNull()
  })

  it("resolves the family, package and faces", () => {
    const fonts = presetFonts({ preset: preset("source-sans-3", "lora") })
    expect(fonts.sans.family).toBe("Source Sans 3")
    expect(fonts.sans.package).toBe("@expo-google-fonts/source-sans-3")
    expect(fonts.sans.faces[0].url).toBe(
      "https://cdn.jsdelivr.net/npm/@expo-google-fonts/source-sans-3@0.4/400Regular/SourceSans3_400Regular.ttf"
    )
    expect(fonts.heading.family).toBe("Lora")
  })
})

describe("fontModule", () => {
  it("writes the families into the font primitive", () => {
    const fonts = presetFonts({ preset: preset("geist") })
    expect(fontModule(fonts)).toContain(
      'const fonts: Fonts = { sans: "Geist" }'
    )
  })
})

describe("expoFontPlugin", () => {
  it("lists the installed faces per platform", () => {
    const cwd = createProject({
      "node_modules/@expo-google-fonts/geist/400Regular/Geist_400Regular.ttf":
        "",
      "node_modules/@expo-google-fonts/geist/700Bold/Geist_700Bold.ttf": "",
    })
    const [name, config] = expoFontPlugin(
      cwd,
      presetFonts({ preset: preset("geist") })
    )
    expect(name).toBe("expo-font")
    expect(config.ios.fonts).toEqual([
      "./node_modules/@expo-google-fonts/geist/400Regular/Geist_400Regular.ttf",
      "./node_modules/@expo-google-fonts/geist/700Bold/Geist_700Bold.ttf",
    ])
    expect(config.android.fonts[0]).toEqual({
      fontFamily: "Geist",
      fontDefinitions: [
        {
          path: "./node_modules/@expo-google-fonts/geist/400Regular/Geist_400Regular.ttf",
          weight: 400,
        },
        {
          path: "./node_modules/@expo-google-fonts/geist/700Bold/Geist_700Bold.ttf",
          weight: 700,
        },
      ],
    })
  })
})

describe("applyFonts", () => {
  const fonts = presetFonts({ preset: preset("geist", "lora") })
  const faces = [
    { ...fonts.sans.faces[0], font: fonts.sans },
    { ...fonts.heading.faces[3], font: fonts.heading },
  ]

  it("sets the SwiftUI fonts", () => {
    const text = readFileSync(
      path.join(MOBILE, "swiftui/Sources/EsuissUI/Theme/Tokens.swift"),
      "utf8"
    )
    const next = applyFonts(text, "swift", fonts, faces)
    expect(next).toContain('public static let sans: String? = "Geist"')
    expect(next).toContain('public static let heading: String? = "Lora"')
    expect(next).toContain(
      'public static let files: [String] = ["Geist_400Regular", "Lora_700Bold"]'
    )
  })

  it("sets the Compose font files", () => {
    const text = readFileSync(
      path.join(
        MOBILE,
        "kotlin/ui/src/main/kotlin/com/esuiss/ui/theme/Tokens.kt"
      ),
      "utf8"
    )
    const next = applyFonts(text, "kotlin", fonts, faces)
    expect(next).toContain(
      'val sans: List<FontFile> = listOf(FontFile("fonts/geist_400regular.ttf", 400))'
    )
    expect(next).toContain(
      'val heading: List<FontFile> = listOf(FontFile("fonts/lora_700bold.ttf", 700))'
    )
  })
})
