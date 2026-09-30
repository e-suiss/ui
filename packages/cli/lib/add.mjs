import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

import { formatDiff } from "./diff.mjs"
import { CliError, color, list, note, step } from "./output.mjs"
import { detectProject, findAliasRoot, install } from "./project.mjs"
import { fetchRegistry, fetchText, resolveItems } from "./registry.mjs"

async function fetchFiles(items) {
  return Promise.all(
    items.flatMap((item) =>
      item.files.map(async (file) => ({ file, content: await fetchText(file) }))
    )
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
  const files = await fetchFiles(items)

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

  for (const { file, content } of await fetchFiles(items)) {
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
      'No "@/*" import alias found in tsconfig.json. Run `npx @esuiss/ui init` first.'
    )
  }

  const registry = await fetchRegistry()
  const selected = options.all ? registry.items.map((item) => item.name) : names
  if (!selected.length) {
    throw new CliError(
      "Name at least one component, e.g. npx @esuiss/ui add button"
    )
  }

  if (options.diff) await showDiff(project, root, registry, selected)
  else await installItems(project, root, registry, selected, options)
}
