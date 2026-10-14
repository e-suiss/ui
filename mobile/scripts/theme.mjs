import { readFileSync } from "node:fs"
import path from "node:path"

const TOKENS = path.join(process.cwd(), "packages/tokens/tokens.json")
const ROOT_FONT_SIZE = 16

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
  const hex = value.match(/^#([\da-f]{6})$/i)
  if (hex) {
    const channels = hex[1]
      .match(/../g)
      .map((part) => Number.parseInt(part, 16))
    return { channels, alpha: 1 }
  }
  const rgb = value.match(
    /^rgb\(\s*(\d+)\s+(\d+)\s+(\d+)\s*(?:\/\s*([\d.]+%?))?\s*\)$/
  )
  if (rgb) {
    return { channels: rgb.slice(1, 4).map(Number), alpha: parseAlpha(rgb[4]) }
  }
  const oklch = value.match(
    /^oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+%?))?\s*\)$/
  )
  if (oklch) {
    return {
      channels: oklchToRgb(
        Number(oklch[1]),
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

function loadTokens() {
  const tokens = JSON.parse(readFileSync(TOKENS, "utf8"))
  const colors = Object.entries(tokens.color)
  const text = Object.fromEntries(
    Object.entries(tokens.text).map(([name, size]) => {
      const fontSize = toPixels(size.fontSize)
      const tracking = Number.parseFloat(size.letterSpacing)
      return [
        name,
        {
          fontSize,
          lineHeight: toPixels(size.lineHeight),
          letterSpacing: round(tracking * fontSize),
          tracking,
        },
      ]
    })
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

export { convertColors, loadTokens, toRgb, toRgba }
