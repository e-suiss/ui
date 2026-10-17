"use client"

import { Radio } from "@base-ui/react/radio"
import { RadioGroup } from "@base-ui/react/radio-group"
import * as React from "react"
import { CommandLine } from "@/components/create/command-line"
import { CreatePreview } from "@/components/create/preview"
import { PreviewIconsProvider } from "@/components/site/icon-placeholder"
import { showStyle } from "@/components/site/style-sheet"
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select"
import {
  ICON_LABELS,
  type IconLibrary,
  STYLE_LABELS,
  type StyleName,
} from "@/lib/code-options"
import {
  BASE_COLORS,
  type CreateState,
  cliCommand,
  DEFAULT_STATE,
  FONTS,
  fontOf,
  fromParams,
  OWN,
  PLATFORMS,
  PRESET_ICON_LIBRARIES,
  PRESET_MENU_ACCENTS,
  PRESET_MENU_COLORS,
  PRESET_RADII,
  PRIMITIVE_BASES,
  STYLES,
  shadcnCommand,
  THEMES,
  themeVariables,
  toParams,
} from "@/lib/create/options"
import { strings } from "@/lib/strings"
import { cn } from "@/lib/utils"

const THEME_STYLE = "create-theme"
const FONT_LINK = "create-font"

const titleCase = (value: string) =>
  value === OWN
    ? "Suiss"
    : value.replace(
        /(^|-)(\w)/g,
        (_, dash: string, char: string) =>
          `${dash ? " " : ""}${char.toUpperCase()}`
      )

function Choice<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: readonly { value: T; label: string }[]
  onChange: (value: T) => void
}) {
  const id = React.useId()
  return (
    <div className="flex flex-col gap-2.5">
      <p
        id={id}
        className="font-mono text-[11px] tracking-[0.02em] text-muted-foreground uppercase"
      >
        {label}
      </p>
      <RadioGroup
        aria-labelledby={id}
        value={value}
        onValueChange={(next) => onChange(next as T)}
        className="flex flex-wrap gap-1.5"
      >
        {options.map((option) => (
          <Radio.Root
            key={option.value}
            value={option.value}
            className="inline-flex h-8 cursor-pointer items-center rounded-full bg-foreground/5 px-3.5 text-[13px] font-medium tracking-[-0.01em] text-foreground/70 outline-none transition-colors hover:bg-foreground/10 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 data-checked:bg-foreground data-checked:text-background"
          >
            {option.label}
          </Radio.Root>
        ))}
      </RadioGroup>
    </div>
  )
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: string
  options: readonly string[]
  onChange: (value: string) => void
}) {
  const id = React.useId()
  return (
    <div className="flex flex-col gap-2.5">
      <label
        htmlFor={id}
        className="font-mono text-[11px] tracking-[0.02em] text-muted-foreground uppercase"
      >
        {label}
      </label>
      <NativeSelect
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <NativeSelectOption key={option} value={option}>
            {option === OWN ? strings.createOwn : titleCase(option)}
          </NativeSelectOption>
        ))}
      </NativeSelect>
    </div>
  )
}

function declarations(variables: Record<string, string>) {
  return Object.entries(variables)
    .map(([name, value]) => `--${name}:${value};`)
    .join("")
}

function useThemeStyle(state: CreateState) {
  React.useEffect(() => {
    const { light, dark } = themeVariables(state)
    const font = fontOf(state.font)
    let element = document.getElementById(THEME_STYLE)
    if (!element) {
      element = document.createElement("style")
      element.id = THEME_STYLE
      document.head.append(element)
    }
    element.textContent = [
      `html:root{${declarations(light)}${font ? `--font-sans:'${font.google}',sans-serif;` : ""}}`,
      `html.dark:root{${declarations(dark)}}`,
      font ? "html body{font-family:var(--font-sans)}" : "",
    ].join("")
    if (font) {
      let link = document.getElementById(FONT_LINK) as HTMLLinkElement | null
      if (!link) {
        link = document.createElement("link")
        link.id = FONT_LINK
        link.rel = "stylesheet"
        document.head.append(link)
      }
      link.href = `https://fonts.googleapis.com/css2?family=${font.google.replace(/ /g, "+")}:wght@400..700&display=swap`
    }
    const root = document.documentElement
    if (state.menuColor.endsWith("translucent")) {
      root.dataset.menuTranslucent = ""
    } else {
      delete root.dataset.menuTranslucent
    }
  }, [state])

  React.useEffect(
    () => () => {
      document.getElementById(THEME_STYLE)?.remove()
      document.getElementById(FONT_LINK)?.remove()
      delete document.documentElement.dataset.menuTranslucent
    },
    []
  )
}

export function CreatePage() {
  const [state, setState] = React.useState<CreateState>(DEFAULT_STATE)
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    const root = document.documentElement
    root.dataset.create = ""
    setState(fromParams(new URLSearchParams(window.location.search)))
    setReady(true)
    return () => {
      delete root.dataset.create
    }
  }, [])

  React.useEffect(() => {
    if (!ready) return
    void showStyle(state.style)
    const query = toParams(state).toString()
    const url = `${window.location.pathname}${query ? `?${query}` : ""}`
    window.history.replaceState(window.history.state, "", url)
  }, [ready, state])

  React.useEffect(() => () => void showStyle("suiss"), [])

  useThemeStyle(state)

  const update = <K extends keyof CreateState>(key: K, value: CreateState[K]) =>
    setState((current) => ({ ...current, [key]: value }))

  return (
    <div className="mx-auto flex w-full max-w-[1680px] flex-col gap-10 px-5 py-10 md:px-10 lg:flex-row">
      <aside className="flex w-full shrink-0 flex-col gap-6 lg:sticky lg:top-24 lg:w-80 lg:self-start">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-semibold tracking-[-0.03em]">
            {strings.createTitle}
          </h1>
          <p className="text-[15px] leading-[1.5] text-muted-foreground">
            {strings.createIntro}
          </p>
        </div>
        <Choice
          label={strings.createPlatform}
          value={state.platform}
          options={PLATFORMS}
          onChange={(platform) => update("platform", platform)}
        />
        <Choice
          label={strings.style}
          value={state.style}
          options={STYLES.map((value) => ({
            value,
            label: STYLE_LABELS[value],
          }))}
          onChange={(style) => update("style", style as StyleName)}
        />
        <div
          className={cn(
            "flex flex-col gap-6",
            state.platform !== "web" && "hidden"
          )}
        >
          <Choice
            label={strings.primitiveBase}
            value={state.base}
            options={PRIMITIVE_BASES.map((value) => ({ value, label: value }))}
            onChange={(base) => update("base", base)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label={strings.createBaseColor}
              value={state.baseColor}
              options={BASE_COLORS}
              onChange={(baseColor) => update("baseColor", baseColor)}
            />
            <Select
              label={strings.createTheme}
              value={state.theme}
              options={THEMES}
              onChange={(theme) => update("theme", theme)}
            />
            <Select
              label={strings.createFont}
              value={state.font}
              options={FONTS}
              onChange={(font) => update("font", font)}
            />
            <Select
              label={strings.createRadius}
              value={state.radius}
              options={PRESET_RADII}
              onChange={(radius) =>
                update("radius", radius as CreateState["radius"])
              }
            />
          </div>
          <Choice
            label={strings.iconLibrary}
            value={state.iconLibrary}
            options={PRESET_ICON_LIBRARIES.map((value) => ({
              value,
              label: ICON_LABELS[value as IconLibrary],
            }))}
            onChange={(iconLibrary) => update("iconLibrary", iconLibrary)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label={strings.createMenuColor}
              value={state.menuColor}
              options={PRESET_MENU_COLORS}
              onChange={(menuColor) =>
                update("menuColor", menuColor as CreateState["menuColor"])
              }
            />
            <Select
              label={strings.createMenuAccent}
              value={state.menuAccent}
              options={PRESET_MENU_ACCENTS}
              onChange={(menuAccent) =>
                update("menuAccent", menuAccent as CreateState["menuAccent"])
              }
            />
          </div>
        </div>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col gap-8">
        <div className="flex flex-col gap-3">
          <p className="font-mono text-[11px] tracking-[0.02em] text-muted-foreground uppercase">
            {strings.createInstall}
          </p>
          <CommandLine command={cliCommand(state)} />
          {state.platform === "web" && (
            <>
              <p className="text-[13px] leading-[1.5] text-muted-foreground">
                {strings.createShadcnNote}
              </p>
              <CommandLine command={shadcnCommand(state)} />
            </>
          )}
          {state.platform !== "web" && (
            <p className="text-[13px] leading-[1.5] text-muted-foreground">
              {strings.createNativeNote}
            </p>
          )}
        </div>
        <PreviewIconsProvider icons={state.iconLibrary as IconLibrary}>
          <CreatePreview />
        </PreviewIconsProvider>
      </div>
    </div>
  )
}
