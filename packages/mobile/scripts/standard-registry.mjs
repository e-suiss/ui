import { existsSync } from "node:fs"
import { readFile } from "node:fs/promises"
import { createRequire } from "node:module"
import path from "node:path"
import { runInNewContext } from "node:vm"
import Ajv from "ajv"
import postcss from "postcss"
import {
  collectImports,
  frontmatterValue,
  packageName,
  SCHEMA_URL,
  schemaProblems,
  toCssObject,
  toTitle,
} from "../../../scripts/lib/registry.mjs"

const SITE = "https://suiss.app/ui"
const NAMESPACE = "@esuiss"
const DOCS = path.resolve(import.meta.dirname, "../../../apps/ui/content/docs")
const THEME = "theme-suiss"
export const UNIWIND_THEME = "registry/uniwind/theme-suiss.css"
export const PRESETS = "styles/presets"

export function uniwindThemeFile(style) {
  return `registry/uniwind/theme-${style}.css`
}

export function presetFiles(style) {
  const directory = path.posix.join(PRESETS, style)
  return {
    uniwind: path.posix.join(directory, "uniwind.css"),
    nativewind: path.posix.join(directory, "nativewind.config.js"),
    stylesheet: path.posix.join(directory, "theme.ts"),
    swift: path.posix.join(directory, "Tokens.swift"),
    kotlin: path.posix.join(directory, "Tokens.kt"),
  }
}
const THEME_IMPORT = "@/components/ui/theme"
const IGNORED_PACKAGES = new Set(["react", "react-native"])
const COMPANIONS = {
  "phosphor-react-native": ["react-native-svg"],
  "react-native-reanimated": ["react-native-worklets"],
}
const LOCAL_IMPORT =
  /^@\/components\/(ui|patterns|interactions|blocks|charts|primitives)\/([\w-]+)$/
const FRONTMATTER = /^---\n([\s\S]*?)\n---/
const PLATFORMS = /^platforms:\s*\[([^\]]*)\]/m

export const STANDARD_STYLINGS = ["uniwind", "nativewind", "stylesheet"]

const TYPES = {
  ui: { type: "registry:ui", docs: "components" },
  pattern: { type: "registry:component", docs: "patterns" },
  interaction: { type: "registry:component", docs: "interactions" },
  chart: {
    type: "registry:block",
    docs: "charts",
    categories: (name) => ["charts", `charts-${name.split("-")[0]}`],
  },
  block: {
    type: "registry:block",
    docs: "blocks",
    categories: (name) => ["blocks", name.split("-")[0]],
  },
  primitive: { type: "registry:component" },
}

const DESCRIPTIONS = {
  "animated-view":
    "An animated view or pressable for entering, exiting and layout animations.",
  "haptics-expo":
    "Plays the haptic feedback of the components through expo-haptics.",
  theme:
    "A theme provider with a light, dark and system toggle and an animated switch between them.",
}

const THEME_DESCRIPTIONS = {
  uniwind:
    "The suiss/ui colors for light and dark mode, with the type scale, shadows and radius scale, as a stylesheet imported by global.css.",
  nativewind:
    "The suiss/ui colors for light and dark mode as CSS variables, with the Tailwind CSS v3 colors, type scale, shadows and radius scale.",
  stylesheet:
    "The suiss/ui theme object with the colors for light and dark mode, the type scale and radius scale, and the useTheme hook.",
}

export function standardName(name) {
  return name.replace("/", "-")
}

async function docsPage(kind, name, platform = "rn") {
  if (!kind.docs) return undefined
  const file = path.join(DOCS, kind.docs, `${name}.mdx`)
  if (!existsSync(file)) return undefined
  const frontmatter = (await readFile(file, "utf8")).match(FRONTMATTER)?.[1]
  const platforms = frontmatter?.match(PLATFORMS)?.[1].split(",")
  if (!platforms?.map((entry) => entry.trim()).includes(platform)) {
    return undefined
  }
  return {
    url: `${SITE}/docs/${kind.docs}/${name}`,
    title: frontmatterValue(frontmatter, "title"),
    description: frontmatterValue(frontmatter, "description"),
  }
}

function sourceOf(item, styling, file) {
  return item.type === "primitive" ? file : `${styling}/${file}`
}

async function analyze(root, name, styling, source) {
  const code = await readFile(path.join(root, source), "utf8")
  const dependencies = new Set()
  const requires = new Set()
  for (const specifier of collectImports(code)) {
    const local = specifier.match(LOCAL_IMPORT)
    if (specifier === THEME_IMPORT) {
      if (styling === "stylesheet") requires.add(THEME)
      else if (name !== "theme") requires.add("theme")
    } else if (local) {
      const required =
        local[1] === "primitives" ? `primitives/${local[2]}` : local[2]
      if (required !== name) requires.add(required)
    } else if (specifier.startsWith("./") && name.startsWith("primitives/")) {
      requires.add(`primitives/${path.posix.basename(specifier)}`)
    } else if (specifier.startsWith(".") || specifier.startsWith("@/")) {
      throw new Error(`${source}: unsupported import "${specifier}"`)
    } else {
      const pkg = packageName(specifier)
      if (IGNORED_PACKAGES.has(pkg)) continue
      dependencies.add(pkg)
      for (const companion of COMPANIONS[pkg] ?? []) dependencies.add(companion)
    }
  }
  return { dependencies: [...dependencies].sort(), requires: [...requires] }
}

async function toStandard(root, item, styling) {
  const kind = TYPES[item.type]
  const name = standardName(item.name)
  const files = (item.styleFiles?.[styling] ?? item.files).map((file) => ({
    path: sourceOf(item, styling, file),
    type: kind.type === "registry:ui" ? "registry:ui" : "registry:component",
    ...(kind.type !== "registry:ui" && { target: `@${file}` }),
  }))
  const dependencies = new Set()
  const requires = new Set()
  for (const file of files) {
    const analysis = await analyze(root, item.name, styling, file.path)
    for (const dependency of analysis.dependencies) dependencies.add(dependency)
    for (const required of analysis.requires) requires.add(required)
  }
  const page = await docsPage(kind, item.name)
  const title = page?.title ?? toTitle(path.posix.basename(item.name))
  return {
    name,
    type: kind.type,
    title: item.type === "primitive" ? `${title} Primitive` : title,
    description:
      page?.description ??
      DESCRIPTIONS[item.name] ??
      (item.type === "primitive"
        ? `The headless ${title.toLowerCase()} behavior the components build on.`
        : `The ${title.toLowerCase()} component.`),
    ...(dependencies.size && { dependencies: [...dependencies].sort() }),
    ...(requires.size && {
      registryDependencies: [...requires]
        .sort()
        .map((required) => `${NAMESPACE}/${standardName(required)}`),
    }),
    files,
    ...(kind.categories && { categories: kind.categories(item.name) }),
    ...((page || item.name === "theme") && {
      meta: { links: { docs: page?.url ?? `${SITE}/docs/theming` } },
    }),
  }
}

function blockless(nodes) {
  return nodes.filter((node) => node.type !== "atrule" || node.nodes)
}

async function cssOf(root, file) {
  const css = await readFile(path.join(root, file), "utf8")
  return toCssObject(blockless(postcss.parse(css).nodes))
}

export async function uniwindTheme(root, file) {
  const css = postcss.parse(await readFile(path.join(root, file), "utf8"))
  css.walkAtRules("import", (node) => {
    node.remove()
  })
  return `${css.toString().trim()}\n`
}

async function tailwindConfig(root, file) {
  const source = path.join(root, file)
  const module = { exports: {} }
  runInNewContext(await readFile(source, "utf8"), {
    module,
    exports: module.exports,
    require: createRequire(source),
  })
  const { darkMode, theme } = module.exports
  return { darkMode, theme: { extend: theme.extend } }
}

function styleTitle(style) {
  return `${style[0].toUpperCase()}${style.slice(1)}`
}

async function themeItem(root, styling, styles, style) {
  const preset = style ? presetFiles(style) : undefined
  const base = {
    name: style ? `theme-${style}` : THEME,
    title: style ? `suiss/ui Theme (${styleTitle(style)})` : "suiss/ui Theme",
    description: style
      ? `${THEME_DESCRIPTIONS[styling]} Uses the ${style} style for radius, sizes, spacing, weights and shadows.`
      : THEME_DESCRIPTIONS[styling],
    meta: { links: { docs: `${SITE}/docs/theming` } },
  }
  if (styling === "stylesheet") {
    const file = preset?.stylesheet ?? styles.stylesheet.theme
    const analysis = await analyze(root, THEME, styling, file)
    return {
      ...base,
      type: "registry:lib",
      dependencies: analysis.dependencies,
      ...(analysis.requires.length && {
        registryDependencies: analysis.requires
          .sort()
          .map((required) => `${NAMESPACE}/${standardName(required)}`),
      }),
      files: [
        {
          path: file,
          type: "registry:lib",
          target: "@ui/theme.ts",
        },
      ],
    }
  }
  if (styling === "uniwind") {
    return {
      ...base,
      type: "registry:theme",
      files: [
        {
          path: style ? uniwindThemeFile(style) : UNIWIND_THEME,
          type: "registry:file",
          target: `~/${path.posix.basename(UNIWIND_THEME)}`,
        },
      ],
      css: { [`@import "./${path.posix.basename(UNIWIND_THEME)}"`]: {} },
    }
  }
  return {
    ...base,
    type: "registry:theme",
    ...(styling === "nativewind" && {
      tailwind: {
        config: await tailwindConfig(
          root,
          preset?.nativewind ?? styles.nativewind.config
        ),
      },
    }),
    css: await cssOf(root, styles[styling].stylesheet),
  }
}

export async function buildStandardRegistries(
  root,
  items,
  styles,
  presets = []
) {
  const registries = {}
  for (const styling of STANDARD_STYLINGS) {
    registries[styling] = {
      $schema: `${SCHEMA_URL}/registry.json`,
      name: `esuiss-${styling}`,
      homepage: SITE,
      items: [
        ...(await Promise.all(
          items.map((item) => toStandard(root, item, styling))
        )),
        await themeItem(root, styling, styles),
        ...(await Promise.all(
          presets.map((style) => themeItem(root, styling, styles, style))
        )),
      ],
    }
  }
  return registries
}

export async function standardProblems(registries, { schema = false } = {}) {
  const problems = []
  for (const [styling, registry] of Object.entries(registries)) {
    const names = new Set(registry.items.map((item) => item.name))
    for (const item of registry.items) {
      for (const dependency of item.registryDependencies ?? []) {
        const name = dependency.slice(NAMESPACE.length + 1)
        if (!names.has(name)) {
          problems.push(`${styling}: ${item.name} requires missing "${name}"`)
        }
      }
    }
    if (schema) {
      problems.push(
        ...(await schemaProblems(Ajv, registry)).map(
          (problem) => `${styling}: ${problem}`
        )
      )
    }
  }
  return problems
}

export const NATIVE_PLATFORMS = ["swift", "kotlin"]

const NATIVE_TARGETS = {
  swift: "~/EsuissUI",
  kotlin: "~/app/src/main/kotlin/com/esuiss/ui",
}

const NATIVE_THEME_FILES = {
  swift: "Tokens.swift",
  kotlin: "Tokens.kt",
}

const NATIVE_ITEM = "registry:item"

const SWIFT_IMPORT = /^import\s+(\w+)\s*$/gm

const NATIVE_THEME_DESCRIPTIONS = {
  swift:
    "The suiss/ui theme for SwiftUI: Theme.swift with the environment and modifiers, and Tokens.swift with the colors for light and dark mode, the type scale and radius scale.",
  kotlin:
    "The suiss/ui theme for Jetpack Compose: EsuissTheme in Theme.kt, and Tokens.kt with the colors for light and dark mode, the type scale and radius scale.",
}

function nativeFile(platform, directory, file) {
  return {
    path: path.posix.join(directory, file),
    type: "registry:file",
    target: path.posix.join(NATIVE_TARGETS[platform], file),
  }
}

function swiftPackagesFor(code, requirements) {
  const imports = new Set([...code.matchAll(SWIFT_IMPORT)].map((m) => m[1]))
  return requirements.packages.filter(({ products }) =>
    products.some((product) => imports.has(product))
  )
}

function kotlinDependenciesFor(code, requirements) {
  return requirements.dependencies.filter((dependency) => {
    const [group] = dependency.split(":")
    return !group.startsWith("androidx.") && code.includes(`import ${group}`)
  })
}

function nativeNotes(platform, code, requirements) {
  if (platform === "swift") {
    return swiftPackagesFor(code, requirements).map(
      ({ url, from, products }) =>
        `Add the Swift package ${url} from ${from} (${products.join(", ")}) to your app target.`
    )
  }
  return kotlinDependenciesFor(code, requirements).map(
    (dependency) =>
      `Add implementation("${dependency}") to the dependencies of your app module.`
  )
}

function nativeThemeNotes(platform, requirements) {
  if (platform === "swift") {
    return [
      `Needs iOS ${requirements.ios} or later.`,
      "The files go to EsuissUI/. Add that folder to your app target in Xcode.",
    ]
  }
  const core = requirements.dependencies.filter((dependency) =>
    dependency.startsWith("androidx.")
  )
  return [
    `Needs minSdk ${requirements.minSdk} or higher, the org.jetbrains.kotlin.plugin.compose plugin and buildFeatures { compose = true }.`,
    `Add implementation(platform("${requirements.bom}")) and ${core.map((dependency) => `implementation("${dependency}")`).join(", ")} to the dependencies of your app module.`,
    "The files go to app/src/main/kotlin/com/esuiss/ui/.",
  ]
}

async function toNative(root, item, platform, spec) {
  const kind = TYPES[item.type]
  const name = standardName(item.name)
  const files = item[platform].map((file) =>
    nativeFile(platform, spec.directory, file)
  )
  const code = (
    await Promise.all(
      files.map((file) => readFile(path.join(root, file.path), "utf8"))
    )
  ).join("\n")
  const notes = nativeNotes(platform, code, spec.requirements)
  const page = await docsPage(kind, item.name, platform)
  const title = page?.title ?? toTitle(path.posix.basename(item.name))
  return {
    name,
    type: NATIVE_ITEM,
    title,
    description:
      page?.description ??
      DESCRIPTIONS[item.name] ??
      `The ${title.toLowerCase()} component.`,
    registryDependencies: [`${NAMESPACE}/${THEME}`],
    files,
    ...(notes.length && { docs: notes.join("\n") }),
    ...(kind.categories && { categories: kind.categories(item.name) }),
    ...(page && { meta: { links: { docs: page.url } } }),
  }
}

function nativeThemeItem(platform, spec, style) {
  const preset = style ? presetFiles(style)[platform] : undefined
  const tokens = NATIVE_THEME_FILES[platform]
  return {
    name: style ? `theme-${style}` : THEME,
    type: NATIVE_ITEM,
    title: style ? `suiss/ui Theme (${styleTitle(style)})` : "suiss/ui Theme",
    description: style
      ? `${NATIVE_THEME_DESCRIPTIONS[platform]} Uses the ${style} style for radius, sizes, spacing, weights and shadows.`
      : NATIVE_THEME_DESCRIPTIONS[platform],
    files: spec.base.map((file) =>
      preset && path.posix.basename(file) === tokens
        ? {
            path: preset,
            type: "registry:file",
            target: path.posix.join(NATIVE_TARGETS[platform], file),
          }
        : nativeFile(platform, spec.directory, file)
    ),
    docs: nativeThemeNotes(platform, spec.requirements).join("\n"),
    meta: { links: { docs: `${SITE}/docs/installation` } },
  }
}

export async function buildNativeRegistries(
  root,
  items,
  platforms,
  presets = []
) {
  const registries = {}
  for (const platform of NATIVE_PLATFORMS) {
    const spec = platforms[platform]
    registries[platform] = {
      $schema: `${SCHEMA_URL}/registry.json`,
      name: `esuiss-${platform}`,
      homepage: SITE,
      items: [
        ...(await Promise.all(
          items
            .filter((item) => item[platform])
            .map((item) => toNative(root, item, platform, spec))
        )),
        nativeThemeItem(platform, spec),
        ...presets.map((style) => nativeThemeItem(platform, spec, style)),
      ],
    }
  }
  return registries
}
