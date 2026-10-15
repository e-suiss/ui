import { existsSync } from "node:fs"
import { readdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

import {
  collectImports,
  packageName,
  toTitle,
} from "../../../scripts/lib/registry.mjs"

const ROOT = path.resolve(import.meta.dirname, "..")
const OUTPUT = path.join(ROOT, "registry.json")
const STYLESHEET = "styles/globals.css"
const IGNORED_PACKAGES = new Set(["react", "react-dom"])
const OPT_IN = new Set(["theme"])
const ITEM_CSS = new Map([["theme", "styles/theme.css"]])
const ICON_PLACEHOLDER = "@/app/(create)/components/icon-placeholder"
const LOCAL_IMPORT =
  /^@\/(components\/ui|components\/patterns|components\/interactions|components\/charts|components\/blocks|hooks|lib)\/([\w-]+)$/

const sources = [
  { dir: "components/ui", type: "ui" },
  { dir: "components/patterns", type: "pattern" },
  { dir: "components/interactions", type: "interaction" },
  { dir: "components/charts", type: "chart" },
  { dir: "components/blocks", type: "block" },
  { dir: "hooks", type: "hook" },
  { dir: "lib", type: "lib" },
]

const SOURCE_FILE = /\.(tsx?|jsx?)$/

async function buildItem(dir, type, file) {
  const filePath = path.posix.join(dir, file)
  const name = path.basename(file, path.extname(file))
  const code = await readFile(path.join(ROOT, filePath), "utf8")

  const dependencies = new Set()
  const requires = new Set()
  let icons = false

  for (const specifier of collectImports(code)) {
    const local = specifier.match(LOCAL_IMPORT)
    if (specifier === ICON_PLACEHOLDER) {
      icons = true
    } else if (local) {
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
    ...(icons && { icons: true }),
    ...(OPT_IN.has(name) && { optIn: true }),
    ...(ITEM_CSS.has(name) && { css: ITEM_CSS.get(name) }),
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
  const stylesheets = [STYLESHEET, ...items.flatMap((item) => item.css ?? [])]
  for (const file of stylesheets) {
    if (!existsSync(path.join(ROOT, file))) problems.push(`missing ${file}`)
  }
  return problems
}

const items = []
for (const { dir, type } of sources) {
  if (!existsSync(path.join(ROOT, dir))) continue
  const files = (await readdir(path.join(ROOT, dir)))
    .filter((file) => SOURCE_FILE.test(file))
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
