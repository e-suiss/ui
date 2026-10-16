import { CliError } from "../output.mjs"
import {
  createRegistry,
  resolveItems as orderItems,
} from "../shared/registry.mjs"

export const { fetchText, fetchRegistry } = createRegistry({
  base: "https://raw.githubusercontent.com/e-suiss/ui/{ref}/packages/mobile",
  env: "ESUISS_MOBILE_REGISTRY",
})

export function resolveItems(registry, names) {
  const known = new Set(registry.items.map((item) => item.name))
  const unknown = names.filter((name) => !known.has(name))
  if (unknown.length) {
    throw new CliError(
      `Unknown component: ${unknown.join(", ")}.\nAvailable: ${[...known].join(", ")}`
    )
  }
  return orderItems(registry, names)
}

export function fetchStylesheet(registry, styling) {
  return fetchText(registry.styles[styling].stylesheet)
}

export function sourceOf(registry, item, file, styling) {
  const { directory } = registry.styles[styling]
  return directory && item.overrides?.includes(styling)
    ? `${directory}/${file}`
    : file
}
