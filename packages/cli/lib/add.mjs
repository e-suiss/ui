import { readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

import { CliError, note, step } from "./output.mjs"
import {
  detectProject,
  findAliasRoot,
  findStylesheet,
  install,
} from "./project.mjs"
import { choose, isInteractive } from "./prompt.mjs"
import {
  fetchRegistry,
  fetchText,
  resolveItems,
  SCOPES,
  scopeOf,
} from "./registry.mjs"
import { printDiff, reportFiles, writeFiles } from "./shared/files.mjs"
import { relative } from "./shared/project.mjs"

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

async function addStyles(project, items) {
  const styled = items.filter((item) => item.css)
  if (!styled.length) return
  const names = styled.map((item) => item.name).join(", ")
  const file = findStylesheet(project)
  if (!file) {
    note(
      `Add the styles for ${names} to your stylesheet: ${styled.map((item) => item.css).join(", ")} in the registry.`
    )
    return
  }
  const rules = await Promise.all(styled.map((item) => fetchText(item.css)))
  const current = readFileSync(file, "utf8")
  const missing = rules
    .map((rule) => rule.trim())
    .filter((rule) => !current.includes(rule))
  if (!missing.length) return
  writeFileSync(file, `${current.trimEnd()}\n\n${missing.join("\n\n")}\n`)
  step(`Added the styles for ${names} to ${relative(project, file)}`)
}

export async function installItems(
  project,
  root,
  registry,
  names,
  { overwrite = false } = {}
) {
  const items = resolveItems(registry, names)
  const result = writeFiles(
    project.cwd,
    await fetchFiles(root, items),
    overwrite
  )
  const installed = install(
    project,
    items.flatMap((item) => item.dependencies)
  )
  reportFiles(result, installed)
  await addStyles(project, items)
}

async function showDiff(project, root, registry, names) {
  const requested = new Set(names)
  const items = resolveItems(registry, names).filter((item) =>
    requested.has(item.name)
  )
  printDiff(project.cwd, await fetchFiles(root, items))
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
