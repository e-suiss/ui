import { readFileSync } from "node:fs"
import path from "node:path"
import { encodePreset } from "shadcn/preset"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  applyFonts,
  downloadFaces,
  expoFontPlugin,
  fontModule,
  fontPackagesIn,
  keepFontModule,
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
    expect(presetFonts({ preset: preset("inter") })).toEqual({
      sans: null,
      heading: null,
    })
    expect(presetFonts({})).toBeNull()
  })

  it("installs Inter when the preset names it for the headings too", () => {
    const fonts = presetFonts({ preset: preset("inter", "inter") })
    expect(fonts.sans.family).toBe("Inter")
    expect(fonts.sans.package).toBe("@expo-google-fonts/inter")
    expect(fonts.heading).toBeNull()
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

describe("font module", () => {
  const registry = readFileSync(
    path.join(MOBILE, "components/primitives/font.ts"),
    "utf8"
  )

  it("writes the registry file for the system font", () => {
    expect(fontModule({ sans: null, heading: null })).toBe(registry)
  })

  it("keeps the local fonts when the registry file comes in", () => {
    const local = fontModule(presetFonts({ preset: preset("geist", "lora") }))
    expect(keepFontModule(registry, local)).toBe(local)
    expect(keepFontModule(registry, "")).toBe(registry)
  })

  it("reads the font packages back", () => {
    const local = fontModule(presetFonts({ preset: preset("geist", "lora") }))
    expect(fontPackagesIn(local)).toEqual([
      "@expo-google-fonts/geist",
      "@expo-google-fonts/lora",
    ])
    expect(fontPackagesIn(registry)).toEqual([])
  })
})

describe("downloadFaces", () => {
  afterEach(() => vi.unstubAllGlobals())

  it("skips faces the family does not have", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url) =>
        Promise.resolve(
          url.includes("400Regular")
            ? new Response("font", { status: 200 })
            : new Response("missing", { status: 404 })
        )
      )
    )
    const faces = await downloadFaces(
      presetFonts({ preset: preset("instrument-serif") })
    )
    expect(faces.map((face) => face.file)).toEqual([
      "InstrumentSerif_400Regular.ttf",
    ])
  })

  it("fails loudly when a download breaks", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new TypeError("fetch failed")))
    )
    await expect(
      downloadFaces(presetFonts({ preset: preset("geist") }))
    ).rejects.toThrow("Could not download Geist_400Regular.ttf")
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
