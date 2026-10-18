import { withPrimary } from "./color.mjs"
import { RADIUS_VALUES } from "./preset.mjs"
import { fetchThemes } from "./registry.mjs"
import { paletteOf } from "./shared/style.mjs"

export const POINTER_CSS = `@layer base {
  button:not(:disabled),
  [role="button"]:not([aria-disabled="true"]) {
    cursor: pointer;
  }
}
`

const ROOT_BLOCK = /(:root\s*\{)([\s\S]*?)(\n\})/
const DARK_BLOCK = /(\.dark\s*\{)([\s\S]*?)(\n\})/
const VARIABLE = /--([\w-]+):\s*([^;]+);/g
const MODES = ["light", "dark"]

export function withPointer(css) {
  if (css.includes(POINTER_CSS.trim())) return css
  return `${css.trimEnd()}\n\n${POINTER_CSS}`
}

function withVariables(block, variables) {
  return Object.entries(variables).reduce(
    (text, [name, value]) =>
      text.replace(new RegExp(`(--${name}:\\s*)[^;]+;`), `$1${value};`),
    block
  )
}

function variablesOf(css, pattern) {
  const body = css.match(pattern)?.[2] ?? ""
  return Object.fromEntries(
    [...body.matchAll(VARIABLE)].map(([, name, value]) => [name, value.trim()])
  )
}

export function themeDefaults(css) {
  return {
    light: variablesOf(css, ROOT_BLOCK),
    dark: variablesOf(css, DARK_BLOCK),
  }
}

export function withTheme(css, { light = {}, dark = {} }) {
  return css
    .replace(ROOT_BLOCK, (_, head, body, tail) =>
      [head, withVariables(body, light), tail].join("")
    )
    .replace(DARK_BLOCK, (_, head, body, tail) =>
      [head, withVariables(body, dark), tail].join("")
    )
}

export function applyPreset(css, preset, palette) {
  const radius = preset ? RADIUS_VALUES[preset.radius] : undefined
  return withTheme(css, {
    light: { ...(palette?.light ?? {}), ...(radius ? { radius } : {}) },
    dark: palette?.dark ?? {},
  })
}

export async function presetPalette(options, preset) {
  const palette = preset
    ? paletteOf(await fetchThemes(), preset, options)
    : null
  const filled = MODES.some((mode) => Object.keys(palette?.[mode] ?? {}).length)
  return withPrimary(filled ? palette : null, options.primary)
}
