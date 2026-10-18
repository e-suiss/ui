import { CliError } from "../output.mjs"
import { checkStylesheet } from "../registry.mjs"
import {
  createRegistry,
  resolveItems as orderItems,
} from "../shared/registry.mjs"
import { DEFAULT_STYLE } from "../shared/style.mjs"
import { keepTheme } from "./theme.mjs"

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

export async function fetchStylesheet(registry, styling, style) {
  const preset = styling === "uniwind" && presetFile(registry, styling, style)
  const file = preset || registry.styles[styling].stylesheet
  return checkStylesheet(await fetchText(file), file)
}

export function sourceOf(registry, item, file, styling) {
  const { directory } = registry.styles[styling]
  return directory && item.overrides?.includes(styling)
    ? `${directory}/${file}`
    : file
}

function comparable(candidate, current, format) {
  return format ? keepTheme(candidate, current, candidate, format) : candidate
}

function missingLines(candidate, current) {
  const lines = new Set(candidate.split("\n").map((line) => line.trim()))
  return current
    .split("\n")
    .filter((line) => line.trim() && !lines.has(line.trim())).length
}

export async function detectStyle(registry, kind, fallback, current, format) {
  const styles = [
    DEFAULT_STYLE,
    ...Object.keys(registry.presets ?? {}).filter(
      (style) => registry.presets[style]?.[kind]
    ),
  ]
  const scored = await Promise.all(
    styles.map(async (style) => ({
      style,
      score: missingLines(
        comparable(
          await fetchText(presetFile(registry, kind, style) ?? fallback),
          current,
          format
        ),
        current
      ),
    }))
  )
  return scored.reduce((best, entry) =>
    entry.score < best.score ? entry : best
  ).style
}
