import { readdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"

const REGISTRY = "esuiss/esuiss-ui"
const ROOT = process.cwd()
const THEME_FILE = "styles/theme.css"
const IGNORED_PACKAGES = new Set(["react", "react-dom"])

const sources = [
  { dir: "components/ui", type: "registry:ui" },
  { dir: "hooks", type: "registry:hook" },
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

function parseVars(css, selector) {
  const block = css.match(new RegExp(`${selector}\\s*\\{([^}]*)\\}`))
  if (!block) throw new Error(`Missing ${selector} block in ${THEME_FILE}`)
  return Object.fromEntries(
    [...block[1].matchAll(/--([\w-]+):\s*([^;]+);/g)].map(([, key, value]) => [
      key,
      value.trim(),
    ])
  )
}

async function buildTheme() {
  const css = await readFile(path.join(ROOT, THEME_FILE), "utf8")
  return {
    name: "theme",
    type: "registry:theme",
    title: "Theme",
    description: "esuiss-ui color palette, radius, and dark mode tokens.",
    cssVars: {
      light: parseVars(css, ":root"),
      dark: parseVars(css, "\\.dark"),
    },
  }
}

async function buildItem(dir, type, file) {
  const filePath = path.posix.join(dir, file)
  const name = path.basename(file, path.extname(file))
  const code = await readFile(path.join(ROOT, filePath), "utf8")

  const dependencies = new Set()
  const registryDependencies = new Set()

  for (const specifier of collectImports(code)) {
    if (specifier.startsWith("@/")) {
      const local = path.posix.basename(specifier)
      if (local !== name) registryDependencies.add(`${REGISTRY}/${local}`)
    } else if (!specifier.startsWith(".")) {
      const pkg = packageName(specifier)
      if (!IGNORED_PACKAGES.has(pkg)) dependencies.add(pkg)
    }
  }

  return {
    name,
    type,
    title: toTitle(name),
    ...(dependencies.size && { dependencies: [...dependencies].sort() }),
    ...(registryDependencies.size && {
      registryDependencies: [...registryDependencies].sort(),
    }),
    files: [{ path: filePath, type }],
  }
}

const items = [await buildTheme()]
for (const { dir, type } of sources) {
  const files = (await readdir(path.join(ROOT, dir)))
    .filter((file) => /\.(tsx?|jsx?)$/.test(file))
    .sort()
  for (const file of files) items.push(await buildItem(dir, type, file))
}

const registry = {
  $schema: "https://ui.shadcn.com/schema/registry.json",
  name: "esuiss-ui",
  homepage: `https://github.com/${REGISTRY}`,
  items,
}

await writeFile(
  path.join(ROOT, "registry.json"),
  `${JSON.stringify(registry, null, 2)}\n`
)

console.log(`registry.json: ${items.length} items`)
