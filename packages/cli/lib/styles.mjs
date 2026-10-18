export const DEFAULT_STYLE = "suiss"

export const STYLE_NAMES = [
  DEFAULT_STYLE,
  "vega",
  "nova",
  "maia",
  "lyra",
  "mira",
  "luma",
  "sera",
  "rhea",
]

const MARKER = /(?<![\w-])cn-[a-z0-9]+(?:-[a-z0-9]+)*(?![\w-])/g
const CLIENT_MARKERS = new Set([
  "cn-font-heading",
  "cn-menu-target",
  "cn-menu-translucent",
  "cn-menu-translucent-aria",
])

function isStyleMarker(marker) {
  return !CLIENT_MARKERS.has(marker)
}

export function styleMarkers(text) {
  return [...text.matchAll(MARKER)]
    .map(([marker]) => marker)
    .filter(isStyleMarker)
}

export function expandMarkers(text, map, unknown = new Set()) {
  let output = ""
  let cursor = 0
  for (const match of text.matchAll(MARKER)) {
    const [marker] = match
    const start = match.index
    let end = start + marker.length
    let value = marker
    if (isStyleMarker(marker)) {
      if (!(marker in map)) unknown.add(marker)
      value = map[marker] ?? ""
    }
    output += text.slice(cursor, start)
    if (value === "") {
      if (text[end] === " ") end++
      else if (output.endsWith(" ")) output = output.slice(0, -1)
    }
    output += value
    cursor = end
  }
  return output + text.slice(cursor)
}

const TRANSLUCENT =
  "animate-none! relative bg-popover/70! before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150 **:data-[slot$=-item]:focus:bg-foreground/10 **:data-[slot$=-item]:data-highlighted:bg-foreground/10 **:data-[slot$=-separator]:bg-foreground/5 **:data-[slot$=-trigger]:focus:bg-foreground/10 **:data-[slot$=-trigger]:aria-expanded:bg-foreground/10! **:data-[variant=destructive]:focus:bg-foreground/10! **:data-[variant=destructive]:text-accent-foreground! **:data-[variant=destructive]:**:text-accent-foreground!"

const TRANSLUCENT_ARIA = "**:data-[slot$=-item]:data-focused:bg-foreground/10"

export const BOLD_ACCENT =
  "[--accent:var(--primary)]! [--accent-foreground:var(--primary-foreground)]!"

function replaceMarkers(text, values) {
  let output = ""
  let cursor = 0
  for (const match of text.matchAll(MARKER)) {
    const [marker] = match
    if (!(marker in values)) continue
    const start = match.index
    let end = start + marker.length
    const value = values[marker]
    output += text.slice(cursor, start)
    if (value === "") {
      if (text[end] === " ") end++
      else if (output.endsWith(" ")) output = output.slice(0, -1)
    }
    output += value
    cursor = end
  }
  return output + text.slice(cursor)
}

export function applyMenuColor(
  source,
  menuColor = "default",
  menuAccent = "subtle"
) {
  const translucent = menuColor.endsWith("translucent")
  const target = [
    menuColor.startsWith("inverted") ? "dark" : "",
    menuAccent === "bold" ? BOLD_ACCENT : "",
  ]
    .filter(Boolean)
    .join(" ")
  return replaceMarkers(source, {
    "cn-menu-target": target,
    "cn-menu-translucent": translucent ? TRANSLUCENT : "",
    "cn-menu-translucent-aria": translucent ? TRANSLUCENT_ARIA : "",
    "cn-font-heading": "",
  })
}

export function composeStyleMap(data, base, style) {
  const known = Object.fromEntries(data.known.map((marker) => [marker, ""]))
  return {
    ...known,
    ...data.suiss,
    ...(data.overrides[base] ?? {}),
    ...(style === DEFAULT_STYLE ? {} : (data.vendors[style] ?? {})),
  }
}

export function applyStyleMap(source, map) {
  const unknown = new Set()
  const output = expandMarkers(source, map, unknown)
  return { output, unknown: [...unknown] }
}
