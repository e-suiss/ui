import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import { CliError } from "../output.mjs"
import { targetFor } from "../shared/files.mjs"
import { decodePreset } from "../shared/style.mjs"

const DEFAULT_ICON_LIBRARY = "phosphor"
const ICON_LIBRARY_NAMES = [
  "phosphor",
  "lucide",
  "tabler",
  "hugeicons",
  "remixicon",
]

const PHOSPHOR_RN = "phosphor-react-native"
const PHOSPHOR_RN_IMPORT = /from\s+"phosphor-react-native"/g
const PHOSPHOR_SWIFT_IMPORT = /^import PhosphorSwift\n/gm
const PHOSPHOR_SWIFT = /\bPh\./g
const PHOSPHOR_KOTLIN_OBJECT = /\bimport com\.adamglin\.PhosphorIcons\b/g
const PHOSPHOR_KOTLIN_IMPORT = /\bimport com\.adamglin\.phosphoricons\./g
const PHOSPHOR_KOTLIN = /\bPhosphorIcons\./g
const SWIFT_LIBRARY = /static let library = "([a-z]+)"/
const KOTLIN_LIBRARY = /const val LIBRARY = "([a-z]+)"/

const RN_ICONS_FILE = "components/ui/icons.tsx"
const RN_ICONS_IMPORT = '"@/components/ui/icons"'
const SWIFT_ICONS_FILE = path.join("Icons", "EsuissIcons.swift")
const KOTLIN_ICONS_FILE = path.join("icons", "EsuissIcons.kt")

const RN_MARKERS = {
  lucide: "lucide-react-native",
  tabler: "@tabler/icons-react-native",
  hugeicons: "@hugeicons/react-native",
  remixicon: "RemixAdapter",
}

export function checkIconLibrary(library, flag = "--icon-library") {
  if (!ICON_LIBRARY_NAMES.includes(library)) {
    throw new CliError(
      `${flag} needs ${ICON_LIBRARY_NAMES.slice(0, -1).join(", ")} or ${ICON_LIBRARY_NAMES.at(-1)}.`
    )
  }
  return library
}

export function resolveIconLibrary({ iconLibrary, preset }) {
  if (iconLibrary) return iconLibrary
  if (!preset) return undefined
  const decoded = decodePreset(preset)?.iconLibrary
  return decoded ? checkIconLibrary(decoded, "--preset") : undefined
}

function readText(file) {
  return existsSync(file) ? readFileSync(file, "utf8") : ""
}

export function detectIconLibrary(platform, root) {
  if (platform === "rn") {
    const text = readText(path.join(root, RN_ICONS_FILE))
    return (
      Object.entries(RN_MARKERS).find(([, marker]) =>
        text.includes(marker)
      )?.[0] ?? null
    )
  }
  if (platform === "swift") {
    return (
      readText(path.join(root, SWIFT_ICONS_FILE)).match(SWIFT_LIBRARY)?.[1] ??
      null
    )
  }
  return (
    readText(path.join(root, KOTLIN_ICONS_FILE)).match(KOTLIN_LIBRARY)?.[1] ??
    null
  )
}

export function iconLibraryFor(platform, root, options) {
  return (
    options.iconLibrary ??
    detectIconLibrary(platform, root) ??
    DEFAULT_ICON_LIBRARY
  )
}

export function usesCustomIcons(library) {
  return library !== DEFAULT_ICON_LIBRARY
}

export function transformIcons(platform, content, library) {
  if (!usesCustomIcons(library)) return content
  if (platform === "rn") {
    return content.replace(PHOSPHOR_RN_IMPORT, `from ${RN_ICONS_IMPORT}`)
  }
  if (platform === "swift") {
    return content
      .replace(PHOSPHOR_SWIFT_IMPORT, "")
      .replace(PHOSPHOR_SWIFT, "EsuissIcon.")
  }
  return content
    .replace(PHOSPHOR_KOTLIN_OBJECT, "import com.esuiss.ui.icons.EsuissIcons")
    .replace(PHOSPHOR_KOTLIN_IMPORT, "import com.esuiss.ui.icons.")
    .replace(PHOSPHOR_KOTLIN, "EsuissIcons.")
}

function usesIcons(platform, content) {
  if (platform === "rn") return content.includes(`"${PHOSPHOR_RN}"`)
  if (platform === "swift") return content.includes("import PhosphorSwift")
  return content.includes("com.adamglin")
}

function iconEntries(platform, registry, library) {
  const icons = registryIcons(registry, library)
  if (platform === "rn") return [{ file: RN_ICONS_FILE, source: icons.rn }]
  const prefix = `icons/${platform}/${library}/`
  return icons[platform].map((source) => {
    if (typeof source !== "string" || !source.startsWith(prefix)) {
      throw new CliError(
        `The registry lists ${source} as a ${library} icon file outside ${prefix}.`
      )
    }
    return { file: source.slice(prefix.length), source }
  })
}

export async function withIcons(
  { platform, root, registry, library, fetchText },
  files
) {
  if (!usesCustomIcons(library)) return files
  const needsIcons = files.some((file) => usesIcons(platform, file.content))
  const transformed = files.map((file) => ({
    ...file,
    content: transformIcons(platform, file.content, library),
  }))
  if (!needsIcons) return transformed
  const entries = iconEntries(platform, registry, library).map(
    ({ file, source }) => ({ target: targetFor(root, file, platform), source })
  )
  const extra = await Promise.all(
    entries.map(async ({ target, source }) => ({
      target,
      content: await fetchText(source),
    }))
  )
  return [...transformed, ...extra]
}

export function iconDependencies(registry, dependencies, library) {
  if (!usesCustomIcons(library) || !dependencies.includes(PHOSPHOR_RN)) {
    return dependencies
  }
  return [
    ...new Set([
      ...dependencies.filter((dependency) => dependency !== PHOSPHOR_RN),
      ...registryIcons(registry, library).dependencies,
    ]),
  ]
}

function registryIcons(registry, library) {
  const icons = registry.icons?.[library]
  if (!icons) {
    throw new CliError(
      `This version of the registry has no ${library} icons. Update @esuiss/ui or leave out --icon-library.`
    )
  }
  return icons
}

export function isPhosphorRequirement(entry) {
  const text = typeof entry === "string" ? entry : entry.url
  return text.includes("phosphor")
}
