export type Rgb = { r: number; g: number; b: number }
export type Hsv = { h: number; s: number; v: number }
export type Oklch = { l: number; c: number; h: number }
export type ColorFormat = "hex" | "rgb" | "oklch"

const HEX = /^#?([\da-f]{3}|[\da-f]{6})$/i
const RGB =
  /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)\s*(?:[,/]\s*[\d.]+%?\s*)?\)$/i
const OKLCH =
  /^oklch\(\s*([\d.]+)(%?)\s+([\d.]+)\s+([\d.]+)(?:deg)?\s*(?:\/\s*[\d.]+%?\s*)?\)$/i

const clamp = (value: number, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value))

const toLinear = (value: number) =>
  value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4

const toGamma = (value: number) =>
  value <= 0.0031308 ? 12.92 * value : 1.055 * value ** (1 / 2.4) - 0.055

function rgbToOklch({ r, g, b }: Rgb): Oklch {
  const [lr, lg, lb] = [r, g, b].map((channel) => toLinear(channel / 255)) as [
    number,
    number,
    number,
  ]
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb)
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb)
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb)
  const lightness = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s
  const chroma = Math.hypot(a, bb)
  const hue = chroma < 0.0001 ? 0 : (Math.atan2(bb, a) * 180) / Math.PI
  return { l: lightness, c: chroma, h: (hue + 360) % 360 }
}

function oklchToRgb({ l, c, h }: Oklch): Rgb {
  const angle = (h * Math.PI) / 180
  const a = c * Math.cos(angle)
  const b = c * Math.sin(angle)
  const l1 = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m1 = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s1 = (l - 0.0894841775 * a - 1.291485548 * b) ** 3
  const linear = [
    4.0767416621 * l1 - 3.3077115913 * m1 + 0.2309699292 * s1,
    -1.2684380046 * l1 + 2.6097574011 * m1 - 0.3413193965 * s1,
    -0.0041960863 * l1 - 0.7034186147 * m1 + 1.707614701 * s1,
  ]
  const [r, g, bl] = linear.map((value) =>
    Math.round(clamp(toGamma(clamp(value))) * 255)
  ) as [number, number, number]
  return { r, g, b: bl }
}

export function hsvToRgb({ h, s, v }: Hsv): Rgb {
  const f = (n: number) => {
    const k = (n + h / 60) % 6
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1))
  }
  return {
    r: Math.round(f(5) * 255),
    g: Math.round(f(3) * 255),
    b: Math.round(f(1) * 255),
  }
}

export function rgbToHsv({ r, g, b }: Rgb): Hsv {
  const [rr, gg, bb] = [r / 255, g / 255, b / 255]
  const max = Math.max(rr, gg, bb)
  const delta = max - Math.min(rr, gg, bb)
  let h = 0
  if (delta) {
    if (max === rr) h = ((gg - bb) / delta) % 6
    else if (max === gg) h = (bb - rr) / delta + 2
    else h = (rr - gg) / delta + 4
  }
  return { h: (h * 60 + 360) % 360, s: max ? delta / max : 0, v: max }
}

export function parseColor(input: string): Rgb | null {
  const value = input.trim()
  const hex = value.match(HEX)?.[1]
  if (hex) {
    const full =
      hex.length === 3
        ? hex
            .split("")
            .map((char) => char + char)
            .join("")
        : hex
    return {
      r: Number.parseInt(full.slice(0, 2), 16),
      g: Number.parseInt(full.slice(2, 4), 16),
      b: Number.parseInt(full.slice(4, 6), 16),
    }
  }
  const rgb = value.match(RGB)
  if (rgb) {
    const [r, g, b] = rgb.slice(1, 4).map(Number) as [number, number, number]
    if ([r, g, b].some((channel) => channel > 255)) return null
    return { r: Math.round(r), g: Math.round(g), b: Math.round(b) }
  }
  const oklch = value.match(OKLCH)
  if (oklch) {
    const lightness = Number(oklch[1]) / (oklch[2] ? 100 : 1)
    if (lightness > 1) return null
    return oklchToRgb({
      l: lightness,
      c: Number(oklch[3]),
      h: Number(oklch[4]),
    })
  }
  return null
}

export function formatColor(rgb: Rgb, format: ColorFormat) {
  if (format === "hex") {
    return `#${[rgb.r, rgb.g, rgb.b]
      .map((channel) => channel.toString(16).padStart(2, "0"))
      .join("")}`
  }
  if (format === "rgb") return `rgb(${rgb.r} ${rgb.g} ${rgb.b})`
  return oklchString(rgb)
}

export function oklchString(rgb: Rgb) {
  const { l, c, h } = rgbToOklch(rgb)
  return `oklch(${l.toFixed(4)} ${c.toFixed(4)} ${h.toFixed(2)})`
}

const LIGHT_FOREGROUND = "oklch(1 0 0)"
const DARK_FOREGROUND = "oklch(0.2316 0.0038 286.09)"

const luminance = ({ r, g, b }: Rgb) =>
  0.2126 * toLinear(r / 255) +
  0.7152 * toLinear(g / 255) +
  0.0722 * toLinear(b / 255)

function contrast(first: Rgb, second: Rgb) {
  const [high, low] = [luminance(first), luminance(second)].sort(
    (a, b) => b - a
  ) as [number, number]
  return (high + 0.05) / (low + 0.05)
}

export function foregroundFor(rgb: Rgb) {
  const light = oklchToRgb({ l: 1, c: 0, h: 0 })
  const dark = oklchToRgb({ l: 0.2316, c: 0.0038, h: 286.09 })
  return contrast(rgb, light) >= contrast(rgb, dark)
    ? LIGHT_FOREGROUND
    : DARK_FOREGROUND
}
