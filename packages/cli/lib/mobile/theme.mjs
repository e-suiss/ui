import { withPrimary } from "../color.mjs"
import { decodePreset } from "../shared/style.mjs"

const HEX_COLOR = /^#([\da-f]{3}|[\da-f]{6})$/i
const OKLCH_COLOR =
  /^oklch\(\s*([\d.]+%?)\s+([\d.]+)\s+([\d.]+)\s*(?:\/\s*([\d.]+%?))?\s*\)$/
const DEFAULT_RADIUS = 0.625
const RADIUS_REMS = { none: 0, small: 0.45, medium: 0.625, large: 0.875 }
const PILL = 9999
const OWN_THEME = "suiss"

function fraction(value) {
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

function round(value) {
  return Math.round(value * 1000) / 1000
}

function parseColor(value) {
  const hex = value.match(HEX_COLOR)
  if (hex) {
    const digits = hex[1].length === 3 ? hex[1].replace(/./g, "$&$&") : hex[1]
    return {
      channels: digits.match(/../g).map((part) => Number.parseInt(part, 16)),
      alpha: 1,
    }
  }
  const oklch = value.match(OKLCH_COLOR)
  if (!oklch) throw new Error(`Unsupported color value "${value}"`)
  return {
    channels: oklchToRgb(
      fraction(oklch[1]),
      Number(oklch[2]),
      Number(oklch[3])
    ),
    alpha: round(fraction(oklch[4])),
  }
}

function hexOf(channels) {
  return channels
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")
}

function cssColor(value) {
  const { channels, alpha } = parseColor(value)
  return alpha === 1
    ? `#${hexOf(channels)}`
    : `rgba(${channels.join(", ")}, ${alpha})`
}

function swiftColor(value) {
  const { channels, alpha } = parseColor(value)
  const code = hexOf(channels).toUpperCase()
  return alpha === 1 ? `.init(0x${code})` : `.init(0x${code}, ${alpha})`
}

function kotlinColor(value) {
  const { channels, alpha } = parseColor(value)
  const color = `Color(0xFF${hexOf(channels).toUpperCase()})`
  return alpha === 1 ? color : `${color}.copy(alpha = ${alpha}f)`
}

function camelCase(name) {
  return name.replace(/-(\w)/g, (_match, letter) => letter.toUpperCase())
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

export function paletteOf(themes, preset) {
  const find = (name) => themes.find((theme) => theme.name === name)
  const base = find(preset.baseColor)
  const accent = find(preset.theme)
  const { radius: _light, ...light } = { ...base?.light, ...accent?.light }
  const { radius: _dark, ...dark } = { ...base?.dark, ...accent?.dark }
  return { light, dark }
}

export function radiusFactor(radius) {
  if (!(radius in RADIUS_REMS)) return 1
  return RADIUS_REMS[radius] / DEFAULT_RADIUS
}

function scale(value, factor) {
  if (value >= PILL) return value
  return Math.round(value * factor * 100) / 100
}

function replaceInBlock(text, start, end, replace) {
  const from = text.indexOf(start)
  if (from === -1) return text
  const to = text.indexOf(end, from + start.length)
  if (to === -1) return text
  const head = text.slice(0, from + start.length)
  const body = text.slice(from + start.length, to)
  return `${head}${replace(body)}${text.slice(to)}`
}

function replaceEntries(body, colors, pattern, format) {
  return Object.entries(colors).reduce(
    (current, [name, value]) =>
      current.replace(
        pattern(name),
        (_match, head, tail = "") => `${head}${format(value)}${tail}`
      ),
    body
  )
}

function cssVariable(prefix) {
  return (name) => new RegExp(`(--${prefix}${escapeRegExp(name)}:\\s*)[^;]+(;)`)
}

function objectEntry(name) {
  return new RegExp(`(\\n\\s*${escapeRegExp(camelCase(name))}: ")[^"]*(",)`)
}

function kotlinEntry(name) {
  return new RegExp(
    `(\\n\\s*${escapeRegExp(camelCase(name))} = )Color\\([^)]*\\)(?:\\.copy\\(alpha = [^)]*\\))?(,)`
  )
}

function scaleNumbers(body, pattern, factor) {
  return body.replace(
    pattern,
    (_match, head, value, tail) =>
      `${head}${scale(Number(value), factor)}${tail}`
  )
}

const WRITERS = {
  uniwind(text, { palette, factor }) {
    let next = text
    if (palette) {
      for (const mode of ["light", "dark"]) {
        next = replaceInBlock(next, `@variant ${mode} {`, "}", (body) =>
          replaceEntries(body, palette[mode], cssVariable("color-"), String)
        )
      }
    }
    if (factor !== 1) {
      next = next.replace(
        /(--radius-[\w-]+:\s*)([\d.]+)(rem|px)(;)/g,
        (_match, head, value, unit, tail) => {
          const pixels = unit === "rem" ? Number(value) * 16 : Number(value)
          if (pixels >= PILL) return `${head}${value}${unit}${tail}`
          const scaled = scale(Number(value), factor)
          return `${head}${scaled}${unit}${tail}`
        }
      )
    }
    return next
  },
  "nativewind-css"(text, { palette }) {
    if (!palette) return text
    let next = replaceInBlock(text, ":root {", "\n  }", (body) =>
      replaceEntries(body, palette.light, cssVariable(""), cssColor)
    )
    next = replaceInBlock(next, ".dark:root {", "\n  }", (body) =>
      replaceEntries(body, palette.dark, cssVariable(""), cssColor)
    )
    return next
  },
  "nativewind-config"(text, { factor }) {
    if (factor === 1) return text
    return replaceInBlock(text, "borderRadius: {", "}", (body) =>
      scaleNumbers(body, /(:\s*")([\d.]+)(px")/g, factor)
    )
  },
  stylesheet(text, { palette, factor }) {
    let next = text
    if (palette) {
      next = replaceInBlock(next, "const light = {", "\n}", (body) =>
        replaceEntries(body, palette.light, objectEntry, cssColor)
      )
      next = replaceInBlock(
        next,
        "const dark: ThemeColors = {",
        "\n}",
        (body) => replaceEntries(body, palette.dark, objectEntry, cssColor)
      )
    }
    if (factor !== 1) {
      next = replaceInBlock(next, "const radius = {", "\n}", (body) =>
        scaleNumbers(body, /(:\s*)([\d.]+)(,)/g, factor)
      )
      next = replaceInBlock(next, "  radius: {", "\n  },", (body) =>
        scaleNumbers(body, /(:\s*)([\d.]+)(,)/g, factor)
      )
    }
    return next
  },
  swift(text, { palette, factor }) {
    let next = text
    if (palette) {
      for (const name of Object.keys(palette.light)) {
        const dark = palette.dark[name] ?? palette.light[name]
        next = next.replace(
          new RegExp(
            `(public static let ${escapeRegExp(camelCase(name))} = Color\\.adaptive\\(light: )[^\\n]*`
          ),
          (_match, head) =>
            `${head}${swiftColor(palette.light[name])}, dark: ${swiftColor(dark)})`
        )
      }
    }
    if (factor !== 1) {
      const radius = (body) =>
        scaleNumbers(body, /(: CGFloat = )([\d.]+)(\n)/g, factor)
      next = replaceInBlock(next, "public enum Radius {", "\n}", radius)
      next = replaceInBlock(next, "  public enum Radius {", "\n  }", radius)
    }
    return next
  },
  kotlin(text, { palette, factor }) {
    let next = text
    if (palette) {
      next = replaceInBlock(next, "val LightColors = Colors(", "\n)", (body) =>
        replaceEntries(body, palette.light, kotlinEntry, kotlinColor)
      )
      next = replaceInBlock(next, "val DarkColors = Colors(", "\n)", (body) =>
        replaceEntries(body, palette.dark, kotlinEntry, kotlinColor)
      )
    }
    if (factor !== 1) {
      const radius = (body) =>
        scaleNumbers(body, /( = )([\d.]+)(\.dp)/g, factor)
      next = replaceInBlock(next, "\nobject Radius {", "\n}", radius)
      next = replaceInBlock(next, "    object Radius {", "\n    }", radius)
    }
    return next
  },
}

export function applyThemeOptions(text, format, options) {
  const writer = WRITERS[format]
  if (!writer) throw new Error(`Unknown theme format ${format}`)
  return writer(text, { palette: null, factor: 1, ...options })
}

const MODES = ["light", "dark"]
const TRANSLUCENT_ALPHA = 0.7
const MENU_SOURCES = {
  menu: "popover",
  "menu-foreground": "foreground",
  "menu-muted-foreground": "muted-foreground",
  "menu-border": "border",
}

function withAlpha(value, factor) {
  const oklch = value.match(OKLCH_COLOR)
  if (!oklch) return value
  const alpha = round(fraction(oklch[4]) * factor)
  return `oklch(${oklch[1]} ${oklch[2]} ${oklch[3]} / ${round(alpha * 100)}%)`
}

export function menuColorsOf(
  colors,
  { menuColor = "default", menuAccent = "subtle" }
) {
  const inverted = menuColor.startsWith("inverted")
  const translucent = menuColor.endsWith("translucent")
  const bold = menuAccent === "bold"
  return Object.fromEntries(
    MODES.map((mode) => {
      const source =
        colors[inverted ? MODES.find((other) => other !== mode) : mode]
      const menu = Object.fromEntries(
        Object.entries(MENU_SOURCES).map(([name, from]) => [name, source[from]])
      )
      menu["menu-accent"] = source[bold ? "primary" : "accent"]
      menu["menu-accent-foreground"] =
        source[bold ? "primary-foreground" : "accent-foreground"]
      if (translucent) menu.menu = withAlpha(menu.menu, TRANSLUCENT_ALPHA)
      return [mode, menu]
    })
  )
}

function isDefaultMenu(preset) {
  return preset.menuColor === "default" && preset.menuAccent === "subtle"
}

export async function themeOptionsFor(options, fetchThemes, ownColors) {
  const preset = options.preset ? decodePreset(options.preset) : null
  if (!preset && !options.primary) return null
  const presetPalette =
    preset && options.theme !== OWN_THEME
      ? paletteOf(await fetchThemes(), preset)
      : null
  let palette = withPrimary(presetPalette, options.primary)
  if (preset && (presetPalette || (ownColors && !isDefaultMenu(preset)))) {
    const colors = withPrimary(presetPalette ?? ownColors, options.primary)
    const menu = menuColorsOf(colors, preset)
    palette = Object.fromEntries(
      MODES.map((mode) => [mode, { ...(palette?.[mode] ?? {}), ...menu[mode] }])
    )
  }
  return {
    palette,
    factor: preset ? radiusFactor(preset.radius) : 1,
    preset,
  }
}

export function themed(text, format, themeOptions) {
  return themeOptions ? applyThemeOptions(text, format, themeOptions) : text
}
