import { readFile } from "node:fs/promises"
import path from "node:path"
import postcss from "postcss"
import { createStyleMap, transformDirection } from "shadcn/utils"

const ROOT = path.resolve(import.meta.dirname, "../..")
const STYLES = path.join(ROOT, "styles")

export const DEFAULT_STYLE = "suiss"
export const VENDOR_STYLES = [
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
const STRING = /(["'`])((?:\\.|(?!\1)[^\\])*)\1/g
const HAS_MARKER = /(?<![\w-])cn-[a-z0-9]/

export function stylePath(name) {
  return name === DEFAULT_STYLE
    ? path.join(STYLES, "style-suiss.css")
    : path.join(STYLES, "vendor", `style-${name}.css`)
}

async function logical(values) {
  const source = values.map((value) => `cn(${JSON.stringify(value)})`)
  const output = await transformDirection(source.join("\n"), true)
  return output.split("\n").map((line) => JSON.parse(line.slice(3, -1)))
}

async function logicalMap(map) {
  const keys = Object.keys(map)
  const values = await logical(keys.map((key) => map[key]))
  return Object.fromEntries(keys.map((key, index) => [key, values[index]]))
}

let cache

export async function loadStyleMaps() {
  cache ??= (async () => {
    const own = createStyleMap(await readFile(stylePath(DEFAULT_STYLE), "utf8"))
    const maps = { [DEFAULT_STYLE]: own }
    for (const name of VENDOR_STYLES) {
      const vendor = createStyleMap(await readFile(stylePath(name), "utf8"))
      maps[name] = { ...own, ...(await logicalMap(vendor)) }
    }
    return maps
  })()
  return cache
}

function expand(value, map, unknown) {
  return value.replace(MARKER, (marker) => {
    if (!(marker in map)) unknown.add(marker)
    return map[marker] ?? ""
  })
}

function tidy(value) {
  return value.replace(/ {2,}/g, " ").replace(/^ | $/g, "")
}

export function applyStyle(source, map) {
  const unknown = new Set()
  const output = source.replace(STRING, (literal, quote, body) => {
    if (!HAS_MARKER.test(body)) return literal
    return `${quote}${tidy(expand(body, map, unknown))}${quote}`
  })
  return { output, unknown: [...unknown] }
}

export function markersIn(source) {
  const found = new Set()
  for (const [, , body] of source.matchAll(STRING)) {
    for (const [marker] of body.matchAll(MARKER)) found.add(marker)
  }
  return [...found]
}

export async function styleSheet(name) {
  const own = postcss.parse(await readFile(stylePath(DEFAULT_STYLE), "utf8"))
  if (name === DEFAULT_STYLE) return own.toString()
  const vendor = postcss.parse(await readFile(stylePath(name), "utf8"))
  const scope = vendor.first
  const covered = new Set()
  scope.walkRules((rule) => {
    if (rule !== scope) covered.add(rule.selector)
  })
  own.first.each((node) => {
    if (node.type === "rule" && !covered.has(node.selector)) {
      scope.append(node.clone())
    }
  })
  const applies = []
  scope.walkAtRules("apply", (rule) => {
    applies.push(rule)
  })
  const values = await logical(applies.map((rule) => rule.params))
  applies.forEach((rule, index) => {
    rule.params = values[index]
  })
  return vendor.toString()
}
