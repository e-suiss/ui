import { existsSync } from "node:fs"
import { readFile, writeFile } from "node:fs/promises"
import path from "node:path"

const ROOT = path.resolve(import.meta.dirname, "..")
const OUTPUT = path.join(ROOT, "../tokens/styles.json")
const VENDOR = path.join(ROOT, "../web/styles/vendor")
const UPSTREAM =
  "https://raw.githubusercontent.com/shadcn-ui/ui/d2fba50ee5b9/apps/v4/registry/styles"

export const STYLES = [
  "vega",
  "nova",
  "maia",
  "lyra",
  "mira",
  "luma",
  "sera",
  "rhea",
]

const WHITESPACE = /\s+/
const RULE = /\.(cn-[a-z0-9-]+) \{\s*@apply ([^;]*);/g
const SCALE = { sm: 6, md: 8, lg: 10, xl: 14, "2xl": 18, "3xl": 22, "4xl": 26 }
const ROUNDED = /^rounded(?:-(.+))?$/
const ARBITRARY = /^\[(.+)\]$/
const MIN_RADIUS = /^min\(var\(--radius-([\w]+)\),(\d+)px\)$/
const PIXELS = /^(\d+(?:\.\d+)?)px$/
const SPACING = (prefix) => new RegExp(`^${prefix}-(\\d+(?:\\.\\d+)?)$`)
const WEIGHT = /^font-(normal|medium|semibold|bold)$/
const SHADOW = /^shadow-(xs|sm|md|lg|xl|2xl)$/

const SUISS = {
  radius: {
    button: 9999,
    input: 10,
    textarea: 12,
    card: 18,
    dialog: 18,
    popover: 18,
    menu: 12,
    "menu-item": 8,
    badge: 9999,
    checkbox: 4,
    tabs: 12,
    "tabs-trigger": 8,
    toggle: 10,
    alert: 18,
    item: 12,
  },
  height: {
    "button-xs": 24,
    "button-sm": 32,
    button: 36,
    "button-lg": 44,
    input: 44,
  },
  "padding-x": {
    "button-xs": 11,
    "button-sm": 12,
    button: 16,
    "button-lg": 22,
    input: 12,
    "menu-item": 12,
  },
  "padding-y": { "menu-item": 8 },
  padding: { dialog: 24, popover: 16, menu: 6 },
  "font-weight": { button: "normal", title: "semibold" },
  shadow: { card: "md", dialog: "xl", popover: "lg", menu: "lg" },
}

const SOURCES = {
  radius: {
    button: "cn-button",
    input: "cn-input",
    textarea: "cn-textarea",
    card: "cn-card",
    dialog: "cn-dialog-content",
    popover: "cn-popover-content",
    menu: "cn-dropdown-menu-content",
    "menu-item": "cn-dropdown-menu-item",
    badge: "cn-badge",
    checkbox: "cn-checkbox",
    tabs: "cn-tabs-list",
    "tabs-trigger": "cn-tabs-trigger",
    toggle: "cn-toggle",
    alert: "cn-alert",
    item: "cn-item",
  },
  height: {
    "button-xs": "cn-button-size-xs",
    "button-sm": "cn-button-size-sm",
    button: "cn-button-size-default",
    "button-lg": "cn-button-size-lg",
    input: "cn-input",
  },
  "padding-x": {
    "button-xs": "cn-button-size-xs",
    "button-sm": "cn-button-size-sm",
    button: "cn-button-size-default",
    "button-lg": "cn-button-size-lg",
    input: "cn-input",
    "menu-item": "cn-dropdown-menu-item",
  },
  "padding-y": { "menu-item": "cn-dropdown-menu-item" },
  padding: {
    dialog: "cn-dialog-content",
    popover: "cn-popover-content",
    menu: "cn-dropdown-menu-content",
  },
  "font-weight": { button: "cn-button", title: "cn-card-title" },
  shadow: {
    card: "cn-card",
    dialog: "cn-dialog-content",
    popover: "cn-popover-content",
    menu: "cn-dropdown-menu-content",
  },
}

function radius(classes, fallback) {
  let value = fallback
  for (const name of classes) {
    const match = name.match(ROUNDED)
    if (!match) continue
    const size = match[1]
    if (size === undefined) value = 4
    else if (size === "none") value = 0
    else if (size === "full") value = 9999
    else if (size in SCALE) value = SCALE[size]
    else {
      const inner = size.match(ARBITRARY)?.[1] ?? ""
      const capped = inner.match(MIN_RADIUS)
      const pixels = inner.match(PIXELS)
      if (capped) value = Math.min(SCALE[capped[1]], Number(capped[2]))
      else if (pixels) value = Number(pixels[1])
    }
  }
  return value
}

function spacing(classes, prefixes, fallback) {
  let value = fallback
  for (const name of classes) {
    for (const prefix of prefixes) {
      const match = name.match(SPACING(prefix))
      if (match) value = Number(match[1]) * 4
    }
  }
  return value
}

function last(classes, pattern, fallback) {
  let value = fallback
  for (const name of classes) {
    const match = name.match(pattern)
    if (match) value = match[1]
  }
  return value
}

function plain(rule) {
  return (rule ?? "")
    .split(WHITESPACE)
    .filter((name) => name && !name.includes(":"))
}

const EXTRACT = {
  radius: (classes) => radius(classes, 0),
  height: (classes, fallback) => spacing(classes, ["h"], fallback),
  "padding-x": (classes, fallback) => spacing(classes, ["px", "p"], fallback),
  "padding-y": (classes, fallback) => spacing(classes, ["py", "p"], fallback),
  padding: (classes) => spacing(classes, ["p"], 0),
  "font-weight": (classes) => last(classes, WEIGHT, "normal"),
  shadow: (classes) => last(classes, SHADOW, "none"),
}

async function stylesheet(name) {
  const local = path.join(VENDOR, `style-${name}.css`)
  if (existsSync(local)) return readFile(local, "utf8")
  const response = await fetch(`${UPSTREAM}/style-${name}.css`)
  if (!response.ok) throw new Error(`Could not download style-${name}.css`)
  return response.text()
}

async function derive(name) {
  const rules = Object.fromEntries(
    [...(await stylesheet(name)).matchAll(RULE)].map((match) => [
      match[1],
      match[2],
    ])
  )
  return Object.fromEntries(
    Object.entries(SOURCES).map(([group, keys]) => [
      group,
      Object.fromEntries(
        Object.entries(keys).map(([key, marker]) => [
          key,
          EXTRACT[group](plain(rules[marker]), SUISS[group][key]),
        ])
      ),
    ])
  )
}

const styles = { suiss: SUISS }
for (const name of STYLES) styles[name] = await derive(name)
await writeFile(OUTPUT, `${JSON.stringify(styles, null, 2)}\n`)
console.log(`Wrote ${path.relative(process.cwd(), OUTPUT)}`)
