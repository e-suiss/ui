import { execFileSync } from "node:child_process"
import { readdir, readFile, writeFile } from "node:fs/promises"
import { createRequire } from "node:module"
import path from "node:path"
import { pathToFileURL } from "node:url"

const ROOT = path.resolve(import.meta.dirname, "..")
const WEB = path.resolve(ROOT, "../../packages/web")
const OUTPUT = path.join(ROOT, "lib/icons")
const SOURCES = [
  ...["components", "examples", "bases"].map((source) =>
    path.join(WEB, source)
  ),
  path.join(ROOT, "components/create/cards"),
]
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
const PHOSPHOR_ATTRIBUTE = /\bphosphor="([^"]+)"/
const ICON_SUFFIX = /Icon$/

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
  await Promise.all(SOURCES.map((source) => files(source)))
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

const require = createRequire(path.join(ROOT, "package.json"))
const PHOSPHOR = path.dirname(
  require.resolve("@phosphor-icons/react/package.json")
)
const phosphorIcons = [
  ...new Set(
    placeholders.flatMap(([tag]) => tag.match(PHOSPHOR_ATTRIBUTE)?.[1] ?? [])
  ),
].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))

function attribute([key, value]) {
  return typeof value === "string" ? `${key}="${value}"` : `${key}={${value}}`
}

function jsx(element) {
  const { children, ...props } = element.props
  const nested = [children].flat().filter(Boolean)
  if (typeof element.type !== "string") return nested.map(jsx).join("")
  const attributes = Object.entries(props).map(attribute).join(" ")
  const open = `<${element.type}${attributes ? ` ${attributes}` : ""}`
  if (nested.length === 0) return `${open} />`
  return `${open}>${nested.map(jsx).join("")}</${element.type}>`
}

const regular = await Promise.all(
  phosphorIcons.map(async (name) => {
    const definition = path.join(
      PHOSPHOR,
      "dist/defs",
      `${name.replace(ICON_SUFFIX, "")}.es.js`
    )
    const { default: weights } = await import(pathToFileURL(definition).href)
    const root = weights.get("regular")
    const markup = jsx(root)
    const multiple = [root.props.children].flat().filter(Boolean).length > 1
    return `  ${name}: icon(${multiple ? `<>${markup}</>` : markup}),`
  })
)

const phosphorText = execFileSync(
  path.join(ROOT, "../../node_modules/.bin/biome"),
  ["format", "--stdin-file-path=phosphor.tsx"],
  {
    cwd: ROOT,
    encoding: "utf8",
    input: `import type { IconProps, IconWeight } from "@phosphor-icons/react"
import IconBase from "@phosphor-icons/react/dist/lib/IconBase"
import type * as React from "react"

function icon(regular: React.ReactElement) {
  const weights = new Map<IconWeight, React.ReactElement>([["regular", regular]])
  return function Icon(props: IconProps) {
    return <IconBase {...props} weight="regular" weights={weights} />
  }
}

export const icons = {
${regular.join("\n")}
}
`,
  }
)
const phosphorTarget = path.join(OUTPUT, "phosphor.tsx")
if ((await readFile(phosphorTarget, "utf8").catch(() => "")) !== phosphorText) {
  if (check) stale.push(path.relative(ROOT, phosphorTarget))
  else await writeFile(phosphorTarget, phosphorText)
}

if (stale.length) {
  console.error(
    `Preview icons are out of date: ${stale.join(", ")}. Run node scripts/preview-icons.mjs.`
  )
  process.exit(1)
}
