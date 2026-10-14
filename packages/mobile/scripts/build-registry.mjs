import { existsSync } from "node:fs"
import { readdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

import {
  buildNativeGraph,
  nativeFileOf,
  nativeRequirements,
  PLATFORMS,
} from "./native-registry.mjs"

const ROOT = process.cwd()
const OUTPUT = path.join(ROOT, "registry.json")
const STYLES = {
  uniwind: { stylesheet: "styles/uniwind.css", directory: "uniwind" },
  nativewind: {
    stylesheet: "styles/nativewind.css",
    config: "styles/nativewind.config.js",
    directory: "nativewind",
  },
  stylesheet: {
    theme: "stylesheet/components/ui/theme.ts",
    directory: "stylesheet",
  },
}
const PROVIDED_BY_INIT = new Set(["theme"])
const IGNORED_PACKAGES = new Set(["react", "react-native"])
const COMPANIONS = {
  "phosphor-react-native": ["react-native-svg"],
  "react-native-reanimated": ["react-native-worklets"],
}
const LOCAL_IMPORT =
  /^@\/(components\/(?:ui|patterns|interactions|blocks|charts)|components\/primitives|hooks)\/([\w-]+)$/
const PRIMITIVES_DIR = "components/primitives"

const sources = [
  { dir: "components/ui", type: "ui" },
  { dir: "components/patterns", type: "pattern" },
  { dir: "components/interactions", type: "interaction" },
  { dir: "components/blocks", type: "block" },
  { dir: "components/charts", type: "chart" },
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
      const required =
        local[1] === PRIMITIVES_DIR ? `primitives/${local[2]}` : local[2]
      if (required !== name) requires.add(required)
    } else if (
      specifier.startsWith("./") &&
      filePath.startsWith(PRIMITIVES_DIR)
    ) {
      requires.add(`primitives/${path.posix.basename(specifier)}`)
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
    const source = path.posix.join(directory, filePath)
    if (!existsSync(path.join(ROOT, source))) {
      throw new Error(`missing ${source}`)
    }
    overrides.push(style)
    const analysis = await analyze(source, name)
    dependencies[style] = [...analysis.dependencies].sort()
    for (const required of analysis.requires) {
      if (!PROVIDED_BY_INIT.has(required)) requires.add(required)
    }
  }

  return {
    name,
    type,
    title: toTitle(name),
    dependencies,
    requires: [...requires].sort(),
    files: [filePath],
    overrides,
  }
}

async function buildPrimitive(file) {
  const filePath = path.posix.join(PRIMITIVES_DIR, file)
  const name = `primitives/${path.basename(file, path.extname(file))}`
  const analysis = await analyze(filePath, name)
  const dependencies = [...analysis.dependencies].sort()
  return {
    name,
    type: "primitive",
    title: toTitle(path.basename(file, path.extname(file))),
    dependencies: Object.fromEntries(
      Object.keys(STYLES).map((style) => [style, dependencies])
    ),
    requires: [...analysis.requires].sort(),
    files: [filePath],
  }
}

function validate(items) {
  const names = new Set(items.map((item) => item.name))
  const problems = items.flatMap((item) =>
    item.requires
      .filter((required) => !names.has(required))
      .map((required) => `${item.name} requires missing item "${required}"`)
  )
  for (const { stylesheet, config, theme } of Object.values(STYLES)) {
    for (const file of [stylesheet, config, theme].filter(Boolean)) {
      if (!existsSync(path.join(ROOT, file))) problems.push(`missing ${file}`)
    }
  }
  return problems
}

const items = []
for (const { dir, type } of sources) {
  const folder = path.join(ROOT, STYLES.uniwind.directory, dir)
  if (!existsSync(folder)) continue
  const files = (await readdir(folder))
    .filter((file) => /\.(tsx?|jsx?)$/.test(file))
    .sort()
  for (const file of files) items.push(await buildItem(dir, type, file))
}
for (const file of (await readdir(path.join(ROOT, PRIMITIVES_DIR)))
  .filter((entry) => /\.(tsx?|jsx?)$/.test(entry))
  .sort()) {
  items.push(await buildPrimitive(file))
}

const platforms = {}
const problems = validate(items)
for (const [platform, config] of Object.entries(PLATFORMS)) {
  const graph = await buildNativeGraph(ROOT, platform)
  const used = new Set(graph.base)
  for (const [name, file] of Object.entries(config.files)) {
    if (!graph.files.includes(file))
      problems.push(`missing ${config.source}/${file} for ${name}`)
  }
  for (const item of items) {
    const file = nativeFileOf(platform, item, graph.files)
    if (!file) continue
    item[platform] = graph.filesFor(file)
    for (const entry of item[platform]) used.add(entry)
  }
  for (const file of graph.files.filter((entry) => !used.has(entry))) {
    problems.push(`${config.source}/${file} is not used by any item`)
  }
  platforms[platform] = {
    directory: config.source,
    base: graph.base,
    requirements: await nativeRequirements(ROOT, platform),
  }
}

if (problems.length) {
  console.error(problems.join("\n"))
  process.exit(1)
}

const registry = {
  name: "esuiss-uim",
  homepage: "https://github.com/e-suiss/uim",
  styles: STYLES,
  platforms,
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
