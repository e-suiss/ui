import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs"
import path from "node:path"

import { formatDiff } from "../diff.mjs"
import { color, list, note, step } from "../output.mjs"

export function writeFiles(cwd, files, overwrite) {
  const created = []
  const updated = []
  const skipped = []

  for (const { target, content } of files) {
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

export function printDiff(cwd, files) {
  let changes = 0

  for (const { target, content } of files) {
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
