import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

import { formatDiff } from "./diff.mjs"
import { CliError, color, list, note, step } from "./output.mjs"
import { detectProject, findAliasRoot, install } from "./project.mjs"
import { choose, isInteractive } from "./prompt.mjs"
import {
  fetchRegistry,
  fetchText,
  resolveItems,
  SCOPES,
  scopeOf,
} from "./registry.mjs"

function targetFor(root, file) {
  const target = path.resolve(root, file)
  const relative = path.relative(root, target)
  if (
    relative === ".." ||
    relative.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relative)
  ) {
    throw new CliError(`Refusing to write ${file} outside the project.`)
  }
  return target
}

function fetchFiles(root, items) {
  const files = items.flatMap((item) =>
    item.files.map((file) => ({ file, target: targetFor(root, file) }))
  )
  return Promise.all(
    files.map(async (entry) => ({
      ...entry,
      content: await fetchText(entry.file),
    }))
  )
}

export async function installItems(
  project,
  root,
  registry,
  names,
  { overwrite = false } = {}
) {
  const items = resolveItems(registry, names)
  const files = await fetchFiles(root, items)

  const created = []
  const updated = []
  const skipped = []

  for (const { target, content } of files) {
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

  const installed = install(
    project,
    items.flatMap((item) => item.dependencies)
  )

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

async function showDiff(project, root, registry, names) {
  const requested = new Set(names)
  const items = resolveItems(registry, names).filter((item) =>
    requested.has(item.name)
  )
  let changes = 0

  for (const { target, content } of await fetchFiles(root, items)) {
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

function selectNames(registry, names, { all, scope = "ui" }) {
  const inScope = (item) => scopeOf(item) === scope
  const scoped = registry.items.filter(inScope)
  const { kind, command, example } = SCOPES[scope]

  if (all) {
    if (!scoped.length) throw new CliError(`No ${kind}s are available yet.`)
    return scoped.filter((item) => !item.optIn).map((item) => item.name)
  }

  if (!names.length) {
    throw new CliError(
      `Name at least one ${kind}, e.g. npx @esuiss/ui ${command} ${example}\nAvailable: ${scoped.map((entry) => entry.name).join(", ") || "none yet"}`
    )
  }

  const byName = new Map(registry.items.map((item) => [item.name, item]))
  for (const name of names) {
    const item = byName.get(name)
    if (item && inScope(item)) continue
    if (item) {
      const other = SCOPES[scopeOf(item)]
      throw new CliError(
        `"${name}" is ${other.kind === "interaction" ? "an" : "a"} ${other.kind}. Run npx @esuiss/ui ${other.command} ${name}`
      )
    }
    throw new CliError(
      `Unknown ${kind}: ${name}.\nAvailable: ${scoped.map((entry) => entry.name).join(", ") || "none yet"}`
    )
  }
  return names
}

function pickScope(registry) {
  const choices = Object.entries(SCOPES).flatMap(([scope, { label }]) => {
    const count = registry.items.filter(
      (item) => scopeOf(item) === scope
    ).length
    return count ? [{ value: scope, label, hint: String(count) }] : []
  })
  return choose("What do you want to add?", choices)
}

function pickItems(registry, scope) {
  const { kind } = SCOPES[scope]
  const items = registry.items.filter((item) => scopeOf(item) === scope)
  if (!items.length) throw new CliError(`No ${kind}s are available yet.`)
  return choose(
    `Which ${kind}s?`,
    items
      .map((item) => ({ value: item.name, label: item.name }))
      .sort((a, b) => a.label.localeCompare(b.label)),
    { multiple: true }
  )
}

export async function add(names, options) {
  const project = detectProject(options.cwd)
  const root = findAliasRoot(project.cwd)
  if (!root) {
    throw new CliError(
      'No "@/*" import alias found in tsconfig.json. Run `npx @esuiss/ui init` first.'
    )
  }

  const registry = await fetchRegistry()
  const picking = !names.length && !options.all && isInteractive()
  const scope = options.scope ?? (picking ? await pickScope(registry) : "ui")
  const chosen = picking ? await pickItems(registry, scope) : names
  const selected = selectNames(registry, chosen, { ...options, scope })

  if (options.diff) await showDiff(project, root, registry, selected)
  else await installItems(project, root, registry, selected, options)
}
