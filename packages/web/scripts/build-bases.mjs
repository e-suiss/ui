import { existsSync } from "node:fs"
import { readdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "..")
const BASES = path.join(ROOT, "bases")
const SOURCE_FILE = /\.tsx?$/
const LINE_WIDTH = 80
const STRING_ARRAY = /^(.*)\[\n((?:\s+"[^"\n]*",?\n)+)\s*\]/gm
const ITEM_SEPARATOR = /,\s+/
const CHECKED = [
  "components/**/*.ts",
  "components/**/*.tsx",
  "hooks/**/*.ts",
  "lib/**/*.ts",
  "examples/**/*.tsx",
  "tests/*.ts",
  "tests/*.tsx",
  "tests/examples/**/*.tsx",
  "vitest.config.ts",
]

function stringify(value) {
  return `${JSON.stringify(value, null, 2)}\n`.replace(
    STRING_ARRAY,
    (array, start, items) => {
      const line = `${start}[${items.trim().split(ITEM_SEPARATOR).join(", ")}]`
      return line.length <= LINE_WIDTH ? line : array
    }
  )
}

async function listFiles(dir) {
  const entries = await readdir(dir, { recursive: true, withFileTypes: true })
  return entries
    .filter((entry) => entry.isFile() && SOURCE_FILE.test(entry.name))
    .map((entry) =>
      path
        .relative(dir, path.join(entry.parentPath, entry.name))
        .split(path.sep)
        .join("/")
    )
    .sort()
}

async function buildBase(base) {
  const dir = path.join(BASES, base)
  const files = await listFiles(dir)
  const missing = files.filter((file) => !existsSync(path.join(ROOT, file)))
  if (missing.length > 0)
    throw new Error(
      `bases/${base}: no Base UI original for ${missing.join(", ")}`
    )

  const manifest = { base, files }
  const tsconfig = {
    extends: "./tsconfig.json",
    compilerOptions: {
      paths: { "@/*": [`./bases/${base}/*`, "./*"] },
    },
    include: [...CHECKED, `bases/${base}/**/*.ts`, `bases/${base}/**/*.tsx`],
    exclude: ["node_modules", ...files],
  }

  return [
    [path.join(dir, "files.json"), manifest],
    [path.join(ROOT, `tsconfig.${base}.json`), tsconfig],
  ]
}

const bases = (await readdir(BASES, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort()

const outputs = (await Promise.all(bases.map(buildBase))).flat()
const check = process.argv.includes("--check")
const stale = []

for (const [file, value] of outputs) {
  const content = stringify(value)
  const current = existsSync(file) ? await readFile(file, "utf8") : ""
  if (current === content) continue
  if (check) stale.push(path.relative(ROOT, file))
  else await writeFile(file, content)
}

if (stale.length > 0) {
  console.error(
    `Out of date: ${stale.join(", ")}. Run pnpm --filter @esuiss/web bases`
  )
  process.exit(1)
}
