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
import fonts from "@/lib/create/fonts.json"
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

export const BASE_COLORS = [OWN, ...PRESET_BASE_COLORS]
export const THEMES = [OWN, ...PRESET_THEMES]
export const FONTS = [OWN, ...PRESET_FONTS]

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
}

const isOneOf = <T extends string>(list: readonly T[], value: unknown) =>
  list.includes(value as T)

function presetCode(state: CreateState) {
  const style = state.style === OWN ? "nova" : state.style
  return encodePreset({
    style: style as PresetConfig["style"],
    baseColor: (state.baseColor === OWN
      ? "neutral"
      : state.baseColor) as PresetConfig["baseColor"],
    theme: (state.theme === OWN
      ? "neutral"
      : state.theme) as PresetConfig["theme"],
    iconLibrary: state.iconLibrary,
    font: (state.font === OWN ? "inter" : state.font) as PresetConfig["font"],
    radius: state.radius,
    menuAccent: state.menuAccent,
    menuColor: state.menuColor,
  })
}

function isDefault(state: CreateState) {
  return (Object.keys(DEFAULT_STATE) as (keyof CreateState)[]).every(
    (key) => key === "platform" || state[key] === DEFAULT_STATE[key]
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
  if (params.get("theme") === OWN) {
    state.baseColor = OWN
    state.theme = OWN
  }
  if (params.get("font") === OWN) state.font = OWN
  return state
}

export function toParams(state: CreateState) {
  const params = new URLSearchParams()
  if (state.platform !== DEFAULT_STATE.platform) {
    params.set("platform", state.platform)
  }
  if (state.base !== DEFAULT_STATE.base) params.set("base", state.base)
  if (isDefault(state)) return params
  params.set("preset", presetCode(state))
  if (state.style === OWN) params.set("style", OWN)
  if (state.baseColor === OWN || state.theme === OWN) params.set("theme", OWN)
  if (state.font === OWN) params.set("font", OWN)
  return params
}

export function cliCommand(state: CreateState) {
  const flags = [`--platform ${state.platform}`]
  if (state.platform === "web" && state.base !== "base") {
    flags.push(`--base ${state.base}`)
  }
  if (state.platform !== "web") {
    if (state.style !== OWN) flags.push(`--style ${state.style}`)
    if (state.iconLibrary !== DEFAULT_STATE.iconLibrary) {
      flags.push(`--icon-library ${state.iconLibrary}`)
    }
    return `npx @esuiss/ui@latest init ${flags.join(" ")}`
  }
  if (!isDefault(state)) {
    flags.push(`--preset ${presetCode(state)}`)
    if (state.style === OWN) flags.push(`--style ${OWN}`)
    if (state.baseColor === OWN || state.theme === OWN) {
      flags.push(`--theme ${OWN}`)
    }
  }
  return `npx @esuiss/ui@latest init ${flags.join(" ")}`
}

export function shadcnCommand(state: CreateState) {
  return `npx shadcn@latest init --preset ${presetCode(state)} --base ${state.base}`
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
  return { light: radius ? { ...light, radius } : light, dark }
}

export function fontOf(name: string) {
  return fonts.find((font) => font.name === name)
}
