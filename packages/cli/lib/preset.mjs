const STYLES = ["nova", "vega", "maia", "lyra", "mira", "luma", "sera", "rhea"]
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

const FIELDS = [
  { key: "menuColor", values: MENU_COLORS, bits: 3 },
  { key: "menuAccent", values: MENU_ACCENTS, bits: 3 },
  { key: "radius", values: RADII, bits: 4 },
  { key: "font", values: FONTS, bits: 6 },
  { key: "iconLibrary", values: ICON_LIBRARIES, bits: 6 },
  { key: "theme", values: THEMES, bits: 6 },
  { key: "baseColor", values: BASE_COLORS, bits: 6 },
  { key: "style", values: STYLES, bits: 6 },
]
const ALPHABET =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
const VERSIONS = ["a", "b"]
const MAX_LENGTH = 10

export const RADIUS_VALUES = {
  none: "0",
  small: "0.45rem",
  medium: "0.625rem",
  large: "0.875rem",
}

export function decodePreset(code) {
  if (typeof code !== "string" || code.length < 2) return null
  if (code.length > MAX_LENGTH || !VERSIONS.includes(code[0])) return null
  let value = 0
  for (const char of code.slice(1)) {
    const digit = ALPHABET.indexOf(char)
    if (digit === -1) return null
    value = value * 62 + digit
  }
  const preset = {}
  let shift = 0
  for (const field of FIELDS) {
    const index = Math.floor(value / 2 ** shift) % 2 ** field.bits
    preset[field.key] = field.values[index] ?? field.values[0]
    shift += field.bits
  }
  return preset
}
