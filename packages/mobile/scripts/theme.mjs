import { readFileSync } from "node:fs"
import { createRequire } from "node:module"
import path from "node:path"

const HEX_COLOR = /^#([\da-f]{3}|[\da-f]{6})$/i
const RGB_COLOR = /^rgb\(\s*(\d+)\s+(\d+)\s+(\d+)\s*(?:\/\s*([\d.]+%?))?\s*\)$/
const OKLCH_COLOR =
  /^oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+%?))?\s*\)$/
const PALETTE_COLOR = /--color-([a-z]+(?:-\d+)?):\s*([^;]+);/g

const TOKENS = path.join(import.meta.dirname, "../../tokens/tokens.json")
const STYLE_TOKENS = path.join(import.meta.dirname, "../../tokens/styles.json")
const TAILWIND_THEME = createRequire(import.meta.url).resolve(
  "tailwindcss/theme.css"
)
const ROOT_FONT_SIZE = 16
const PALETTE = [
  "black",
  "white",
  "red-500",
  "orange-500",
  "amber-400",
  "amber-500",
  "amber-600",
  "yellow-500",
  "green-400",
  "green-500",
  "green-600",
  "teal-400",
  "teal-500",
  "cyan-500",
  "blue-500",
  "indigo-500",
  "purple-500",
  "pink-500",
  "zinc-500",
]

function parseLightness(value) {
  return value.endsWith("%") ? Number(value.slice(0, -1)) / 100 : Number(value)
}

function parseAlpha(value) {
  if (value === undefined) return 1
  return value.endsWith("%") ? Number(value.slice(0, -1)) / 100 : Number(value)
}

function encode(channel) {
  const clamped = Math.min(1, Math.max(0, channel))
  const gamma =
    clamped <= 0.0031308
      ? 12.92 * clamped
      : 1.055 * clamped ** (1 / 2.4) - 0.055
  return Math.round(gamma * 255)
}

function oklchToRgb(lightness, chroma, hue) {
  const radians = (hue * Math.PI) / 180
  const a = chroma * Math.cos(radians)
  const b = chroma * Math.sin(radians)
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    encode(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s),
    encode(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s),
    encode(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s),
  ]
}

function parseColor(value) {
  const hex = value.match(HEX_COLOR)
  if (hex) {
    const digits = hex[1].length === 3 ? hex[1].replace(/./g, "$&$&") : hex[1]
    const channels = digits
      .match(/../g)
      .map((part) => Number.parseInt(part, 16))
    return { channels, alpha: 1 }
  }
  const rgb = value.match(RGB_COLOR)
  if (rgb) {
    return { channels: rgb.slice(1, 4).map(Number), alpha: parseAlpha(rgb[4]) }
  }
  const oklch = value.match(OKLCH_COLOR)
  if (oklch) {
    return {
      channels: oklchToRgb(
        parseLightness(oklch[1]),
        Number(oklch[2]),
        Number(oklch[3])
      ),
      alpha: parseAlpha(oklch[4]),
    }
  }
  throw new Error(`Unsupported color value "${value}"`)
}

function round(value) {
  return Math.round(value * 1000) / 1000
}

function toRgb(value, opacity = 1) {
  const { channels, alpha } = parseColor(value)
  const combined = round(alpha * opacity)
  if (combined === 1) {
    return `#${channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`
  }
  return `rgba(${channels.join(", ")}, ${combined})`
}

function toPixels(value) {
  if (value.endsWith("rem"))
    return round(Number.parseFloat(value) * ROOT_FONT_SIZE)
  if (value.endsWith("px")) return round(Number.parseFloat(value))
  return round(Number.parseFloat(value))
}

function loadPalette() {
  const values = Object.fromEntries(
    [...readFileSync(TAILWIND_THEME, "utf8").matchAll(PALETTE_COLOR)].map(
      (match) => [match[1], match[2].trim()]
    )
  )
  return Object.fromEntries(
    PALETTE.map((name) => {
      if (!values[name]) throw new Error(`Unknown palette color "${name}"`)
      return [name, values[name]]
    })
  )
}

function loadTokens() {
  const tokens = JSON.parse(readFileSync(TOKENS, "utf8"))
  const colors = Object.entries(tokens.color)
  const text = Object.fromEntries(
    Object.entries(tokens.text).map(([name, size]) => [
      name,
      {
        fontSize: toPixels(size.fontSize),
        lineHeight: toPixels(size.lineHeight),
      },
    ])
  )
  const radius = Object.fromEntries(
    Object.entries(tokens.radius).map(([name, value]) => [
      name,
      toPixels(value),
    ])
  )
  return {
    light: Object.fromEntries(
      colors.map(([name, value]) => [name, value.light])
    ),
    dark: Object.fromEntries(colors.map(([name, value]) => [name, value.dark])),
    text,
    radius,
    shadow: { ...tokens.shadow },
    palette: loadPalette(),
    source: tokens,
  }
}

function convertColors(value) {
  return value.replace(/(?:oklch|rgb)\([^)]*\)|#[\da-f]{6}\b/gi, (color) =>
    toRgb(color)
  )
}

function toRgba(value) {
  const { channels, alpha } = parseColor(value)
  return { channels, alpha: round(alpha) }
}

const PACKAGE_PREFIX = "packages/mobile/"

function scopedBiome(config) {
  const overrides = (config.overrides ?? [])
    .map((override) => ({
      ...override,
      includes: override.includes
        .filter((glob) => glob.startsWith(PACKAGE_PREFIX))
        .map((glob) => glob.slice(PACKAGE_PREFIX.length)),
    }))
    .filter((override) => override.includes.length > 0)
  return {
    ...config,
    vcs: { enabled: false },
    files: { ...config.files, includes: ["**"] },
    overrides,
  }
}

const DEFAULT_STYLE = "suiss"

const SHADOWS = {
  none: "0 0 #0000",
  xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  sm: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  md: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
}

const FONT_WEIGHTS = { normal: 400, medium: 500, semibold: 600, bold: 700 }

function loadStyles() {
  return JSON.parse(readFileSync(STYLE_TOKENS, "utf8"))
}

function metricVariables(metrics) {
  const variables = []
  const add = (prefix, suffix, values, format) => {
    for (const [name, value] of Object.entries(values)) {
      variables.push([`--${prefix}-${name}${suffix}`, format(value)])
    }
  }
  const pixels = (value) => `${value}px`
  add("radius", "", metrics.radius, pixels)
  add("spacing", "", metrics.height, pixels)
  add("spacing", "-x", metrics["padding-x"], pixels)
  add("spacing", "-y", metrics["padding-y"], pixels)
  add("spacing", "", metrics.padding, pixels)
  add("font-weight", "", metrics["font-weight"], (value) =>
    String(FONT_WEIGHTS[value])
  )
  add("shadow", "", metrics.shadow, (value) => SHADOWS[value])
  return variables
}

export {
  convertColors,
  DEFAULT_STYLE,
  FONT_WEIGHTS,
  loadStyles,
  loadTokens,
  metricVariables,
  SHADOWS,
  scopedBiome,
  toRgb,
  toRgba,
}
