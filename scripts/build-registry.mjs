import { existsSync } from "node:fs"
import { readdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

const ROOT = process.cwd()
const OUTPUT = path.join(ROOT, "registry.json")
const STYLESHEET = "styles/globals.css"
const IGNORED_PACKAGES = new Set(["react", "react-dom"])
const OPT_IN = new Set(["theme"])
const LOCAL_IMPORT =
  /^@\/(components\/ui|components\/patterns|components\/interactions|components\/charts|components\/blocks|hooks)\/([\w-]+)$/

const sources = [
  { dir: "components/ui", type: "ui" },
  { dir: "components/patterns", type: "pattern" },
  { dir: "components/interactions", type: "interaction" },
  { dir: "components/charts", type: "chart" },
  { dir: "components/blocks", type: "block" },
  { dir: "hooks", type: "hook" },
]

function toTitle(name) {
  return name
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}

function packageName(specifier) {
  const parts = specifier.split("/")
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0]
}

function collectImports(code) {
  const specifiers = new Set()
  const pattern = /(?:from\s+|import\s+)["']([^"']+)["']/g
  for (const match of code.matchAll(pattern)) specifiers.add(match[1])
  return [...specifiers]
}

async function buildItem(dir, type, file) {
  const filePath = path.posix.join(dir, file)
  const name = path.basename(file, path.extname(file))
  const code = await readFile(path.join(ROOT, filePath), "utf8")

  const dependencies = new Set()
  const requires = new Set()

  for (const specifier of collectImports(code)) {
    const local = specifier.match(LOCAL_IMPORT)
    if (local) {
      if (local[2] !== name) requires.add(local[2])
    } else if (specifier.startsWith("@/")) {
      throw new Error(`${filePath}: unsupported local import "${specifier}"`)
    } else if (!specifier.startsWith(".")) {
      const pkg = packageName(specifier)
      if (!IGNORED_PACKAGES.has(pkg)) dependencies.add(pkg)
    }
  }

  return {
    name,
    type,
    title: toTitle(name),
    dependencies: [...dependencies].sort(),
    requires: [...requires].sort(),
    files: [filePath],
    ...(OPT_IN.has(name) && { optIn: true }),
  }
}

function validate(items) {
  const names = new Set(items.map((item) => item.name))
  const duplicates = items
    .map((item) => item.name)
    .filter((name, index, all) => all.indexOf(name) !== index)
  const problems = [
    ...duplicates.map((name) => `"${name}" is defined more than once`),
    ...items.flatMap((item) =>
      item.requires
        .filter((required) => !names.has(required))
        .map((required) => `${item.name} requires missing item "${required}"`)
    ),
  ]
  if (!existsSync(path.join(ROOT, STYLESHEET))) {
    problems.push(`missing ${STYLESHEET}`)
  }
  return problems
}

const items = []
for (const { dir, type } of sources) {
  if (!existsSync(path.join(ROOT, dir))) continue
  const files = (await readdir(path.join(ROOT, dir)))
    .filter((file) => /\.(tsx?|jsx?)$/.test(file))
    .sort()
  for (const file of files) items.push(await buildItem(dir, type, file))
}

const problems = validate(items)
if (problems.length) {
  console.error(problems.join("\n"))
  process.exit(1)
}

const registry = {
  name: "esuiss-ui",
  homepage: "https://github.com/e-suiss/ui",
  stylesheet: STYLESHEET,
  items,
}
const output = `${JSON.stringify(registry, null, 2)}\n`

if (process.argv.includes("--check")) {
  const current = existsSync(OUTPUT) ? await readFile(OUTPUT, "utf8") : ""
  if (current !== output) {
    console.error("registry.json is out of date. Run `pnpm registry`.")
    process.exit(1)
  }
  console.log(`registry.json is up to date: ${items.length} items`)
} else {
  await writeFile(OUTPUT, output)
  console.log(`registry.json: ${items.length} items`)
}
