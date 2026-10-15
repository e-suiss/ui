import { createRegistry } from "./shared/registry.mjs"

export { resolveItems } from "./shared/registry.mjs"

const NAMESPACE = "@esuiss/"
const STYLESHEET = "styles/globals.css"

const registry = createRegistry({
  base: "https://raw.githubusercontent.com/e-suiss/ui/main/packages/web",
  env: "ESUISS_REGISTRY",
  index: "registry/registry.json",
})

export const { fetchText } = registry

export const SCOPES = {
  ui: {
    kind: "component",
    label: "Components",
    command: "add",
    example: "button",
  },
  pattern: {
    kind: "pattern",
    label: "Patterns",
    command: "add patterns",
    example: "<name>",
    directory: "components/patterns/",
  },
  interaction: {
    kind: "interaction",
    label: "Interactions",
    command: "add interactions",
    example: "<name>",
    directory: "components/interactions/",
  },
  chart: {
    kind: "chart",
    label: "Charts",
    command: "add charts",
    example: "<name>",
    directory: "components/charts/",
  },
  block: {
    kind: "block",
    label: "Blocks",
    command: "add blocks",
    example: "<name>",
    directory: "components/blocks/",
  },
}

function scopeOfFile(file = "") {
  const entry = Object.entries(SCOPES).find(
    ([, { directory }]) => directory && file.startsWith(directory)
  )
  return entry ? entry[0] : "ui"
}

function toItem(item) {
  const files = item.files.map((file) => file.path)
  return {
    name: item.name,
    scope: scopeOfFile(files[0]),
    requires: (item.registryDependencies ?? []).map((name) =>
      name.startsWith(NAMESPACE) ? name.slice(NAMESPACE.length) : name
    ),
    dependencies: item.dependencies ?? [],
    files,
    ...(item.css && { css: item.css }),
    ...(item.meta?.optIn && { optIn: true }),
  }
}

export async function fetchRegistry() {
  const { items } = await registry.fetchRegistry()
  return { items: items.filter((item) => item.files?.length).map(toItem) }
}

export function scopeOf(item) {
  return item.scope ?? "ui"
}

export function fetchStylesheet() {
  return fetchText(STYLESHEET)
}

function cssBlock(selector, body, indent) {
  const inner = Object.entries(body).map(([key, value]) =>
    typeof value === "string"
      ? `${indent}  ${key}: ${value};`
      : cssBlock(key, value, `${indent}  `)
  )
  return inner.length
    ? `${indent}${selector} {\n${inner.join("\n")}\n${indent}}`
    : `${indent}${selector};`
}

export function toCss(css) {
  return Object.entries(css).map(([selector, body]) =>
    cssBlock(selector, body, "")
  )
}
