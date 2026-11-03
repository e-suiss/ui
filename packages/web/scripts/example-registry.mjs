import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "..")
const ITEM_SCHEMA = "https://ui.shadcn.com/schema/registry-item.json"
const INDEX = "registry.json"
const DEFAULT_BASE = "base"
const EXAMPLE = "registry:example"

const [target = "", ...bases] = process.argv.slice(2)
const output = path.resolve(target)
const problems = []

function examplesFile(base) {
  const dir = base === DEFAULT_BASE ? "registry" : path.join("registry", base)
  return path.join(ROOT, dir, "examples.json")
}

async function readJson(file) {
  return JSON.parse(await readFile(file, "utf8"))
}

async function withContent(item) {
  const files = await Promise.all(
    item.files.map(async (file) => ({
      path: file.path,
      content: await readFile(path.join(ROOT, file.path), "utf8"),
      type: file.type,
    }))
  )
  return { $schema: ITEM_SCHEMA, ...item, files }
}

for (const base of bases) {
  const dir = path.join(output, base)
  const indexFile = path.join(dir, INDEX)
  const index = await readJson(indexFile)
  const listed = index.items.filter((item) => item.type !== EXAMPLE)
  const known = new Set(listed.map((item) => item.name))
  const { items } = await readJson(examplesFile(base))
  for (const item of items) {
    if (known.has(item.name)) {
      problems.push(`${base}/${item.name} is already an item`)
      continue
    }
    const file = path.join(dir, `${item.name}.json`)
    await writeFile(
      file,
      `${JSON.stringify(await withContent(item), null, 2)}\n`
    )
  }
  index.items = [...listed, ...items]
  await writeFile(indexFile, `${JSON.stringify(index, null, 2)}\n`)
  console.log(`${base}: added ${items.length} examples`)
}

if (problems.length) {
  console.error(problems.join("\n"))
  process.exit(1)
}
