import { readdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "..")
const WEB = path.resolve(ROOT, "../../packages/web")
const OUTPUT = path.join(ROOT, "lib/icons")
const SOURCES = ["components", "examples", "bases"]
const LIBRARIES = {
  lucide: [{ from: "lucide-react", icons: true }],
  tabler: [{ from: "@tabler/icons-react", icons: true }],
  hugeicons: [
    { from: "@hugeicons/core-free-icons", icons: true },
    { from: "@hugeicons/react", names: ["HugeiconsIcon"] },
  ],
  remixicon: [{ from: "@remixicon/react", icons: true }],
}
const PLACEHOLDER = /<IconPlaceholder\b[^>]*?\/>/gs

async function files(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map((entry) => {
      const full = path.join(directory, entry.name)
      if (entry.isDirectory()) return files(full)
      return entry.name.endsWith(".tsx") ? [full] : []
    })
  )
  return nested.flat()
}

function exportText(names, from) {
  const inline = `export { ${names.join(", ")} } from "${from}"`
  if (inline.length <= 80) return inline
  return `export {\n${names.map((name) => `  ${name},`).join("\n")}\n} from "${from}"`
}

const sources = (
  await Promise.all(SOURCES.map((source) => files(path.join(WEB, source))))
).flat()
const placeholders = []
for (const file of sources)
  placeholders.push(...(await readFile(file, "utf8")).matchAll(PLACEHOLDER))

const check = process.argv.includes("--check")
const stale = []
for (const [library, modules] of Object.entries(LIBRARIES)) {
  const attribute = new RegExp(`\\b${library}="([^"]+)"`)
  const icons = [
    ...new Set(
      placeholders.flatMap(([tag]) => tag.match(attribute)?.[1] ?? [])
    ),
  ].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
  const text = `${modules
    .map(({ from, names, icons: own }) => exportText(own ? icons : names, from))
    .join("\n")}\n`
  const target = path.join(OUTPUT, `${library}.ts`)
  const current = await readFile(target, "utf8").catch(() => "")
  if (current === text) continue
  if (check) stale.push(path.relative(ROOT, target))
  else await writeFile(target, text)
}

if (stale.length) {
  console.error(
    `Preview icons are out of date: ${stale.join(", ")}. Run node scripts/preview-icons.mjs.`
  )
  process.exit(1)
}
