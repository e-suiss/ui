import { existsSync } from "node:fs"
import { readdir, readFile } from "node:fs/promises"
import path from "node:path"
import { highlightHast } from "fumadocs-core/highlight"
import {
  type CodeOptions,
  DEFAULT_BASE,
  DEFAULT_ICONS,
  PRIMITIVE_BASES,
} from "@/lib/code-options"
import {
  toIcons,
  usesIconPlaceholders,
} from "../../../packages/cli/lib/icons.mjs"

const palettes: Record<
  string,
  { prefix: string; base: string; colors: string[] }
> = {
  "--shiki-light": {
    prefix: "l",
    base: "24292e",
    colors: [
      "005cc5",
      "6f42c1",
      "22863a",
      "d73a49",
      "032f62",
      "e36209",
      "b31d28",
      "6a737d",
      "586069",
    ],
  },
  "--shiki-dark": {
    prefix: "d",
    base: "e1e4e8",
    colors: [
      "79b8ff",
      "b392f0",
      "85e89d",
      "f97583",
      "9ecbff",
      "ffab70",
      "fdaeb7",
      "6a737d",
      "dbedff",
    ],
  },
}

type Span = { properties: Record<string, unknown> }

const tokenClasses = {
  name: "token-classes",
  span(node: Span) {
    const style = node.properties.style
    if (typeof style !== "string") return
    const classes: string[] = []
    const rest: string[] = []
    for (const declaration of style.split(";")) {
      const [property = "", raw = ""] = declaration.split(":")
      const palette = palettes[property.trim()]
      const value = raw.trim().toLowerCase().replace("#", "")
      const index = palette ? palette.colors.indexOf(value) : -1
      if (palette && value === palette.base) continue
      if (palette && index >= 0) classes.push(`${palette.prefix}${index}`)
      else if (declaration.trim()) rest.push(declaration)
    }
    if (rest.length > 0) node.properties.style = rest.join(";")
    else Reflect.deleteProperty(node.properties, "style")
    if (classes.length > 0) node.properties.class = classes.join(" ")
  },
}

const packages = path.join(process.cwd(), "../../packages")
const webRoot = path.join(packages, "web")
const mobileRoot = path.join(packages, "mobile")
const nativeRoots: Record<string, string> = {
  swift: path.join(mobileRoot, "swiftui/Sources/EsuissUI"),
  kotlin: path.join(mobileRoot, "kotlin/ui/src/main/kotlin/com/esuiss/ui"),
}
const stylings = new Set(["uniwind", "nativewind", "stylesheet"])

function resolveSource(file: string) {
  const [head = "", ...rest] = file.split("/")
  const tail = rest.join("/")
  if (
    head === "components" ||
    head === "hooks" ||
    head === "lib" ||
    head === "examples"
  )
    return { root: webRoot, resolved: path.join(webRoot, file) }
  if (nativeRoots[head])
    return {
      root: nativeRoots[head],
      resolved: path.join(nativeRoots[head], tail),
    }
  if (stylings.has(head)) {
    const own = path.join(mobileRoot, file)
    return {
      root: mobileRoot,
      resolved: existsSync(own) ? own : path.join(mobileRoot, tail),
    }
  }
  return undefined
}

export function sourcePath(file: string) {
  const source = resolveSource(file)
  return source?.resolved.startsWith(`${source.root}${path.sep}`)
    ? source.resolved
    : undefined
}

function twinPath(file: string, base: string) {
  const resolved = sourcePath(file)
  if (!resolved?.startsWith(`${webRoot}${path.sep}`) || base === DEFAULT_BASE)
    return undefined
  const twin = path.join(
    webRoot,
    "bases",
    base,
    path.relative(webRoot, resolved)
  )
  return existsSync(twin) ? twin : undefined
}

export async function readSource(
  file: string,
  { icons = DEFAULT_ICONS, base = DEFAULT_BASE }: Partial<CodeOptions> = {}
) {
  const resolved = twinPath(file, base) ?? sourcePath(file)
  return resolved ? toIcons(await readFile(resolved, "utf8"), icons) : undefined
}

export type Variants = { icons: boolean; bases: string[] }

export async function sourceVariants(file: string): Promise<Variants> {
  const resolved = sourcePath(file)
  if (!resolved) return { icons: false, bases: [] }
  const bases = PRIMITIVE_BASES.filter((base) => twinPath(file, base))
  const sources = await Promise.all(
    [resolved, ...bases.map((base) => twinPath(file, base) ?? "")].map(
      (source) => readFile(source, "utf8")
    )
  )
  return { icons: sources.some(usesIconPlaceholders), bases }
}

export const exampleFile = (name: string) => `examples/${name}.tsx`

export async function exampleSource(name: string) {
  return (await readSource(exampleFile(name))) ?? ""
}

async function files(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true })
  const nested = await Promise.all(
    entries.map((entry) => {
      const full = path.join(directory, entry.name)
      return entry.isDirectory() ? files(full) : [full]
    })
  )
  return nested.flat()
}

export async function contentPages() {
  const pages = await files(path.join(process.cwd(), "content"))
  return Promise.all(
    pages
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => readFile(file, "utf8"))
  )
}

export async function sourceFiles() {
  "use cache"
  const found = new Set<string>()
  for (const page of await contentPages()) {
    for (const [, source] of page.matchAll(/<ComponentSource path="([^"]+)"/g))
      found.add(source)
    for (const [, type, name] of page.matchAll(
      /<ComponentPreview type="(chart|block)" name="([^"]+)"/g
    ))
      found.add(`components/${type}s/${name}.tsx`)
    for (const [, name] of page.matchAll(/<ComponentPreview name="([^"]+)"/g))
      found.add(exampleFile(name))
  }
  return [...found]
}

type Node =
  | { type: "text"; value: string }
  | {
      type: "element"
      tagName: string
      properties?: Record<string, unknown>
      children?: Node[]
    }
  | { type: string; children?: Node[] }

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")

function attribute(name: string, value: unknown) {
  const text = Array.isArray(value) ? value.join(" ") : String(value)
  return ` ${name === "className" ? "class" : name}="${escapeHtml(text)}"`
}

function toHtml(node: Node): string {
  if (node.type === "text" && "value" in node) return escapeHtml(node.value)
  const children = ("children" in node ? (node.children ?? []) : [])
    .map(toHtml)
    .join("")
  if (node.type !== "element" || !("tagName" in node)) return children
  const attributes = Object.entries(node.properties ?? {})
    .map(([name, value]) => attribute(name, value))
    .join("")
  return `<${node.tagName}${attributes}>${children}</${node.tagName}>`
}

function styleObject(style: unknown) {
  if (typeof style !== "string") return undefined
  return Object.fromEntries(
    style
      .split(";")
      .map((declaration) => declaration.split(":").map((part) => part.trim()))
      .filter(([property, value]) => property && value)
  ) as Record<string, string>
}

export type Highlighted = {
  className: string
  style?: Record<string, string>
  html: string
}

export async function highlightCode(
  code: string,
  lang: string
): Promise<Highlighted> {
  const root = await highlightHast(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: false,
    transformers: [tokenClasses],
  })
  const pre = root.children.find(
    (node) => node.type === "element" && node.tagName === "pre"
  )
  if (pre?.type !== "element") return { className: "", html: escapeHtml(code) }
  const className = pre.properties.className ?? pre.properties.class
  return {
    className: Array.isArray(className)
      ? className.join(" ")
      : String(className ?? ""),
    style: styleObject(pre.properties.style),
    html: pre.children.map((child) => toHtml(child as Node)).join(""),
  }
}
