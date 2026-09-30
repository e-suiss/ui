import { readdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import postcss from "postcss"

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

const VAR_SELECTORS = { ":root": "light", ".dark": "dark" }

function squash(text) {
  return text.replace(/\s+/g, " ").trim()
}

function merge(target, key, value) {
  const existing = target[key]
  target[key] =
    existing && typeof existing === "object" && typeof value === "object"
      ? { ...existing, ...value }
      : value
}

function toCssObject(container) {
  const result = {}
  for (const node of container.nodes ?? []) {
    if (node.type === "decl") {
      merge(
        result,
        node.prop,
        squash(node.important ? `${node.value} !important` : node.value)
      )
    } else if (node.type === "rule") {
      merge(
        result,
        squash(node.selector.replace(/\s*,\s*/g, ", ")),
        toCssObject(node)
      )
    } else if (
      node.type === "atrule" &&
      node.name === "theme" &&
      node.params === "inline"
    ) {
      for (const [key, value] of Object.entries(toCssObject(node)))
        merge(result, key, value)
    } else if (node.type === "atrule") {
      const key = squash(`@${node.name} ${node.params}`)
      merge(result, key, node.nodes ? toCssObject(node) : {})
    }
  }
  return result
}

function toVars(rule) {
  return Object.fromEntries(
    rule.nodes
      .filter((node) => node.type === "decl" && node.prop.startsWith("--"))
      .map((node) => [node.prop.slice(2), squash(node.value)])
  )
}

async function buildTheme() {
  const root = postcss.parse(
    await readFile(path.join(ROOT, THEME_FILE), "utf8")
  )
  const cssVars = {}
  const rest = postcss.root()

  for (const node of root.nodes) {
    const mode = node.type === "rule" && VAR_SELECTORS[node.selector]
    if (mode) cssVars[mode] = toVars(node)
    else if (node.type !== "comment") rest.append(node.clone())
  }

  for (const [selector, mode] of Object.entries(VAR_SELECTORS)) {
    if (!cssVars[mode])
      throw new Error(`Missing ${selector} block in ${THEME_FILE}`)
  }

  return {
    name: "theme",
    type: "registry:theme",
    title: "Theme",
    description:
      "esuiss-ui color palette, radius, dark mode tokens, variants, and utilities.",
    cssVars,
    css: toCssObject(rest),
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
