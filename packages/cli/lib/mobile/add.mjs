import { existsSync } from "node:fs"
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

export function fetchFiles(root, entries) {
  return mapLimit(entries, async ({ file, source }) => ({
    target: targetFor(root, file),
    content: await fetchText(source),
  }))
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
  { overwrite = false, styling }
) {
  const items = resolveItems(registry, names)
  const result = writeFiles(
    project.cwd,
    await fetchFiles(root, itemEntries(registry, items, styling)),
    overwrite
  )

  const dependencies = items.flatMap((item) => item.dependencies[styling])
  const installed = install(project, dependencies)
  const manual = [
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
      await fetchFiles(
        root,
        itemEntries(registry, resolveItems(registry, selected), styling)
      )
    )
  } else {
    await installItems(project, root, registry, selected, {
      overwrite: options.overwrite,
      styling,
    })
  }
}
