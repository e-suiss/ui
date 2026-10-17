import { readdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

import { applyStyle, DEFAULT_STYLE, loadStyleMaps } from "./lib/styles.mjs"

const output = path.resolve(process.argv[2] ?? "")
const bases = process.argv.slice(3)
const maps = await loadStyleMaps()
const problems = []

for (const base of bases) {
  const dir = path.join(output, base)
  for (const name of await readdir(dir)) {
    if (!name.endsWith(".json") || name === "registry.json") continue
    const file = path.join(dir, name)
    const item = JSON.parse(await readFile(file, "utf8"))
    let changed = false
    for (const entry of item.files ?? []) {
      if (typeof entry.content !== "string") continue
      const { output: content, unknown } = applyStyle(
        entry.content,
        maps[DEFAULT_STYLE],
        entry.path
      )
      if (unknown.length)
        problems.push(`${base}/${name}: ${unknown.join(", ")}`)
      if (content !== entry.content) {
        entry.content = content
        changed = true
      }
    }
    if (changed) await writeFile(file, `${JSON.stringify(item, null, 2)}\n`)
  }
}

if (problems.length) {
  console.error(`Unknown style markers:\n${problems.join("\n")}`)
  process.exit(1)
}
