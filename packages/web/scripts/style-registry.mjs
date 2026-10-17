import { readdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

import { packStyles } from "./lib/packed.mjs"
import { applyStyle, loadStyleMaps, STYLE_NAMES } from "./lib/styles.mjs"

const output = path.resolve(process.argv[2] ?? "")
const bases = process.argv.slice(3)
const problems = []
let packed = 0

function styled(item, map, label) {
  const files = (item.files ?? []).map((entry) => {
    if (typeof entry.content !== "string") return entry
    const { output: content, unknown } = applyStyle(
      entry.content,
      map,
      entry.path
    )
    if (unknown.length) problems.push(`${label}: ${unknown.join(", ")}`)
    return { ...entry, content }
  })
  return `${JSON.stringify({ ...item, files }, null, 2)}\n`
}

for (const base of bases) {
  const maps = await loadStyleMaps(base)
  const dir = path.join(output, base)
  for (const name of await readdir(dir)) {
    if (!name.endsWith(".json") || name === "registry.json") continue
    const file = path.join(dir, name)
    const item = JSON.parse(await readFile(file, "utf8"))
    const label = `${base}/${name}`
    const variants = STYLE_NAMES.map((style) => [
      style,
      styled(item, maps[style], label),
    ])
    if (new Set(variants.map(([, text]) => text)).size === 1) {
      await writeFile(file, variants[0][1])
      continue
    }
    await writeFile(file, packStyles(variants))
    packed++
  }
}

if (problems.length) {
  console.error(`Unknown style markers:\n${[...new Set(problems)].join("\n")}`)
  process.exit(1)
}

console.log(`${packed} items packed with ${STYLE_NAMES.length} styles`)
