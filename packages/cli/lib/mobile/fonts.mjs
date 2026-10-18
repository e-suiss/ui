import { existsSync } from "node:fs"
import path from "node:path"
import { decodePreset } from "../shared/style.mjs"

const WHITESPACE = /\s+/g
const TTF_EXTENSION = /\.ttf$/
const SWIFT_SANS = /(public static let sans: String\? = ).*/
const SWIFT_HEADING = /(public static let heading: String\? = ).*/
const SWIFT_FILES = /(public static let files: \[String\] = ).*/
const KOTLIN_SANS = /(val sans: List<FontFile> = ).*/
const KOTLIN_HEADING = /(val heading: List<FontFile> = ).*/
const DEFAULT_FONT = "inter"
const INHERIT = "inherit"
const CDN = "https://cdn.jsdelivr.net/npm/@expo-google-fonts"
const PACKAGE_RANGE = "0.4"
const FACES = [
  { weight: 400, name: "400Regular" },
  { weight: 500, name: "500Medium" },
  { weight: 600, name: "600SemiBold" },
  { weight: 700, name: "700Bold" },
]
const FAMILIES = {
  inter: "Inter",
  "noto-sans": "Noto Sans",
  "nunito-sans": "Nunito Sans",
  figtree: "Figtree",
  roboto: "Roboto",
  raleway: "Raleway",
  "dm-sans": "DM Sans",
  "public-sans": "Public Sans",
  outfit: "Outfit",
  "jetbrains-mono": "JetBrains Mono",
  geist: "Geist",
  "geist-mono": "Geist Mono",
  lora: "Lora",
  merriweather: "Merriweather",
  "playfair-display": "Playfair Display",
  "noto-serif": "Noto Serif",
  "roboto-slab": "Roboto Slab",
  oxanium: "Oxanium",
  manrope: "Manrope",
  "space-grotesk": "Space Grotesk",
  montserrat: "Montserrat",
  "ibm-plex-sans": "IBM Plex Sans",
  "source-sans-3": "Source Sans 3",
  "instrument-sans": "Instrument Sans",
  "eb-garamond": "EB Garamond",
  "instrument-serif": "Instrument Serif",
}

function fontOf(id) {
  const family = FAMILIES[id]
  if (!family) return null
  const prefix = family.replace(WHITESPACE, "")
  return {
    id,
    family,
    package: `@expo-google-fonts/${id}`,
    faces: FACES.map((face) => ({
      ...face,
      file: `${prefix}_${face.name}.ttf`,
      url: `${CDN}/${id}@${PACKAGE_RANGE}/${face.name}/${prefix}_${face.name}.ttf`,
    })),
  }
}

export function presetFonts(options) {
  if (!options.preset) return null
  const preset = decodePreset(options.preset)
  if (!preset) return null
  const sans = preset.font === DEFAULT_FONT ? null : fontOf(preset.font)
  const heading =
    !preset.fontHeading ||
    preset.fontHeading === INHERIT ||
    preset.fontHeading === preset.font
      ? null
      : fontOf(preset.fontHeading)
  return sans || heading ? { sans, heading } : null
}

export function fontList(fonts) {
  return [fonts.sans, fonts.heading].filter(Boolean)
}

function installedFaces(cwd, font) {
  const root = path.join(cwd, "node_modules", font.package)
  return font.faces
    .map((face) => ({ ...face, path: path.join(root, face.name, face.file) }))
    .filter((face) => existsSync(face.path))
}

export function expoFontPlugin(cwd, fonts) {
  const relative = (file) =>
    `./${path.relative(cwd, file).split(path.sep).join("/")}`
  const families = fontList(fonts).map((font) => ({
    font,
    faces: installedFaces(cwd, font),
  }))
  return [
    "expo-font",
    {
      ios: {
        fonts: families.flatMap(({ faces }) =>
          faces.map((face) => relative(face.path))
        ),
      },
      android: {
        fonts: families.map(({ font, faces }) => ({
          fontFamily: font.family,
          fontDefinitions: faces.map((face) => ({
            path: relative(face.path),
            weight: face.weight,
          })),
        })),
      },
    },
  ]
}

export function fontModule(fonts) {
  const entries = [
    fonts.sans && `sans: "${fonts.sans.family}"`,
    fonts.heading && `heading: "${fonts.heading.family}"`,
  ].filter(Boolean)
  return `type Fonts = { sans?: string; heading?: string }

const fonts: Fonts = { ${entries.join(", ")} }

function fontFamily(heading = false) {
  const family = heading ? (fonts.heading ?? fonts.sans) : fonts.sans
  return family ? { fontFamily: family } : undefined
}

export { fontFamily, fonts }
`
}

export function assetName(face) {
  return face.file.toLowerCase()
}

export function applyFonts(text, platform, fonts, faces) {
  if (platform === "swift") {
    const name = (font) => (font ? `"${font.family}"` : "nil")
    const files = faces.map(
      (face) => `"${face.file.replace(TTF_EXTENSION, "")}"`
    )
    return text
      .replace(SWIFT_SANS, `$1${name(fonts.sans)}`)
      .replace(SWIFT_HEADING, `$1${name(fonts.heading)}`)
      .replace(SWIFT_FILES, `$1[${files.join(", ")}]`)
  }
  const list = (font) => {
    const own = faces.filter((face) => face.font === font)
    if (!own.length) return "emptyList()"
    return `listOf(${own
      .map((face) => `FontFile("fonts/${assetName(face)}", ${face.weight})`)
      .join(", ")})`
  }
  return text
    .replace(KOTLIN_SANS, `$1${list(fonts.sans)}`)
    .replace(KOTLIN_HEADING, `$1${list(fonts.heading)}`)
}

export function keepFonts(text, current, platform) {
  const patterns =
    platform === "swift"
      ? [SWIFT_SANS, SWIFT_HEADING, SWIFT_FILES]
      : [KOTLIN_SANS, KOTLIN_HEADING]
  return patterns.reduce((next, pattern) => {
    const kept = current.match(pattern)?.[0]
    return kept === undefined ? next : next.replace(pattern, () => kept)
  }, text)
}

export async function downloadFaces(fonts) {
  const faces = []
  for (const font of fontList(fonts)) {
    for (const face of font.faces) {
      const response = await fetch(face.url)
      if (!response.ok) continue
      faces.push({
        ...face,
        font,
        bytes: new Uint8Array(await response.arrayBuffer()),
      })
    }
  }
  return faces
}
