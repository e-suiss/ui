import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

import { ensureBabelPlugin } from "./babel.mjs"
import { formatDiff } from "./diff.mjs"
import { ensurePodDeploymentTarget } from "./ios.mjs"
import { CliError, color, list, note, step } from "./output.mjs"
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

async function fetchFiles(registry, items, styling) {
  return Promise.all(
    items.flatMap((item) =>
      item.files.map(async (file) => ({
        file,
        content: await fetchText(sourceOf(registry, item, file, styling)),
      }))
    )
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
  const files = await fetchFiles(registry, items, styling)

  const created = []
  const updated = []
  const skipped = []

  for (const { file, content } of files) {
    const target = path.join(root, file)
    const relative = path.relative(project.cwd, target)
    if (!existsSync(target)) {
      mkdirSync(path.dirname(target), { recursive: true })
      writeFileSync(target, content)
      created.push(relative)
    } else if (readFileSync(target, "utf8") !== content) {
      if (overwrite) {
        writeFileSync(target, content)
        updated.push(relative)
      } else {
        skipped.push(relative)
      }
    }
  }

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

  if (created.length) {
    step(`Created ${created.length} file${created.length === 1 ? "" : "s"}:`)
    list(created)
  }
  if (updated.length) {
    step(`Updated ${updated.length} file${updated.length === 1 ? "" : "s"}:`)
    list(updated)
  }
  if (installed.length) step(`Installed ${installed.join(", ")}`)
  if (skipped.length) {
    note(
      `Kept ${skipped.length} local file${skipped.length === 1 ? " that differs" : "s that differ"} from the registry. Review with --diff, replace with --overwrite:`
    )
    list(skipped)
  }
  if (!created.length && !updated.length && !skipped.length) {
    step("Already up to date.")
  }
  for (const message of manual) note(message)
  if (installed.length && project.framework === "react-native") {
    note("Run `cd ios && pod install` before building for iOS.")
  }
}

async function showDiff(project, root, registry, names, styling) {
  const requested = new Set(names)
  const items = resolveItems(registry, names).filter((item) =>
    requested.has(item.name)
  )
  let changes = 0

  for (const { file, content } of await fetchFiles(registry, items, styling)) {
    const target = path.join(root, file)
    const relative = path.relative(project.cwd, target)
    if (!existsSync(target)) {
      note(`${relative} is not installed.`)
      continue
    }
    const diff = formatDiff(readFileSync(target, "utf8"), content)
    if (!diff) continue
    changes++
    console.log(`\n${color.bold(relative)}\n${diff}`)
  }

  if (!changes) step("No differences from the registry.")
}

export async function add(names, options) {
  const project = detectProject(options.cwd)
  const root = findAliasRoot(project.cwd)
  if (!root) {
    throw new CliError(
      'No "@/*" import alias found in tsconfig.json. Run `npx @esuiss/uim init` first.'
    )
  }

  const styling =
    detectStyling(project, options.styling) ??
    (existsSync(path.join(root, "components", "ui", "theme.ts"))
      ? "stylesheet"
      : null)
  if (!styling) {
    throw new CliError(
      "No styling setup found. Run `npx @esuiss/uim init` first."
    )
  }

  const registry = await fetchRegistry()
  const selected = options.all ? registry.items.map((item) => item.name) : names
  if (!selected.length) {
    throw new CliError(
      "Name at least one component, e.g. npx @esuiss/uim add button"
    )
  }

  if (options.diff) await showDiff(project, root, registry, selected, styling)
  else
    await installItems(project, root, registry, selected, {
      overwrite: options.overwrite,
      styling,
    })
}
