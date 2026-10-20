import { CliError } from "../output.mjs"

export const DEFAULT_STYLE = "suiss"

const PRESET_STYLES = [
  "nova",
  "vega",
  "maia",
  "lyra",
  "mira",
  "luma",
  "sera",
  "rhea",
]

export const STYLES = [DEFAULT_STYLE, ...PRESET_STYLES]

const BASE_COLORS = [
  "neutral",
  "stone",
  "zinc",
  "gray",
  "mauve",
  "olive",
  "mist",
  "taupe",
]
const THEMES = [
  "neutral",
  "stone",
  "zinc",
  "gray",
  "amber",
  "blue",
  "cyan",
  "emerald",
  "fuchsia",
  "green",
  "indigo",
  "lime",
  "orange",
  "pink",
  "purple",
  "red",
  "rose",
  "sky",
  "teal",
  "violet",
  "yellow",
  "mauve",
  "olive",
  "mist",
  "taupe",
]
const ICON_LIBRARIES = [
  "lucide",
  "hugeicons",
  "tabler",
  "phosphor",
  "remixicon",
]
const FONTS = [
  "inter",
  "noto-sans",
  "nunito-sans",
  "figtree",
  "roboto",
  "raleway",
  "dm-sans",
  "public-sans",
  "outfit",
  "jetbrains-mono",
  "geist",
  "geist-mono",
  "lora",
  "merriweather",
  "playfair-display",
  "noto-serif",
  "roboto-slab",
  "oxanium",
  "manrope",
  "space-grotesk",
  "montserrat",
  "ibm-plex-sans",
  "source-sans-3",
  "instrument-sans",
  "eb-garamond",
  "instrument-serif",
]
const RADII = ["default", "none", "small", "medium", "large"]
const MENU_ACCENTS = ["subtle", "bold"]
const MENU_COLORS = [
  "default",
  "inverted",
  "default-translucent",
  "inverted-translucent",
]

const V1_FIELDS = [
  { key: "menuColor", values: MENU_COLORS, bits: 3 },
  { key: "menuAccent", values: MENU_ACCENTS, bits: 3 },
  { key: "radius", values: RADII, bits: 4 },
  { key: "font", values: FONTS, bits: 6 },
  { key: "iconLibrary", values: ICON_LIBRARIES, bits: 6 },
  { key: "theme", values: THEMES, bits: 6 },
  { key: "baseColor", values: BASE_COLORS, bits: 6 },
  { key: "style", values: PRESET_STYLES, bits: 6 },
]
const FIELDS = [
  ...V1_FIELDS,
  { key: "chartColor", values: THEMES, bits: 6 },
  { key: "fontHeading", values: ["inherit", ...FONTS], bits: 5 },
]
export const PRESET_VALUES = Object.fromEntries(
  FIELDS.map((field) => [field.key, field.values])
)
const ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
const VERSIONS = ["a", "b"]

function fromBase62(text) {
  let value = 0
  for (const character of text) {
    const digit = ALPHABET.indexOf(character)
    if (digit === -1) return -1
    value = value * 62 + digit
  }
  return value
}

export function decodePreset(code) {
  if (typeof code !== "string" || code.length < 2) return null
  const version = code[0]
  if (!VERSIONS.includes(version)) return null
  const fields = version === "a" ? V1_FIELDS : FIELDS
  const value = fromBase62(code.slice(1))
  if (value < 0) return null
  const preset = {}
  let offset = 0
  for (const field of fields) {
    const index = Math.floor(value / 2 ** offset) % 2 ** field.bits
    preset[field.key] =
      index < field.values.length ? field.values[index] : field.values[0]
    offset += field.bits
  }
  if (version === "a") preset.fontHeading = "inherit"
  return preset
}

const UNAVAILABLE_COLORS = ["gray"]
const OWN_THEME = "suiss"

export function presetProblem(preset) {
  for (const key of ["baseColor", "theme"]) {
    if (UNAVAILABLE_COLORS.includes(preset[key])) {
      return `The ${preset[key]} ${key === "theme" ? "theme" : "base color"} is not available in suiss/ui. Pick ${BASE_COLORS.filter((name) => !UNAVAILABLE_COLORS.includes(name)).join(", ")} or a colored theme on suiss.app/ui/create.`
    }
  }
  const { theme, baseColor } = preset
  if (theme && BASE_COLORS.includes(theme) && theme !== baseColor) {
    return `The ${theme} theme needs the ${theme} base color, the preset uses ${baseColor}. Pick a colored theme or the base color itself.`
  }
  return null
}

export function paletteOf(themes, preset, { theme } = {}) {
  const own = theme === OWN_THEME
  const find = (name) => themes.find((entry) => entry.name === name)
  const base = own ? undefined : find(preset.baseColor)
  const accent =
    own && BASE_COLORS.includes(preset.theme) ? undefined : find(preset.theme)
  const { radius: _light, ...light } = { ...base?.light, ...accent?.light }
  const { radius: _dark, ...dark } = { ...base?.dark, ...accent?.dark }
  return { light, dark }
}

export function resolveStyle({ style, preset, only }) {
  if (style !== undefined && !STYLES.includes(style)) {
    throw new CliError(
      `Unknown style ${style}. Pick one of ${STYLES.join(", ")}.`
    )
  }
  if (preset === undefined) return style ?? DEFAULT_STYLE
  if (only && style === undefined) return undefined
  const decoded = decodePreset(preset)
  if (!decoded) throw new CliError(`${preset} is not a valid preset code.`)
  if (style === DEFAULT_STYLE) return DEFAULT_STYLE
  if (style !== undefined && style !== decoded.style) {
    throw new CliError(
      `The preset uses the ${decoded.style} style, but --style is ${style}. Pass one of them.`
    )
  }
  return decoded.style
}
