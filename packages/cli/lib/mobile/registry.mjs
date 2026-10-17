import { CliError } from "../output.mjs"
import {
  createRegistry,
  resolveItems as orderItems,
} from "../shared/registry.mjs"
import { DEFAULT_STYLE } from "../shared/style.mjs"

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

export function presetFile(registry, kind, style = DEFAULT_STYLE) {
  if (style === DEFAULT_STYLE) return null
  const file = registry.presets?.[style]?.[kind]
  if (!file) {
    throw new CliError(
      `This version of the registry has no ${style} style. Update @esuiss/ui or leave out --style.`
    )
  }
  return file
}

export function fetchStylesheet(registry, styling, style) {
  const preset = styling === "uniwind" && presetFile(registry, styling, style)
  return fetchText(preset || registry.styles[styling].stylesheet)
}

export function sourceOf(registry, item, file, styling) {
  const { directory } = registry.styles[styling]
  return directory && item.overrides?.includes(styling)
    ? `${directory}/${file}`
    : file
}
