import { execFileSync } from "node:child_process"
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"

import { convertColors, loadTokens, toRgb, toRgba } from "./theme.mjs"

const ROOT = process.cwd()
const CSS = "styles/uniwind.css"
const THEME = "stylesheet/components/ui/theme.ts"
const SWIFT = "swift/Sources/EsuissUI/Theme/Tokens.swift"
const KOTLIN = "kotlin/ui/src/main/kotlin/com/esuiss/ui/theme/Tokens.kt"
const OUTPUTS = [CSS, THEME, SWIFT, KOTLIN]
const FORMATTED = [CSS, THEME]
const DEFAULT_SHADOWS = {
  xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  sm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
}
const SWIFT_SYSTEM_COLORS = new Set([
  "blue",
  "green",
  "orange",
  "red",
  "yellow",
  "purple",
  "pink",
  "indigo",
  "teal",
  "mint",
  "cyan",
  "brown",
  "gray",
])

function camelCase(name) {
  return name.replace(/-(\w)/g, (_match, letter) => letter.toUpperCase())
}

function key(name) {
  return /^[a-z]\w*$/i.test(name) ? name : `"${name}"`
}

function nativeName(name) {
  return name.replace(/^(\d+)(\w+)$/, "$2$1")
}

function hex(channels) {
  return channels
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()
}

function double(value) {
  return Number.isInteger(value) ? `${value}.0` : String(value)
}

function parseShadow(value) {
  const color = value.match(/(?:oklch|rgb)\([^)]*\)|#[\da-f]{6}\b/i)
  if (!color || value.includes(",")) {
    throw new Error(`Unsupported shadow value "${value}"`)
  }
  const [x = 0, y = 0, blur = 0] = value
    .replace(color[0], "")
    .trim()
    .split(/\s+/)
    .map((part) => Number.parseFloat(part))
  return { x, y, blur, ...toRgba(color[0]) }
}

function buildCss(tokens) {
  const colors = (mode) =>
    Object.entries(tokens.color)
      .map(([name, value]) => `      --color-${name}: ${value[mode]};`)
      .join("\n")
  const text = Object.entries(tokens.text)
    .map(
      ([name, size]) =>
        `  --text-${name}: ${size.fontSize};\n  --text-${name}--line-height: ${size.lineHeight};\n  --text-${name}--letter-spacing: ${size.letterSpacing};`
    )
    .join("\n")
  const shadow = Object.entries(tokens.shadow)
    .map(([name, value]) => `  --shadow-${name}: ${value};`)
    .join("\n")
  const radius = Object.entries(tokens.radius)
    .map(([name, value]) => `  --radius-${name}: ${value};`)
    .join("\n")

  return `@import "tailwindcss";
@import "uniwind";

@layer theme {
  :root {
    @variant light {
${colors("light")}
    }

    @variant dark {
${colors("dark")}
    }
  }
}

@theme {
${text}
${shadow}

${radius}
}
`
}

function colorObject(colors) {
  return Object.entries(colors)
    .map(([name, value]) => `  ${camelCase(name)}: "${toRgb(value)}",`)
    .join("\n")
}

function buildTheme(theme) {
  const radius = Object.entries({ ...theme.radius, full: 9999 })
    .map(([name, value]) => `  ${key(name)}: ${value},`)
    .join("\n")
  const fontSize = Object.entries(theme.text)
    .map(
      ([name, size]) =>
        `  ${key(name)}: { fontSize: ${size.fontSize}, lineHeight: ${size.lineHeight}, letterSpacing: ${size.letterSpacing} },`
    )
    .join("\n")
  const shadows = { ...DEFAULT_SHADOWS, ...theme.shadow }
  const shadow = ["xs", "sm", "md", "lg", "xl"]
    .filter((name) => shadows[name])
    .map(
      (name) =>
        `  ${key(name)}: { boxShadow: "${convertColors(shadows[name])}" },`
    )
    .join("\n")

  return `import { type BoxShadowValue, useColorScheme } from "react-native"

const light = {
${colorObject(theme.light)}
}

type ThemeColors = typeof light

const dark: ThemeColors = {
${colorObject(theme.dark)}
}

const radius = {
${radius}
}

const fontSize = {
${fontSize}
}

const shadow = {
${shadow}
} satisfies Record<string, { boxShadow: string | BoxShadowValue[] }>

function useTheme() {
  const scheme = useColorScheme()
  const isDark = scheme === "dark"
  return { colors: isDark ? dark : light, isDark, radius, fontSize, shadow }
}

export type { ThemeColors }
export { dark, fontSize, light, radius, shadow, useTheme }
`
}

function swiftColor(value) {
  const { channels, alpha } = toRgba(value)
  return alpha === 1
    ? `.init(0x${hex(channels)})`
    : `.init(0x${hex(channels)}, ${alpha})`
}

function swiftShadowColor({ channels, alpha }) {
  if (hex(channels) === "000000") return `.black.opacity(${alpha})`
  return `Color(uiColor: RGBA(0x${hex(channels)}, ${alpha}).uiColor)`
}

function buildSwift(theme) {
  const colors = Object.keys(theme.light)
    .filter((name) => !SWIFT_SYSTEM_COLORS.has(name))
    .map(
      (name) =>
        `  public static let ${camelCase(name)} = Color.adaptive(light: ${swiftColor(theme.light[name])}, dark: ${swiftColor(theme.dark[name])})`
    )
    .join("\n")
  const radius = Object.entries({ ...theme.radius, full: 9999 })
    .map(
      ([name, value]) =>
        `  public static let ${nativeName(name)}: CGFloat = ${value}`
    )
    .join("\n")
  const textNames = Object.keys(theme.text).map(nativeName)
  const text = Object.entries(theme.text)
    .map(
      ([name, size]) =>
        `  public static let ${nativeName(name)} = TextStyle(size: ${size.fontSize}, lineHeight: ${size.lineHeight}, letterSpacing: ${size.letterSpacing})`
    )
    .join("\n")
  const shadow = Object.entries(theme.shadow)
    .map(([name, value]) => {
      const parsed = parseShadow(value)
      const offsets = [
        parsed.x !== 0 ? `, x: ${parsed.x}` : "",
        parsed.y !== 0 ? `, y: ${parsed.y}` : "",
      ].join("")
      return `  public static let ${nativeName(name)} = Shadow(color: ${swiftShadowColor(parsed)}, radius: ${parsed.blur / 2}${offsets})`
    })
    .join("\n")

  return `import SwiftUI

extension Color {
${colors}
}

public enum Radius {
${radius}
}

extension TextStyle {
${text}

  public static let allCases: [TextStyle] = [${textNames.map((name) => `.${name}`).join(", ")}]
}

extension Shadow {
${shadow}
}
`
}

function kotlinColor(value) {
  const { channels, alpha } = toRgba(value)
  const color = `Color(0xFF${hex(channels)})`
  return alpha === 1 ? color : `${color}.copy(alpha = ${alpha}f)`
}

function kotlinShadowColor({ channels, alpha }) {
  const color =
    hex(channels) === "000000" ? "Color.Black" : `Color(0xFF${hex(channels)})`
  return `${color}.copy(alpha = ${alpha}f)`
}

function kotlinColors(colors, isDark) {
  return `${Object.entries(colors)
    .map(([name, value]) => `    ${camelCase(name)} = ${kotlinColor(value)},`)
    .join("\n")}\n    isDark = ${isDark},`
}

function buildKotlin(theme) {
  const fields = Object.keys(theme.light)
    .map((name) => `    val ${camelCase(name)}: Color,`)
    .join("\n")
  const radius = Object.entries({ ...theme.radius, full: 9999 })
    .map(([name, value]) => `    val ${nativeName(name)} = ${value}.dp`)
    .join("\n")
  const textNames = Object.keys(theme.text).map(nativeName)
  const text = Object.entries(theme.text)
    .map(
      ([name, size]) =>
        `    val ${nativeName(name)} = textStyle(${double(size.fontSize)}, ${double(size.lineHeight)}, ${double(size.tracking)})`
    )
    .join("\n")
  const shadow = Object.entries(theme.shadow)
    .map(([name, value]) => {
      const parsed = parseShadow(value)
      return `    val ${nativeName(name)} = Shadow(${parsed.x}.dp, ${parsed.y}.dp, ${parsed.blur}.dp, ${kotlinShadowColor(parsed)})`
    })
    .join("\n")

  return `package com.esuiss.ui.theme

import androidx.compose.runtime.Immutable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp

@Immutable
data class Colors(
${fields}
    val isDark: Boolean,
)

val LightColors = Colors(
${kotlinColors(theme.light, false)}
)

val DarkColors = Colors(
${kotlinColors(theme.dark, true)}
)

object Radius {
${radius}
}

object Typography {
${text}

    val all = listOf(${textNames.join(", ")})
}

object Shadows {
${shadow}
}
`
}

function generate(target) {
  const theme = loadTokens()
  const files = {
    [CSS]: buildCss(theme.source),
    [THEME]: buildTheme(theme),
    [SWIFT]: buildSwift(theme),
    [KOTLIN]: buildKotlin(theme),
  }
  for (const [file, content] of Object.entries(files)) {
    mkdirSync(path.dirname(path.join(target, file)), { recursive: true })
    writeFileSync(path.join(target, file), content)
  }
  execFileSync(
    path.join(ROOT, "node_modules/.bin/biome"),
    ["check", "--write", ...FORMATTED],
    { cwd: target, stdio: "ignore" }
  )
}

function read(base, file) {
  try {
    return readFileSync(path.join(base, file), "utf8")
  } catch {
    return ""
  }
}

if (process.argv.includes("--check")) {
  const temp = mkdtempSync(path.join(tmpdir(), "esuiss-tokens-"))
  try {
    const biome = JSON.parse(read(ROOT, "biome.json"))
    biome.vcs = { enabled: false }
    writeFileSync(path.join(temp, "biome.json"), JSON.stringify(biome))
    generate(temp)
    const stale = OUTPUTS.filter(
      (file) => read(temp, file) !== read(ROOT, file)
    )
    if (stale.length > 0) {
      console.error("Tokens are out of date. Run `pnpm tokens`.")
      for (const file of stale) console.error(`  ${file}`)
      process.exit(1)
    }
    console.log(`Tokens are up to date: ${OUTPUTS.length} files`)
  } finally {
    rmSync(temp, { recursive: true, force: true })
  }
} else {
  generate(ROOT)
  for (const file of OUTPUTS) console.log(`Wrote ${file}`)
}
