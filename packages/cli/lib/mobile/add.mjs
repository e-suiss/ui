import { existsSync, readFileSync } from "node:fs"
import path from "node:path"
import { CliError, note } from "../output.mjs"
import { SCOPES } from "../registry.mjs"
import {
  mapLimit,
  printDiff,
  reportFiles,
  targetFor,
  writeFiles,
} from "../shared/files.mjs"
import { chooseNames } from "../shared/select.mjs"
import { ensureBabelPlugin } from "./babel.mjs"
import { keepFontModule } from "./fonts.mjs"
import {
  iconDependencies,
  iconLibraryFor,
  switchIcons,
  withIcons,
} from "./icons.mjs"
import { ensurePodDeploymentTarget } from "./ios.mjs"
import {
  detectProject,
  detectStyling,
  findAliasRoot,
  install,
} from "./project.mjs"
import {
  fetchRegistry,
  fetchText,
  resolveItems,
  sourceOf,
} from "./registry.mjs"

export function fetchFiles(root, entries, kind = "rn") {
  const targets = entries.map(({ file, source }) => ({
    target: targetFor(root, file, kind),
    source,
  }))
  return mapLimit(targets, async ({ target, source }) => ({
    target,
    content: await fetchText(source),
  }))
}

const FONT_MODULE = path.join("components", "primitives", "font.ts")

function withLocalFonts(root, files) {
  const module = path.join(root, FONT_MODULE)
  return files.map((file) =>
    file.target === module && existsSync(module)
      ? {
          ...file,
          content: keepFontModule(file.content, readFileSync(module, "utf8")),
        }
      : file
  )
}

async function itemFiles(root, registry, items, styling, library) {
  return withLocalFonts(
    root,
    await withIcons(
      { platform: "rn", root, registry, library, fetchText },
      await fetchFiles(root, itemEntries(registry, items, styling))
    )
  )
}

export async function useIconLibrary(project, root, registry, iconLibrary) {
  if (!iconLibrary) return []
  const switched = await switchIcons({
    platform: "rn",
    root,
    registry,
    library: iconLibrary,
    fetchText,
  })
  if (!switched) return []
  install(project, switched.dependencies)
  return switched.unused.length
    ? [
        `${switched.unused.join(", ")} ${switched.unused.length === 1 ? "is" : "are"} no longer used by the components. Remove ${switched.unused.length === 1 ? "it" : "them"} with your package manager if nothing else needs ${switched.unused.length === 1 ? "it" : "them"}.`,
      ]
    : []
}

function itemEntries(registry, items, styling) {
  return items.flatMap((item) =>
    (item.styleFiles?.[styling] ?? item.files).map((file) => ({
      file,
      source: sourceOf(registry, item, file, styling),
    }))
  )
}

export async function installItems(
  project,
  root,
  registry,
  names,
  { overwrite = false, styling, iconLibrary }
) {
  const items = resolveItems(registry, names)
  const switched = await useIconLibrary(project, root, registry, iconLibrary)
  const library = iconLibraryFor("rn", root, { iconLibrary })
  const result = writeFiles(
    project.cwd,
    await itemFiles(root, registry, items, styling, library),
    overwrite
  )

  const dependencies = iconDependencies(
    registry,
    items.flatMap((item) => item.dependencies[styling]),
    library
  )
  const installed = install(project, dependencies)
  const manual = [
    ...switched,
    ...(dependencies.includes("react-native-reanimated") &&
    styling !== "nativewind"
      ? ensureBabelPlugin(
          project,
          "react-native-worklets/plugin",
          '"react-native-worklets/plugin"',
          { last: true }
        )
      : []),
    ...(dependencies.includes("react-native-svg")
      ? ensurePodDeploymentTarget(project)
      : []),
  ]

  reportFiles(result, installed)
  for (const message of manual) note(message)
  if (installed.length && project.framework === "react-native") {
    note("Run `cd ios && pod install` before building for iOS.")
  }
}

export function scopeOf(item) {
  return SCOPES[item.type] ? item.type : "ui"
}

export async function add(names, options) {
  const project = detectProject(options.cwd)
  const root = findAliasRoot(project.cwd)
  if (!root) {
    throw new CliError(
      'No "@/*" import alias found in tsconfig.json. Run `npx @esuiss/ui init` first.'
    )
  }

  const styling =
    detectStyling(project, options.styling) ??
    (existsSync(path.join(root, "components", "ui", "theme.ts"))
      ? "stylesheet"
      : null)
  if (!styling) {
    throw new CliError(
      "No styling setup found. Run `npx @esuiss/ui init` first."
    )
  }

  const registry = await fetchRegistry()
  const selected = await chooseNames(registry.items, names, options, {
    scopeOf,
  })

  if (options.diff) {
    printDiff(
      project.cwd,
      await itemFiles(
        root,
        registry,
        resolveItems(registry, selected),
        styling,
        iconLibraryFor("rn", root, options)
      )
    )
  } else {
    await installItems(project, root, registry, selected, {
      overwrite: options.overwrite,
      styling,
      iconLibrary: options.iconLibrary,
    })
  }
}
