import { CliError } from "./output.mjs"

export const LIGHT_FOREGROUND = "oklch(1 0 0)"
export const DARK_FOREGROUND = "oklch(0.2316 0.0038 286.09)"

const HEX = /^#([\da-f]{3}|[\da-f]{6})$/i
const RGB = /^rgba?\(\s*([^)]*?)\s*\)$/i
const OKLCH = /^oklch\(\s*([^)]*?)\s*\)$/i
const SEPARATOR = /\s*,\s*|\s+/
const WHITESPACE = /\s+/
const DEGREES = /deg$/i
const DIGIT = /./g
const PAIR = /../g
const ACHROMATIC = 0.0001
const PRIMARY_TOKENS = ["primary", "ring", "sidebar-primary", "sidebar-ring"]
const FOREGROUND_TOKENS = ["primary-foreground", "sidebar-primary-foreground"]

function decimals(value, places) {
  const rounded = Number(value.toFixed(places))
  return Object.is(rounded, -0) ? "0" : String(rounded)
}

function channelValue(part) {
  const value = part.endsWith("%")
    ? (Number(part.slice(0, -1)) / 100) * 255
    : Number(part)
  if (!Number.isFinite(value) || value < 0 || value > 255) return null
  return value
}

function linear(channel) {
  const value = channel / 255
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
}

function encode(channel) {
  const clamped = Math.min(1, Math.max(0, channel))
  const gamma =
    clamped <= 0.0031308
      ? 12.92 * clamped
      : 1.055 * clamped ** (1 / 2.4) - 0.055
  return Math.round(gamma * 255)
}

export function rgbToOklch([red, green, blue]) {
  const r = linear(red)
  const g = linear(green)
  const b = linear(blue)
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  const lightness = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const bValue = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  const chroma = Math.hypot(a, bValue)
  const hue = chroma < ACHROMATIC ? 0 : (Math.atan2(bValue, a) * 180) / Math.PI
  return [lightness, chroma, hue < 0 ? hue + 360 : hue]
}

export function oklchToRgb([lightness, chroma, hue]) {
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

export function formatOklch([lightness, chroma, hue]) {
  const flat = chroma < ACHROMATIC
  return `oklch(${decimals(lightness, 4)} ${decimals(flat ? 0 : chroma, 4)} ${decimals(flat ? 0 : hue % 360, 2)})`
}

function parseHex(value) {
  const match = value.match(HEX)
  if (!match) return null
  const digits =
    match[1].length === 3 ? match[1].replace(DIGIT, "$&$&") : match[1]
  return rgbToOklch(digits.match(PAIR).map((part) => Number.parseInt(part, 16)))
}

function parseRgb(value) {
  const match = value.match(RGB)
  if (!match) return null
  const parts = match[1].split(SEPARATOR).filter(Boolean)
  if (parts.length !== 3) return null
  const channels = parts.map(channelValue)
  if (channels.some((channel) => channel === null)) return null
  return rgbToOklch(channels)
}

function parseOklch(value) {
  const match = value.match(OKLCH)
  if (!match) return null
  const parts = match[1].split(WHITESPACE).filter(Boolean)
  if (parts.length !== 3) return null
  const [lightPart, chromaPart, huePart] = parts
  const lightness = lightPart.endsWith("%")
    ? Number(lightPart.slice(0, -1)) / 100
    : Number(lightPart)
  const chroma = Number(chromaPart)
  const hue = Number(huePart.replace(DEGREES, ""))
  if (
    ![lightness, chroma, hue].every(Number.isFinite) ||
    lightness < 0 ||
    lightness > 1 ||
    chroma < 0
  ) {
    return null
  }
  return [lightness, chroma, ((hue % 360) + 360) % 360]
}

export function parseColor(value) {
  const text = String(value ?? "").trim()
  return parseHex(text) ?? parseRgb(text) ?? parseOklch(text)
}

export function normalizeColor(value) {
  const color = parseColor(value)
  if (!color) {
    throw new CliError(
      `"${value}" is not a color. Use a hex value like #2563eb, rgb(37 99 235) or oklch(0.55 0.2 260).`
    )
  }
  return formatOklch(color)
}

function luminance(color) {
  const [red, green, blue] = oklchToRgb(color).map(linear)
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue
}

function contrast(first, second) {
  const [high, low] = [luminance(first), luminance(second)].sort(
    (a, b) => b - a
  )
  return (high + 0.05) / (low + 0.05)
}

export function foregroundFor(value) {
  const color = parseColor(value)
  if (!color) throw new CliError(`"${value}" is not a color.`)
  return contrast(color, parseColor(LIGHT_FOREGROUND)) >=
    contrast(color, parseColor(DARK_FOREGROUND))
    ? LIGHT_FOREGROUND
    : DARK_FOREGROUND
}

export function primaryColors(value) {
  const primary = normalizeColor(value)
  const foreground = foregroundFor(primary)
  const colors = Object.fromEntries([
    ...PRIMARY_TOKENS.map((name) => [name, primary]),
    ...FOREGROUND_TOKENS.map((name) => [name, foreground]),
    ["chart-1", primary],
  ])
  return { light: colors, dark: colors }
}

export function withPrimary(palette, primary) {
  if (!primary) return palette
  const override = primaryColors(primary)
  return {
    light: { ...(palette?.light ?? {}), ...override.light },
    dark: { ...(palette?.dark ?? {}), ...override.dark },
  }
}
