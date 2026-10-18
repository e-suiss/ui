import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"

const TOP = "__top"
const DEFAULT = "default"
const OPEN = /^<Only platform="([^"]+)">$/
const CLOSE = "</Only>"
const HEADING = /^#{2,4} (.+)$/
const PREVIEW_TAG = /<ComponentPreview\b([^>]*?)\/>/g
const NATIVE_TAG = /<NativeExample\b[^>]*\bid="([^"]+)"/g
const RESPONSIVE = /\bresponsive\b/

const HEADING_ALIASES = {
  "components-combobox--with-clear": "with clear button",
  "components-drawer--snap-points": "with snap points",
  "components-drawer--sides": "directions",
  "components-slider--step": "steps",
  "components-widget--auto": "auto resize",
}

const attribute = (tag, name) =>
  tag.match(new RegExp(`\\b${name}="([^"]+)"`))?.[1]

function pages(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) return pages(file)
    return entry.name.endsWith(".mdx") ? [file] : []
  })
}

function mapPage(source, found) {
  const web = new Map()
  const native = []
  let region
  let depth = 0
  let heading = TOP
  for (const raw of source.split("\n")) {
    const line = raw.trim()
    const open = line.match(OPEN)
    if (open) {
      if (depth === 0) {
        const platforms = open[1] ?? ""
        if (platforms === "web") region = "web"
        else region = platforms.includes("rn") ? "native" : undefined
        heading = TOP
      }
      depth++
      continue
    }
    if (line === CLOSE) {
      depth--
      if (depth === 0) region = undefined
      continue
    }
    const title = raw.match(HEADING)?.[1]
    if (title) {
      heading = title.trim().toLowerCase()
      continue
    }
    if (region === "web") {
      for (const [, tag = ""] of raw.matchAll(PREVIEW_TAG)) {
        const name = attribute(tag, "name")
        if (!name || web.has(heading)) continue
        const type = attribute(tag, "type") ?? "example"
        web.set(heading, {
          name,
          type,
          layout: attribute(tag, "layout") ?? "centered",
          responsive: RESPONSIVE.test(tag) || type === "block",
        })
      }
    } else if (region === "native") {
      for (const [, id = ""] of raw.matchAll(NATIVE_TAG)) {
        native.push([heading, id])
      }
    }
  }
  for (const [heading, id] of native) {
    const alias = HEADING_ALIASES[id]
    const key =
      alias ?? (heading === DEFAULT && !web.has(DEFAULT) ? TOP : heading)
    const preview = web.get(key)
    if (preview) found.set(id, preview)
  }
}

export function nativeWebPreviews(content) {
  const found = new Map()
  const native = new Set()
  for (const file of pages(content)) {
    const source = readFileSync(file, "utf8")
    for (const [, id = ""] of source.matchAll(NATIVE_TAG)) native.add(id)
    mapPage(source, found)
  }
  return {
    web: found,
    nativeOnly: [...native].filter((id) => !found.has(id)).sort(),
  }
}
