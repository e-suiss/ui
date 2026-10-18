import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmdirSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import path from "node:path"
import { CliError, step } from "../output.mjs"
import { targetFor } from "../shared/files.mjs"
import { assertPackageSpecs } from "../shared/project.mjs"
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
const RN_ICONS_SOURCE = /from\s+"@\/components\/ui\/icons"/g
const SWIFT_ICON = /\bEsuissIcon\./g
const SWIFT_IMPORT = /^import (\w+)\n/gm
const KOTLIN_ICONS_OBJECT = /\bimport com\.esuiss\.ui\.icons\.EsuissIcons\b/g
const KOTLIN_ICONS_IMPORT = /\bimport com\.esuiss\.ui\.icons\./g
const KOTLIN_ICONS = /\bEsuissIcons\./g
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

function restoreSwiftImport(content) {
  if (!content.includes("EsuissIcon.")) return content
  const next = content.replace(SWIFT_ICON, "Ph.")
  const after = [...next.matchAll(SWIFT_IMPORT)].find(
    (match) => match[1] > "PhosphorSwift"
  )
  const at = after ? after.index : 0
  return `${next.slice(0, at)}import PhosphorSwift\n${next.slice(at)}`
}

export function restoreIcons(platform, content) {
  if (platform === "rn") {
    return content.replace(RN_ICONS_SOURCE, `from "${PHOSPHOR_RN}"`)
  }
  if (platform === "swift") return restoreSwiftImport(content)
  return content
    .replace(KOTLIN_ICONS_OBJECT, "import com.adamglin.PhosphorIcons")
    .replace(KOTLIN_ICONS_IMPORT, "import com.adamglin.phosphoricons.")
    .replace(KOTLIN_ICONS, "PhosphorIcons.")
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

function iconFiles({ platform, root, registry, library, fetchText }) {
  const entries = iconEntries(platform, registry, library).map(
    ({ file, source }) => ({ target: targetFor(root, file, platform), source })
  )
  return Promise.all(
    entries.map(async ({ target, source }) => ({
      target,
      content: await fetchText(source),
    }))
  )
}

export async function withIcons(
  { platform, root, registry, library, fetchText, always = false },
  files
) {
  if (!usesCustomIcons(library)) return files
  const needsIcons =
    always || files.some((file) => usesIcons(platform, file.content))
  const transformed = files.map((file) => ({
    ...file,
    content: transformIcons(platform, file.content, library),
  }))
  if (!needsIcons) return transformed
  return [
    ...transformed,
    ...(await iconFiles({ platform, root, registry, library, fetchText })),
  ]
}

const SOURCE_FILES = {
  rn: { directory: "components", extensions: [".ts", ".tsx"] },
  swift: { directory: "", extensions: [".swift"] },
  kotlin: { directory: "", extensions: [".kt"] },
}

function sourceFiles(platform, root, skip) {
  const { directory, extensions } = SOURCE_FILES[platform]
  const found = []
  const walk = (dir) => {
    if (!existsSync(dir)) return
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name)
      if (skip.has(file)) continue
      if (entry.isDirectory()) walk(file)
      else if (entry.isFile() && extensions.includes(path.extname(file))) {
        found.push(file)
      }
    }
  }
  walk(path.join(root, directory))
  return found
}

function iconTargets(platform, root, registry, library) {
  if (!usesCustomIcons(library)) return []
  return iconEntries(platform, registry, library).map(({ file }) =>
    targetFor(root, file, platform)
  )
}

function iconDirectories(platform, root) {
  if (platform === "rn") return []
  return [path.join(root, platform === "swift" ? "Icons" : "icons")]
}

function removeEmptyDirectories(directory, root) {
  for (
    let current = directory;
    current.startsWith(`${root}${path.sep}`);
    current = path.dirname(current)
  ) {
    if (!existsSync(current) || readdirSync(current).length) return
    rmdirSync(current)
  }
}

export async function switchIcons({
  platform,
  root,
  registry,
  library,
  fetchText,
}) {
  const current = detectIconLibrary(platform, root) ?? DEFAULT_ICON_LIBRARY
  if (current === library) return null
  const dependencies =
    platform === "rn" ? iconDependencies(registry, [PHOSPHOR_RN], library) : []
  assertPackageSpecs(dependencies)
  const previous = iconTargets(platform, root, registry, current).filter(
    (target) => existsSync(target)
  )
  const custom = usesCustomIcons(library)
  const kept = new Set(iconTargets(platform, root, registry, library))
  const skip = new Set([
    ...previous,
    ...kept,
    ...iconDirectories(platform, root),
  ])
  const rewrites = sourceFiles(platform, root, skip)
    .map((file) => {
      const content = readFileSync(file, "utf8")
      const next = custom
        ? transformIcons(platform, content, library)
        : restoreIcons(platform, content)
      return { file, content: next, changed: next !== content }
    })
    .filter((rewrite) => rewrite.changed)
  if (!rewrites.length && !previous.length) return null

  const fresh = custom
    ? await iconFiles({ platform, root, registry, library, fetchText })
    : []
  for (const { file, content } of rewrites) writeFileSync(file, content)
  for (const target of previous) {
    if (kept.has(target)) continue
    rmSync(target, { force: true })
    removeEmptyDirectories(path.dirname(target), root)
  }
  for (const { target, content } of fresh) {
    mkdirSync(path.dirname(target), { recursive: true })
    writeFileSync(target, content)
  }
  step(
    `Switched the icons from ${current} to ${library}${rewrites.length ? ` in ${rewrites.length} file${rewrites.length === 1 ? "" : "s"}` : ""}`
  )
  if (platform !== "rn") return { from: current, dependencies, unused: [] }
  return {
    from: current,
    dependencies,
    unused: iconDependencies(registry, [PHOSPHOR_RN], current).filter(
      (dependency) =>
        dependency !== "react-native-svg" && !dependencies.includes(dependency)
    ),
  }
}

export function assertIconDependencies(registry, library) {
  if (library) {
    assertPackageSpecs(iconDependencies(registry, [PHOSPHOR_RN], library))
  }
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
