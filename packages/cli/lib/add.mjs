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
import { choose, isInteractive } from "./prompt.mjs"
import {
  fetchRegistry,
  fetchText,
  resolveItems,
  sourceOf,
} from "./registry.mjs"

const CONCURRENCY = 8

export async function fetchFiles(entries) {
  const results = new Array(entries.length)
  let next = 0
  const worker = async () => {
    while (next < entries.length) {
      const index = next++
      const { file, source } = entries[index]
      results[index] = { file, content: await fetchText(source) }
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, entries.length) }, worker)
  )
  return results
}

function itemEntries(registry, items, styling) {
  return items.flatMap((item) =>
    item.files.map((file) => ({
      file,
      source: sourceOf(registry, item, file, styling),
    }))
  )
}

export function writeFiles(cwd, root, files, overwrite) {
  const created = []
  const updated = []
  const skipped = []

  for (const { file, content } of files) {
    const target = path.join(root, file)
    const relative = path.relative(cwd, target)
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
  return { created, updated, skipped }
}

export function reportFiles({ created, updated, skipped }, installed = []) {
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
}

export async function showDiff(cwd, root, entries) {
  let changes = 0

  for (const { file, content } of await fetchFiles(entries)) {
    const target = path.join(root, file)
    const relative = path.relative(cwd, target)
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
    root,
    await fetchFiles(itemEntries(registry, items, styling)),
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

const GROUPS = {
  ui: { kind: "component", label: "Components" },
  pattern: { kind: "pattern", label: "Patterns" },
  interaction: { kind: "interaction", label: "Interactions" },
  chart: { kind: "chart", label: "Charts" },
  block: { kind: "block", label: "Blocks" },
}

export async function pickNames(items) {
  const choices = Object.entries(GROUPS).flatMap(([type, { label }]) => {
    const count = items.filter((item) => item.type === type).length
    return count ? [{ value: type, label, hint: String(count) }] : []
  })
  const type = await choose("What do you want to add?", choices)
  return choose(
    `Which ${GROUPS[type].kind}s?`,
    items
      .filter((item) => item.type === type)
      .map((item) => ({ value: item.name, label: item.name }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    { multiple: true }
  )
}

export function availableNames(items) {
  return items
    .filter((item) => GROUPS[item.type])
    .map((item) => item.name)
    .join(", ")
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
  const picking = !names.length && !options.all && isInteractive()
  const chosen = picking ? await pickNames(registry.items) : names
  const selected = options.all
    ? registry.items.map((item) => item.name)
    : chosen
  if (!selected.length) {
    throw new CliError(
      `Name at least one component, e.g. npx @esuiss/uim add button\nAvailable: ${availableNames(registry.items)}`
    )
  }

  if (options.diff) {
    const requested = new Set(selected)
    const items = resolveItems(registry, selected).filter((item) =>
      requested.has(item.name)
    )
    await showDiff(project.cwd, root, itemEntries(registry, items, styling))
  } else {
    await installItems(project, root, registry, selected, {
      overwrite: options.overwrite,
      styling,
    })
  }
}
