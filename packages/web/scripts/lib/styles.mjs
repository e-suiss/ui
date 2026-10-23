import { existsSync } from "node:fs"
import { readFile } from "node:fs/promises"
import path from "node:path"
import postcss from "postcss"
import { createStyleMap, transformDirection } from "shadcn/utils"
import ts from "typescript"

import {
  composeStyleMap,
  expandMarkers,
  styleMarkers,
} from "../../../cli/lib/styles.mjs"

const ROOT = import.meta.dirname
  ? path.resolve(import.meta.dirname, "../..")
  : path.resolve(process.cwd(), "../../packages/web")
const STYLES = path.join(ROOT, "styles")

export { DEFAULT_STYLE, STYLE_NAMES } from "../../../cli/lib/styles.mjs"

import { DEFAULT_STYLE, STYLE_NAMES } from "../../../cli/lib/styles.mjs"

const VENDOR_STYLES = STYLE_NAMES.filter((name) => name !== DEFAULT_STYLE)
const DEFAULT_BASE = "base"
export const TWIN_BASES = ["radix", "aria"]

function hasStyleMarker(value) {
  return styleMarkers(value).length > 0
}

function stylePath(name) {
  return name === DEFAULT_STYLE
    ? path.join(STYLES, "style-suiss.css")
    : path.join(STYLES, "vendor", `style-${name}.css`)
}

function overridePath(base) {
  return path.join(STYLES, `style-suiss-${base}.css`)
}

const MARK = /^\s*MARK: (.+?)\s*$/

function lastRules(scope) {
  const last = new Map()
  let component = ""
  scope.each((node) => {
    if (node.type === "comment") component = node.text.match(MARK)?.[1] ?? ""
    if (node.type === "rule") last.set(component, node)
  })
  return last
}

async function ownSheet(base) {
  const sheet = postcss.parse(await readFile(stylePath(DEFAULT_STYLE), "utf8"))
  if (base === DEFAULT_BASE || !existsSync(overridePath(base))) return sheet
  const overrides = postcss.parse(await readFile(overridePath(base), "utf8"))
  const scope = sheet.first
  const rules = new Map()
  scope.each((node) => {
    if (node.type === "rule") rules.set(node.selector, node)
  })
  const last = lastRules(scope)
  let component = ""
  overrides.first.each((node) => {
    if (node.type === "comment") component = node.text.match(MARK)?.[1] ?? ""
    if (node.type !== "rule") return
    const current = rules.get(node.selector)
    if (current) {
      current.removeAll()
      current.append(node.clone().nodes)
      return
    }
    const clone = node.clone()
    const anchor = last.get(component)
    if (anchor) anchor.after(clone)
    else scope.append(clone)
    last.set(component, clone)
  })
  return sheet
}

const MEASURED = /--[\w-]*-(?:left|right)\b/
const KEPT = /\bkeptphysical(\d+)\b/g

async function logical(values) {
  const kept = []
  const masked = values.map((value) =>
    value
      .split(" ")
      .map((token) => {
        if (!MEASURED.test(token)) return token
        kept.push(token)
        return `keptphysical${kept.length - 1}`
      })
      .join(" ")
  )
  const source = masked.map((value) => `cva(${JSON.stringify(value)})`)
  const output = await transformDirection(source.join("\n"), true)
  return output
    .split("\n")
    .map((line) =>
      JSON.parse(line.slice(4, -1)).replace(KEPT, (_, index) => kept[index])
    )
}

async function logicalMap(map) {
  const keys = Object.keys(map)
  const values = await logical(keys.map((key) => map[key]))
  return Object.fromEntries(keys.map((key, index) => [key, values[index]]))
}

const EMPTY_RULE = /^\.(cn-[a-z0-9-]+)$/

function declared(css) {
  const markers = {}
  postcss.parse(css).walkRules(EMPTY_RULE, (rule) => {
    if (!rule.nodes?.length) markers[rule.selector.slice(1)] = ""
  })
  return markers
}

let structuralCache

function structural() {
  structuralCache ??= readFile(path.join(STYLES, "structural.json"), "utf8")
    .then(JSON.parse)
    .catch(() => ({}))
  return structuralCache
}

async function withStructural(map) {
  const carried = await structural()
  return Object.fromEntries(
    Object.entries(map).map(([marker, value]) => [
      marker,
      carried[marker] ? `${carried[marker]} ${value}`.trim() : value,
    ])
  )
}

function ownMap(css) {
  return { ...declared(css), ...createStyleMap(css) }
}

async function buildStyleData() {
  const suiss = ownMap(await readFile(stylePath(DEFAULT_STYLE), "utf8"))
  const overrides = {}
  for (const base of TWIN_BASES) {
    if (existsSync(overridePath(base))) {
      overrides[base] = ownMap(await readFile(overridePath(base), "utf8"))
    }
  }
  const vendors = {}
  for (const name of VENDOR_STYLES) {
    const vendor = createStyleMap(await readFile(stylePath(name), "utf8"))
    const map = await withStructural(await logicalMap(vendor))
    if (map["cn-drawer-popup"]) {
      map["cn-drawer-popup"] = floatingCorners(map["cn-drawer-popup"])
    }
    vendors[name] = map
  }
  const known = [
    ...new Set(Object.values(vendors).flatMap((map) => Object.keys(map))),
  ].sort()
  return { known, suiss, overrides, vendors }
}

let data

export function loadStyleData() {
  data ??= buildStyleData()
  return data
}

export async function loadStyleMaps(base = DEFAULT_BASE) {
  const styles = await loadStyleData()
  return Object.fromEntries(
    STYLE_NAMES.map((style) => [style, composeStyleMap(styles, base, style)])
  )
}

const LITERALS = new Map([
  [ts.SyntaxKind.StringLiteral, [1, 1]],
  [ts.SyntaxKind.NoSubstitutionTemplateLiteral, [1, 1]],
  [ts.SyntaxKind.TemplateHead, [1, 2]],
  [ts.SyntaxKind.TemplateMiddle, [1, 2]],
  [ts.SyntaxKind.TemplateTail, [1, 1]],
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
      const [head, tail] = shape
      const from = node.getStart(file) + head
      const to = node.getEnd() - tail
      if (hasStyleMarker(source.slice(from, to))) {
        ranges.push({ from, to })
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
  for (const { from, to } of literalRanges(source, fileName)) {
    output += source.slice(cursor, from)
    output += expandMarkers(source.slice(from, to), map, unknown)
    cursor = to
  }
  output += source.slice(cursor)
  return { output, unknown: [...unknown] }
}

export function markersIn(source, fileName = "file.tsx") {
  const found = new Set()
  for (const { from, to } of literalRanges(source, fileName)) {
    for (const marker of styleMarkers(source.slice(from, to))) found.add(marker)
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

const EDGE_RADIUS =
  /(?:^|\s)data-\[swipe-direction=down\]:rounded(?:-t)?(-[^\s-][^\s]*)?(?=\s|$)/

function floatingCorners(classes) {
  const radius = classes.match(EDGE_RADIUS)
  return radius ? `${classes} data-floating:rounded${radius[1] ?? ""}` : classes
}

function floatAllCorners(scope) {
  scope.walkRules(".cn-drawer-popup", (rule) => {
    rule.walkAtRules("apply", (apply) => {
      apply.params = floatingCorners(apply.params)
    })
  })
}

async function parseStyle(name) {
  return postcss.parse(await readFile(stylePath(name), "utf8"))
}

export async function styleSheet(name, base = DEFAULT_BASE) {
  const own = await ownSheet(base)
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
  if (name !== DEFAULT_STYLE) {
    const carried = await structural()
    scope.each((node) => {
      if (node.type !== "rule" || !covered.has(node.selector)) return
      const marker = node.selector.slice(1)
      if (!carried[marker]) return
      const apply = node.nodes?.find(
        (child) => child.type === "atrule" && child.name === "apply"
      )
      if (apply) apply.params = `${carried[marker]} ${apply.params}`
      else node.append({ name: "apply", params: carried[marker] })
    })
  }
  scopeTranslucent(scope)
  floatAllCorners(scope)
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
