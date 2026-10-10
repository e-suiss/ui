import { execFileSync } from "node:child_process"
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs"
import { tmpdir } from "node:os"
import path from "node:path"

import { convertColors, readTheme, toRgb } from "./theme.mjs"

const ROOT = process.cwd()
const SOURCE = "styles/uniwind.css"
const OUTPUT = "stylesheet/components/ui/theme.ts"
const DEFAULT_SHADOWS = {
  xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  sm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
}

function camelCase(name) {
  return name.replace(/-(\w)/g, (_match, letter) => letter.toUpperCase())
}

function key(name) {
  return /^[a-z]\w*$/i.test(name) ? name : `"${name}"`
}

function colorObject(colors) {
  return Object.entries(colors)
    .map(([name, value]) => `  ${camelCase(name)}: "${toRgb(value)}",`)
    .join("\n")
}

function build() {
  const theme = readTheme(readFileSync(path.join(ROOT, SOURCE), "utf8"))
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

function format(dir, file) {
  execFileSync(
    path.join(ROOT, "node_modules/.bin/biome"),
    ["check", "--write", file],
    { cwd: dir, stdio: "ignore" }
  )
}

if (process.argv.includes("--check")) {
  const temp = mkdtempSync(path.join(tmpdir(), "esuiss-theme-"))
  try {
    const biome = JSON.parse(
      readFileSync(path.join(ROOT, "biome.json"), "utf8")
    )
    biome.vcs = { enabled: false }
    writeFileSync(path.join(temp, "biome.json"), JSON.stringify(biome))
    writeFileSync(path.join(temp, "theme.ts"), build())
    format(temp, "theme.ts")
    const expected = readFileSync(path.join(temp, "theme.ts"), "utf8")
    if (expected !== readFileSync(path.join(ROOT, OUTPUT), "utf8")) {
      console.error("theme.ts is out of date. Run `pnpm theme`.")
      process.exit(1)
    }
    console.log("theme.ts is up to date")
  } finally {
    rmSync(temp, { recursive: true, force: true })
  }
} else {
  writeFileSync(path.join(ROOT, OUTPUT), build())
  format(ROOT, OUTPUT)
  console.log(`Wrote ${OUTPUT}`)
}
