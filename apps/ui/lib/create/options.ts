import {
  decodePreset,
  encodePreset,
  isPresetCode,
  PRESET_BASE_COLORS,
  PRESET_FONTS,
  PRESET_ICON_LIBRARIES,
  PRESET_MENU_ACCENTS,
  PRESET_MENU_COLORS,
  PRESET_RADII,
  PRESET_THEMES,
  type PresetConfig,
} from "shadcn/preset"
import { STYLES, type StyleName } from "@/lib/code-options"
import { foregroundFor, oklchString, parseColor } from "@/lib/create/color"
import type { PackageManager } from "@/lib/package-managers"
import fonts from "../../../../packages/cli/lib/fonts.json"
import themes from "../../../../packages/web/registry/themes.json"

export const OWN = "suiss"

export const PLATFORMS = [
  { value: "web", label: "React" },
  { value: "rn", label: "Expo / React Native" },
  { value: "swift", label: "SwiftUI" },
  { value: "kotlin", label: "Jetpack Compose" },
] as const

type Platform = (typeof PLATFORMS)[number]["value"]

export const PRIMITIVE_BASES = ["base", "radix", "aria"] as const

type Base = (typeof PRIMITIVE_BASES)[number]

const RADII: Record<string, string> = {
  default: "",
  none: "0",
  small: "0.45rem",
  medium: "0.625rem",
  large: "0.875rem",
}

type Palette = { name: string; light: object; dark: object }

const hasPalette = (name: string) =>
  (themes as Palette[]).some((theme) => theme.name === name)

export const BASE_COLORS = [OWN, ...PRESET_BASE_COLORS.filter(hasPalette)]
const THEMES = [OWN, ...PRESET_THEMES.filter(hasPalette)]
export const FONTS = [OWN, ...PRESET_FONTS]

const OWN_SWATCH = {
  primary: "oklch(0.5629 0.1933 256.16)",
  "muted-foreground": "oklch(0.5399 0.0077 286.13)",
}

export const isGray = (name: string) =>
  (PRESET_BASE_COLORS as readonly string[]).includes(name) || name === OWN

export function themeOptions(baseColor: string) {
  return [baseColor, ...THEMES.filter((theme) => !isGray(theme))]
}

export function swatchOf(name: string) {
  const token = isGray(name) ? "muted-foreground" : "primary"
  if (name === OWN) return OWN_SWATCH[token]
  const palette = themeOf(name)?.light as Record<string, string> | undefined
  return palette?.[token] ?? palette?.["muted-foreground"]
}

export {
  PRESET_ICON_LIBRARIES,
  PRESET_MENU_ACCENTS,
  PRESET_MENU_COLORS,
  PRESET_RADII,
  STYLES,
}

export type CreateState = {
  platform: Platform
  base: Base
  style: StyleName
  baseColor: string
  theme: string
  iconLibrary: PresetConfig["iconLibrary"]
  font: string
  radius: PresetConfig["radius"]
  menuAccent: PresetConfig["menuAccent"]
  menuColor: PresetConfig["menuColor"]
  primary: string
}

export const DEFAULT_STATE: CreateState = {
  platform: "web",
  base: "base",
  style: "suiss",
  baseColor: OWN,
  theme: OWN,
  iconLibrary: "phosphor",
  font: OWN,
  radius: "default",
  menuAccent: "subtle",
  menuColor: "default",
  primary: "",
}

const isOneOf = <T extends string>(list: readonly T[], value: unknown) =>
  list.includes(value as T)

function presetCode(state: CreateState) {
  const style = state.style === OWN ? "nova" : state.style
  const theme = (
    state.theme === OWN ? "neutral" : state.theme
  ) as PresetConfig["theme"]
  return encodePreset({
    style: style as PresetConfig["style"],
    baseColor: (state.baseColor === OWN
      ? "neutral"
      : state.baseColor) as PresetConfig["baseColor"],
    theme,
    chartColor: theme as PresetConfig["chartColor"],
    iconLibrary: state.iconLibrary,
    font: (state.font === OWN ? "inter" : state.font) as PresetConfig["font"],
    radius: state.radius,
    menuAccent: state.menuAccent,
    menuColor: state.menuColor,
  })
}

function isDefault(state: CreateState) {
  return (Object.keys(DEFAULT_STATE) as (keyof CreateState)[]).every(
    (key) =>
      key === "platform" ||
      key === "primary" ||
      state[key] === DEFAULT_STATE[key]
  )
}

export function fromParams(params: URLSearchParams): CreateState {
  const state = { ...DEFAULT_STATE }
  const code = params.get("preset")
  const preset = code && isPresetCode(code) ? decodePreset(code) : null
  if (preset) {
    Object.assign(state, {
      style: preset.style,
      baseColor: preset.baseColor,
      theme: preset.theme,
      iconLibrary: preset.iconLibrary,
      font: preset.font,
      radius: preset.radius,
      menuAccent: preset.menuAccent,
      menuColor: preset.menuColor,
    })
  }
  const platform = params.get("platform")
  if (
    isOneOf(
      PLATFORMS.map((item) => item.value),
      platform
    )
  ) {
    state.platform = platform as Platform
  }
  const base = params.get("base")
  if (isOneOf(PRIMITIVE_BASES, base)) state.base = base as Base
  const style = params.get("style")
  if (isOneOf(STYLES, style)) state.style = style as StyleName
  if (params.get("theme") === OWN) state.baseColor = OWN
  if (params.get("font") === OWN) state.font = OWN
  if (isGray(state.theme)) state.theme = state.baseColor
  const primary = parseColor(params.get("primary") ?? "")
  if (primary) state.primary = oklchString(primary)
  return state
}

export function toParams(state: CreateState) {
  const params = new URLSearchParams()
  if (state.platform !== DEFAULT_STATE.platform) {
    params.set("platform", state.platform)
  }
  if (state.base !== DEFAULT_STATE.base) params.set("base", state.base)
  if (state.primary) params.set("primary", state.primary)
  if (isDefault(state)) return params
  params.set("preset", presetCode(state))
  if (state.style === OWN) params.set("style", OWN)
  if (state.baseColor === OWN) params.set("theme", OWN)
  if (state.font === OWN) params.set("font", OWN)
  return params
}

const RUNNERS: Record<PackageManager, string> = {
  pnpm: "pnpm dlx",
  npm: "npx",
  yarn: "yarn dlx",
  bun: "bunx",
}

export const TEMPLATES = {
  web: ["next", "vite"],
  rn: ["expo"],
  swift: [],
  kotlin: [],
} as const satisfies Record<Platform, readonly string[]>

export type Template = (typeof TEMPLATES)[keyof typeof TEMPLATES][number]

export const APPLY_MODES = ["setup", "full", "theme", "font"] as const

export type ApplyMode = (typeof APPLY_MODES)[number]

export type ProjectOptions = { pointer: boolean; rtl: boolean }

const CLI = "@esuiss/ui@latest"

function presetFlags(state: CreateState, mode: ApplyMode = "setup") {
  const flags = [`--preset ${presetCode(state)}`]
  const own = state.baseColor === OWN || state.theme === OWN
  if (mode === "theme") flags.push(`--style ${state.style}`)
  else if (state.style === OWN && mode !== "font") flags.push(`--style ${OWN}`)
  if (own && mode !== "font") flags.push(`--theme ${OWN}`)
  if (state.primary && mode !== "font") {
    flags.push(`--primary "${state.primary}"`)
  }
  return flags
}

function webFlags(state: CreateState, options: ProjectOptions) {
  if (state.platform !== "web") return []
  return [
    ...(options.rtl ? ["--rtl"] : []),
    ...(options.pointer ? ["--pointer"] : []),
  ]
}

export function cliCommand(
  state: CreateState,
  packageManager: PackageManager,
  options: ProjectOptions
) {
  const flags = [`--platform ${state.platform}`]
  if (state.platform === "web" && state.base !== "base") {
    flags.push(`--base ${state.base}`)
  }
  if (!isDefault(state)) flags.push(...presetFlags(state))
  else if (state.primary) flags.push(`--primary "${state.primary}"`)
  flags.push(...webFlags(state, options))
  return `${RUNNERS[packageManager]} ${CLI} init ${flags.join(" ")}`
}

export function newProjectCommand(
  state: CreateState,
  template: Template,
  packageManager: PackageManager,
  options: ProjectOptions
) {
  const flags = [`--template ${template}`]
  if (state.platform === "web" && state.base !== "base") {
    flags.push(`--base ${state.base}`)
  }
  if (!isDefault(state)) flags.push(...presetFlags(state))
  else if (state.primary) flags.push(`--primary "${state.primary}"`)
  flags.push(...webFlags(state, options))
  return `${RUNNERS[packageManager]} ${CLI} init ${flags.join(" ")}`
}

export function applyCommand(
  state: CreateState,
  mode: Exclude<ApplyMode, "setup">,
  packageManager: PackageManager
) {
  const flags = [`--platform ${state.platform}`, ...presetFlags(state, mode)]
  if (mode !== "full") flags.push(`--only ${mode}`)
  return `${RUNNERS[packageManager]} ${CLI} apply ${flags.join(" ")}`
}

export function shadcnCommand(
  state: CreateState,
  packageManager: PackageManager
) {
  return `${RUNNERS[packageManager]} shadcn@latest init --preset ${presetCode(state)} --base ${state.base}`
}

export type ThemeDefaults = {
  light: Record<string, string>
  dark: Record<string, string>
}

function cssRule(selector: string, variables: Record<string, string>) {
  const lines = Object.entries(variables).map(
    ([name, value]) => `  --${name}: ${value};`
  )
  return `${selector} {\n${lines.join("\n")}\n}`
}

export function themeCss(state: CreateState, defaults: ThemeDefaults) {
  const { light, dark } = themeVariables(state)
  return [
    cssRule(":root", { ...defaults.light, ...light }),
    cssRule(".dark", { ...defaults.dark, ...dark }),
  ].join("\n\n")
}

function themeOf(name: string) {
  return (themes as Palette[]).find((theme) => theme.name === name)
}

export function themeVariables(state: CreateState) {
  const base = state.baseColor === OWN ? undefined : themeOf(state.baseColor)
  const accent = state.theme === OWN ? undefined : themeOf(state.theme)
  const { radius: _light, ...light } = {
    ...base?.light,
    ...accent?.light,
  } as Record<string, string>
  const { radius: _dark, ...dark } = {
    ...base?.dark,
    ...accent?.dark,
  } as Record<string, string>
  const radius = RADII[state.radius]
  const custom = primaryVariables(state.primary)
  return {
    light: { ...light, ...custom, ...(radius ? { radius } : {}) },
    dark: { ...dark, ...custom },
  }
}

function primaryVariables(primary: string): Record<string, string> {
  const rgb = parseColor(primary)
  if (!rgb) return {}
  const foreground = foregroundFor(rgb)
  return {
    primary,
    "primary-foreground": foreground,
    ring: primary,
    "sidebar-primary": primary,
    "sidebar-primary-foreground": foreground,
    "sidebar-ring": primary,
    "chart-1": primary,
  }
}

export function fontOf(name: string) {
  return fonts.find((font) => font.name === name)
}
