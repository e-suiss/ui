import { existsSync } from "node:fs"
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import Ajv from "ajv"
import postcss from "postcss"

import {
  collectImports,
  packageName,
  toTitle,
} from "../../../scripts/lib/registry.mjs"

const ROOT = path.resolve(import.meta.dirname, "..")
const DOCS = path.resolve(ROOT, "../../apps/ui/content/docs")
const SITE = "https://ui.suiss.app"
const SCHEMA_URL = "https://ui.shadcn.com/schema"
const LEGACY_OUTPUT = path.join(ROOT, "registry.json")
const OUTPUT = path.join(ROOT, "registry/registry.json")
const STYLESHEET = "styles/globals.css"
const NAMESPACE = "@esuiss"
const IGNORED_PACKAGES = new Set(["react", "react-dom"])
const BUILT_IN = new Set(["utils"])
const OPT_IN = new Set(["theme"])
const ITEM_CSS = new Map([["theme", "styles/theme.css"]])
const ICON_PLACEHOLDER = "@/app/(create)/components/icon-placeholder"
const LOCAL_IMPORT =
  /^@\/(components\/ui|components\/patterns|components\/interactions|components\/charts|components\/blocks|hooks|lib)\/([\w-]+)$/
const SOURCE_FILE = /\.(tsx?|jsx?)$/
const FRONTMATTER = /^---\n([\s\S]*?)\n---/
const DESCRIPTION = /^description:\s*(.+)$/m
const WHITESPACE = /\s+/g
const PAREN_SPACE = /\(\s+|\s+\)/g

const THEME = {
  name: "theme-suiss",
  title: "suiss/ui Theme",
  description:
    "The suiss/ui colors for light and dark mode, with the radius scale and the system font stack.",
  font: "@fontsource-variable/inter",
}

const DESCRIPTIONS = {
  theme:
    "A theme provider with a light, dark and system toggle and an animated switch between them.",
  "use-message-scroller":
    "The scroll state and controls behind the message scroller.",
  "use-mobile":
    "Reports whether the viewport is narrower than the mobile breakpoint.",
  "use-platform":
    "Detects Apple platforms so shortcuts can show the matching modifier key.",
  "use-questionnaire":
    "The state and keyboard shortcuts behind the questionnaire.",
  "use-scrollbar-gap":
    "Keeps the page from shifting when an overlay hides the scrollbar.",
  utils: "The cn helper that merges Tailwind CSS class names.",
}

const DOC_PAGES = { theme: "/docs/theming" }

const sources = [
  {
    dir: "components/ui",
    legacy: "ui",
    type: "registry:ui",
    docs: "components",
  },
  {
    dir: "components/patterns",
    legacy: "pattern",
    type: "registry:component",
    docs: "patterns",
    categories: () => ["patterns"],
  },
  {
    dir: "components/interactions",
    legacy: "interaction",
    type: "registry:component",
    docs: "interactions",
    categories: () => ["interactions"],
  },
  {
    dir: "components/charts",
    legacy: "chart",
    type: "registry:block",
    docs: "charts",
    categories: (name) => ["charts", `charts-${name.split("-")[0]}`],
  },
  {
    dir: "components/blocks",
    legacy: "block",
    type: "registry:block",
    docs: "blocks",
    categories: (name) => ["blocks", name.split("-")[0]],
  },
  { dir: "hooks", legacy: "hook", type: "registry:hook" },
  { dir: "lib", legacy: "lib", type: "registry:lib" },
]

async function docsPage(source, name) {
  if (!source.docs) return undefined
  const file = path.join(DOCS, source.docs, `${name}.mdx`)
  if (!existsSync(file)) return undefined
  const frontmatter = (await readFile(file, "utf8")).match(FRONTMATTER)?.[1]
  const description = frontmatter?.match(DESCRIPTION)?.[1]
  return {
    url: `/docs/${source.docs}/${name}`,
    description: description && JSON.parse(description),
  }
}

async function collect(source, file) {
  const filePath = path.posix.join(source.dir, file)
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
    source,
    file: filePath,
    icons,
    dependencies: [...dependencies].sort(),
    requires: [...requires].sort(),
    page: await docsPage(source, name),
  }
}

function toLegacy(entry) {
  return {
    name: entry.name,
    type: entry.source.legacy,
    title: toTitle(entry.name),
    dependencies: entry.dependencies,
    requires: entry.requires,
    files: [entry.file],
    ...(entry.icons && { icons: true }),
    ...(OPT_IN.has(entry.name) && { optIn: true }),
    ...(ITEM_CSS.has(entry.name) && { css: ITEM_CSS.get(entry.name) }),
  }
}

function normalize(text) {
  return text
    .replace(WHITESPACE, " ")
    .replace(PAREN_SPACE, (match) => match.trim())
}

function toCssObject(nodes) {
  const object = {}
  for (const node of nodes) {
    if (node.type === "decl") {
      object[node.prop] = normalize(node.value)
    } else if (node.type === "rule") {
      object[normalize(node.selector)] = toCssObject(node.nodes)
    } else if (node.type === "atrule") {
      object[`@${node.name} ${normalize(node.params)}`] = toCssObject(
        node.nodes ?? []
      )
    }
  }
  return object
}

async function readCss(file) {
  const source = path.join(ROOT, file)
  return postcss.parse(existsSync(source) ? await readFile(source, "utf8") : "")
}

function variables(node) {
  return Object.fromEntries(
    (node?.nodes ?? [])
      .filter((child) => child.type === "decl" && child.prop.startsWith("--"))
      .map((child) => [child.prop.slice(2), normalize(child.value)])
  )
}

async function themeItem() {
  const { nodes } = await readCss(STYLESHEET)
  const rule = (selector) =>
    nodes.find((node) => node.type === "rule" && node.selector === selector)
  const inline = nodes.find(
    (node) =>
      node.type === "atrule" &&
      node.name === "theme" &&
      node.params === "inline"
  )
  const theme = Object.fromEntries(
    Object.entries(variables(inline)).filter(
      ([name]) => name === "font-sans" || name.startsWith("radius-")
    )
  )
  return {
    name: THEME.name,
    type: "registry:theme",
    title: THEME.title,
    description: THEME.description,
    dependencies: [THEME.font],
    cssVars: {
      theme,
      light: variables(rule(":root")),
      dark: variables(rule(".dark")),
    },
    css: { [`@import "${THEME.font}"`]: {} },
    meta: { links: { docs: `${SITE}/docs/theming` } },
  }
}

async function toStandard(entry) {
  const { source } = entry
  const nested =
    source.dir.startsWith("components/") && source.type !== "registry:ui"
  const file = {
    path: entry.file,
    type: nested ? "registry:component" : source.type,
    ...(nested && { target: `@${entry.file}` }),
  }
  const registryDependencies = entry.requires.map((name) =>
    BUILT_IN.has(name) ? name : `${NAMESPACE}/${name}`
  )
  const docs = entry.page?.url ?? DOC_PAGES[entry.name]
  const css = ITEM_CSS.get(entry.name)
  const optIn = OPT_IN.has(entry.name)
  return {
    name: entry.name,
    type: source.type,
    title: toTitle(entry.name),
    description: entry.page?.description ?? DESCRIPTIONS[entry.name],
    ...(entry.dependencies.length && { dependencies: entry.dependencies }),
    ...(registryDependencies.length && { registryDependencies }),
    files: [file],
    ...(css && { css: toCssObject((await readCss(css)).nodes) }),
    ...(source.categories && { categories: source.categories(entry.name) }),
    ...((docs || optIn) && {
      meta: {
        ...(docs && { links: { docs: `${SITE}${docs}` } }),
        ...(optIn && { optIn }),
      },
    }),
  }
}

function validate(entries, registry) {
  const names = new Set(entries.map((entry) => entry.name))
  const all = registry.items.map((item) => item.name)
  const problems = [
    ...all
      .filter((name, index) => all.indexOf(name) !== index)
      .map((name) => `"${name}" is defined more than once`),
    ...entries.flatMap((entry) =>
      entry.requires
        .filter((required) => !names.has(required))
        .map((required) => `${entry.name} requires missing item "${required}"`)
    ),
    ...registry.items.flatMap((item) => [
      ...(item.description ? [] : [`${item.name} has no description`]),
      ...(item.name.includes("/") ? [`${item.name} is nested`] : []),
      ...((item.files ?? []).some((file) => "content" in file)
        ? [`${item.name} inlines file content`]
        : []),
    ]),
  ]
  const styles = entries.flatMap((entry) => ITEM_CSS.get(entry.name) ?? [])
  for (const file of [STYLESHEET, ...styles]) {
    if (!existsSync(path.join(ROOT, file))) problems.push(`missing ${file}`)
  }
  return problems
}

async function fetchSchema(name) {
  const response = await fetch(`${SCHEMA_URL}/${name}`)
  if (!response.ok) {
    throw new Error(
      `Could not download ${SCHEMA_URL}/${name}: ${response.status}`
    )
  }
  const { $schema: _draft, ...schema } = await response.json()
  return schema
}

async function schemaProblems(registry) {
  const ajv = new Ajv({ allErrors: true, strict: false })
  ajv.addSchema(
    await fetchSchema("registry-item.json"),
    `${SCHEMA_URL}/registry-item.json`
  )
  const check = ajv.compile(await fetchSchema("registry.json"))
  if (check(registry)) return []
  return check.errors.map(
    (error) => `schema: ${error.instancePath || "/"} ${error.message}`
  )
}

const entries = []
for (const source of sources) {
  if (!existsSync(path.join(ROOT, source.dir))) continue
  const files = (await readdir(path.join(ROOT, source.dir)))
    .filter((file) => SOURCE_FILE.test(file))
    .sort()
  for (const file of files) entries.push(await collect(source, file))
}

const legacy = {
  name: "esuiss-ui",
  homepage: "https://github.com/e-suiss/ui",
  stylesheet: STYLESHEET,
  items: entries.map(toLegacy),
}
const registry = {
  $schema: `${SCHEMA_URL}/registry.json`,
  name: "esuiss",
  homepage: SITE,
  items: [...(await Promise.all(entries.map(toStandard))), await themeItem()],
}

const checking = process.argv.includes("--check")
const problems = [
  ...validate(entries, registry),
  ...(process.argv.includes("--schema") ? await schemaProblems(registry) : []),
]
if (problems.length) {
  console.error(problems.join("\n"))
  process.exit(1)
}

const outputs = [
  [OUTPUT, registry],
  [LEGACY_OUTPUT, legacy],
]

if (checking) {
  const stale = []
  for (const [file, content] of outputs) {
    const current = existsSync(file) ? await readFile(file, "utf8") : ""
    if (current !== `${JSON.stringify(content, null, 2)}\n`) {
      stale.push(path.relative(ROOT, file))
    }
  }
  if (stale.length) {
    console.error(`Out of date: ${stale.join(", ")}. Run \`pnpm registry\`.`)
    process.exit(1)
  }
  console.log(
    `The registry is up to date and valid: ${registry.items.length} items`
  )
} else {
  await mkdir(path.dirname(OUTPUT), { recursive: true })
  for (const [file, content] of outputs) {
    await writeFile(file, `${JSON.stringify(content, null, 2)}\n`)
  }
  console.log(`registry/registry.json: ${registry.items.length} items`)
}
