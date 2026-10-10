import { existsSync } from "node:fs"
import { readdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

const ROOT = process.cwd()
const OUTPUT = path.join(ROOT, "registry.json")
const STYLES = {
  uniwind: { stylesheet: "styles/uniwind.css" },
  nativewind: {
    stylesheet: "styles/nativewind.css",
    config: "styles/nativewind.config.js",
    directory: "nativewind",
  },
}
const IGNORED_PACKAGES = new Set(["react", "react-native"])
const COMPANIONS = {
  "phosphor-react-native": ["react-native-svg"],
  "react-native-reanimated": ["react-native-worklets"],
}
const LOCAL_IMPORT = /^@\/(components\/ui|hooks)\/([\w-]+)$/

const sources = [
  { dir: "components/ui", type: "ui" },
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

async function analyze(filePath, name) {
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
      if (IGNORED_PACKAGES.has(pkg)) continue
      dependencies.add(pkg)
      for (const companion of COMPANIONS[pkg] ?? []) dependencies.add(companion)
    }
  }
  return { dependencies, requires }
}

async function buildItem(dir, type, file) {
  const filePath = path.posix.join(dir, file)
  const name = path.basename(file, path.extname(file))
  const requires = new Set()
  const dependencies = {}
  const overrides = []

  for (const [style, { directory }] of Object.entries(STYLES)) {
    const override = directory && path.posix.join(directory, filePath)
    const source =
      override && existsSync(path.join(ROOT, override)) ? override : filePath
    if (source !== filePath) overrides.push(style)
    const analysis = await analyze(source, name)
    dependencies[style] = [...analysis.dependencies].sort()
    for (const required of analysis.requires) requires.add(required)
  }

  return {
    name,
    type,
    title: toTitle(name),
    dependencies,
    requires: [...requires].sort(),
    files: [filePath],
    ...(overrides.length ? { overrides } : {}),
  }
}

function validate(items) {
  const names = new Set(items.map((item) => item.name))
  const problems = items.flatMap((item) =>
    item.requires
      .filter((required) => !names.has(required))
      .map((required) => `${item.name} requires missing item "${required}"`)
  )
  for (const { stylesheet, config } of Object.values(STYLES)) {
    for (const file of [stylesheet, config].filter(Boolean)) {
      if (!existsSync(path.join(ROOT, file))) problems.push(`missing ${file}`)
    }
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
  name: "esuiss-uim",
  homepage: "https://github.com/e-suiss/uim",
  styles: STYLES,
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
