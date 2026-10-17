import { readFile } from "node:fs/promises"
import path from "node:path"
import postcss from "postcss"
import { createStyleMap, transformDirection } from "shadcn/utils"
import ts from "typescript"

const ROOT = import.meta.dirname
  ? path.resolve(import.meta.dirname, "../..")
  : path.resolve(process.cwd(), "../../packages/web")
const STYLES = path.join(ROOT, "styles")

export const DEFAULT_STYLE = "suiss"
const VENDOR_STYLES = [
  "vega",
  "nova",
  "maia",
  "lyra",
  "mira",
  "luma",
  "sera",
  "rhea",
]
export const STYLE_NAMES = [DEFAULT_STYLE, ...VENDOR_STYLES]

const MARKER = /(?<![\w-])cn-[a-z0-9]+(?:-[a-z0-9]+)*(?![\w-])/g
const CLIENT_MARKERS = new Set([
  "cn-font-heading",
  "cn-menu-target",
  "cn-menu-translucent",
])

function hasStyleMarker(value) {
  for (const [marker] of value.matchAll(MARKER)) {
    if (!CLIENT_MARKERS.has(marker)) return true
  }
  return false
}

function stylePath(name) {
  return name === DEFAULT_STYLE
    ? path.join(STYLES, "style-suiss.css")
    : path.join(STYLES, "vendor", `style-${name}.css`)
}

async function logical(values) {
  const source = values.map((value) => `cva(${JSON.stringify(value)})`)
  const output = await transformDirection(source.join("\n"), true)
  return output.split("\n").map((line) => JSON.parse(line.slice(4, -1)))
}

async function logicalMap(map) {
  const keys = Object.keys(map)
  const values = await logical(keys.map((key) => map[key]))
  return Object.fromEntries(keys.map((key, index) => [key, values[index]]))
}

async function buildStyleMaps() {
  const own = createStyleMap(await readFile(stylePath(DEFAULT_STYLE), "utf8"))
  const maps = { [DEFAULT_STYLE]: own }
  for (const name of VENDOR_STYLES) {
    const vendor = createStyleMap(await readFile(stylePath(name), "utf8"))
    maps[name] = { ...own, ...(await logicalMap(vendor)) }
  }
  return maps
}

let cache

export function loadStyleMaps() {
  cache ??= buildStyleMaps()
  return cache
}

function expand(value, map, unknown) {
  return value.replace(MARKER, (marker) => {
    if (CLIENT_MARKERS.has(marker)) return marker
    if (!(marker in map)) unknown.add(marker)
    return map[marker] ?? ""
  })
}

function tidy(value, edges) {
  const collapsed = value.replace(/ {2,}/g, " ")
  return edges ? collapsed.trim() : collapsed
}

const LITERALS = new Map([
  [ts.SyntaxKind.StringLiteral, [1, 1, true]],
  [ts.SyntaxKind.NoSubstitutionTemplateLiteral, [1, 1, true]],
  [ts.SyntaxKind.TemplateHead, [1, 2, false]],
  [ts.SyntaxKind.TemplateMiddle, [1, 2, false]],
  [ts.SyntaxKind.TemplateTail, [1, 1, false]],
])

function literalRanges(source, fileName) {
  const file = ts.createSourceFile(
    fileName,
    source,
    ts.ScriptTarget.Latest,
    true,
    fileName.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS
  )
  const ranges = []
  const visit = (node) => {
    const shape = LITERALS.get(node.kind)
    if (shape) {
      const [head, tail, edges] = shape
      const from = node.getStart(file) + head
      const to = node.getEnd() - tail
      if (hasStyleMarker(source.slice(from, to))) {
        ranges.push({ from, to, edges })
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(file)
  return ranges
}

export function applyStyle(source, map, fileName = "file.tsx") {
  const unknown = new Set()
  let output = ""
  let cursor = 0
  for (const { from, to, edges } of literalRanges(source, fileName)) {
    output += source.slice(cursor, from)
    output += tidy(expand(source.slice(from, to), map, unknown), edges)
    cursor = to
  }
  output += source.slice(cursor)
  return { output, unknown: [...unknown] }
}

export function markersIn(source, fileName = "file.tsx") {
  const found = new Set()
  for (const { from, to } of literalRanges(source, fileName)) {
    for (const [marker] of source.slice(from, to).matchAll(MARKER)) {
      if (!CLIENT_MARKERS.has(marker)) found.add(marker)
    }
  }
  return [...found]
}

const TRANSLUCENT = /^\.cn-menu-translucent(-aria)?$/
const TRANSLUCENT_SOURCE = "vega"

function scopeTranslucent(scope) {
  scope.walkRules(TRANSLUCENT, (rule) => {
    rule.selector = `&[data-menu-translucent] ${rule.selector}, [data-menu-translucent] ${rule.selector}`
  })
}

async function parseStyle(name) {
  return postcss.parse(await readFile(stylePath(name), "utf8"))
}

export async function styleSheet(name) {
  const own = await parseStyle(DEFAULT_STYLE)
  const sheet = name === DEFAULT_STYLE ? own : await parseStyle(name)
  const scope = sheet.first
  const covered = new Set()
  scope.walkRules((rule) => {
    if (rule !== scope) covered.add(rule.selector)
  })
  const fallbacks =
    name === DEFAULT_STYLE
      ? (await parseStyle(TRANSLUCENT_SOURCE)).first
      : own.first
  fallbacks.each((node) => {
    if (node.type !== "rule" || covered.has(node.selector)) return
    if (name === DEFAULT_STYLE && !TRANSLUCENT.test(node.selector)) return
    scope.append(node.clone())
  })
  scopeTranslucent(scope)
  const applies = []
  scope.walkAtRules("apply", (rule) => {
    applies.push(rule)
  })
  const values = await logical(applies.map((rule) => rule.params))
  applies.forEach((rule, index) => {
    rule.params = values[index]
  })
  return sheet.toString()
}
