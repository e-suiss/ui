import { createRegistry } from "./shared/registry.mjs"

export { resolveItems } from "./shared/registry.mjs"

export const { fetchText, fetchRegistry } = createRegistry({
  base: "https://raw.githubusercontent.com/e-suiss/ui/main/packages/web",
  env: "ESUISS_REGISTRY",
})

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
  },
  interaction: {
    kind: "interaction",
    label: "Interactions",
    command: "add interactions",
    example: "<name>",
  },
  chart: {
    kind: "chart",
    label: "Charts",
    command: "add charts",
    example: "<name>",
  },
  block: {
    kind: "block",
    label: "Blocks",
    command: "add blocks",
    example: "<name>",
  },
}

export function scopeOf(item) {
  return item.type in SCOPES ? item.type : "ui"
}

export function fetchStylesheet(registry) {
  return fetchText(registry.stylesheet)
}
