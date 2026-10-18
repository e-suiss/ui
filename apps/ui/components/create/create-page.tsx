"use client"

import { Radio } from "@base-ui/react/radio"
import { RadioGroup } from "@base-ui/react/radio-group"
import { CheckIcon } from "@phosphor-icons/react"
import * as React from "react"
import { CommandLine } from "@/components/create/command-line"
import { CreatePreview } from "@/components/create/preview"
import { PreviewIconsProvider } from "@/components/site/icon-placeholder"
import { showStyle } from "@/components/site/style-sheet"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useIsMobile } from "@/hooks/use-mobile"
import { ICON_LABELS, type IconLibrary, STYLE_LABELS } from "@/lib/code-options"
import {
  BASE_COLORS,
  type CreateState,
  cliCommand,
  DEFAULT_STATE,
  FONTS,
  fontOf,
  fromParams,
  isGray,
  OWN,
  PLATFORMS,
  PRESET_ICON_LIBRARIES,
  PRESET_MENU_ACCENTS,
  PRESET_MENU_COLORS,
  PRESET_RADII,
  PRIMITIVE_BASES,
  STYLES,
  shadcnCommand,
  swatchOf,
  themeOptions,
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

type Option = { value: string; label: string; swatch?: string }

function Swatch({ color }: { color?: string }) {
  if (!color) return null
  return (
    <span
      aria-hidden
      style={{ backgroundColor: color }}
      className="size-4 shrink-0 rounded-full ring-1 ring-foreground/10"
    />
  )
}

function Picker({
  label,
  value,
  groups,
  onChange,
  onPreview,
}: {
  label: string
  value: string
  groups: Option[][]
  onChange: (value: string) => void
  onPreview: (value: string | null) => void
}) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)
  const current = groups.flat().find((option) => option.value === value)
  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) onPreview(null)
      }}
    >
      <PopoverTrigger className="flex w-full items-center gap-3 rounded-xl bg-foreground/5 px-3.5 py-2 text-start outline-none transition-colors hover:bg-foreground/8 focus-visible:ring-3 focus-visible:ring-ring/50 data-popup-open:bg-foreground/10">
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-xs text-muted-foreground">{label}</span>
          <span className="truncate text-sm font-medium text-foreground">
            {current?.label ?? value}
          </span>
        </span>
        <Swatch color={current?.swatch} />
      </PopoverTrigger>
      <PopoverContent
        side={isMobile ? "top" : "right"}
        align={isMobile ? "center" : "start"}
        sideOffset={8}
        onMouseLeave={() => onPreview(null)}
        className="w-56 p-0"
      >
        <ScrollArea className="[&>[data-slot=scroll-area-viewport]]:max-h-92">
          <RadioGroup
            aria-label={label}
            value={value}
            onValueChange={(next) => {
              onChange(next as string)
              onPreview(null)
              if (isMobile) setOpen(false)
            }}
            className="flex flex-col p-1"
          >
            {groups.map((options, index) => (
              <div
                key={options[0]?.value ?? index}
                className={cn(
                  "flex flex-col",
                  index > 0 && "mt-1 border-t border-border pt-1"
                )}
              >
                {options.map((option) => (
                  <Radio.Root
                    key={option.value}
                    value={option.value}
                    onMouseEnter={() => onPreview(option.value)}
                    className="group/item flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-start text-sm outline-none transition-colors hover:bg-foreground/5 focus-visible:bg-foreground/5"
                  >
                    <Swatch color={option.swatch} />
                    <span className="flex-1 truncate">{option.label}</span>
                    <CheckIcon
                      aria-hidden
                      className="size-4 opacity-0 group-data-checked/item:opacity-100"
                    />
                  </Radio.Root>
                ))}
              </div>
            ))}
          </RadioGroup>
        </ScrollArea>
      </PopoverContent>
    </Popover>
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

const label = (value: string) =>
  value === OWN ? strings.createOwn : titleCase(value)

const options = (values: readonly string[], swatches = false): Option[] =>
  values.map((value) => ({
    value,
    label: label(value),
    swatch: swatches ? swatchOf(value) : undefined,
  }))

export function CreatePage() {
  const [state, setState] = React.useState<CreateState>(DEFAULT_STATE)
  const [preview, setPreview] = React.useState<Partial<CreateState>>({})
  const [ready, setReady] = React.useState(false)
  const shown = { ...state, ...preview }

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
    const query = toParams(state).toString()
    const url = `${window.location.pathname}${query ? `?${query}` : ""}`
    window.history.replaceState(window.history.state, "", url)
  }, [ready, state])

  React.useEffect(() => {
    if (ready) void showStyle(shown.style)
  }, [ready, shown.style])

  React.useEffect(() => () => void showStyle("suiss"), [])

  useThemeStyle(shown)

  const update = <K extends keyof CreateState>(key: K, value: CreateState[K]) =>
    setState((current) => {
      const next = { ...current, [key]: value }
      if (key === "baseColor" && isGray(current.theme))
        next.theme = next.baseColor
      return next
    })

  const picker = <K extends keyof CreateState>(
    key: K,
    pickerLabel: string,
    groups: Option[][]
  ) => (
    <Picker
      label={pickerLabel}
      value={state[key] as string}
      groups={groups}
      onChange={(value) => update(key, value as CreateState[K])}
      onPreview={(value) => {
        if (value === null) {
          setPreview({})
          return
        }
        setPreview({
          [key]: value,
          ...(key === "baseColor" && isGray(state.theme)
            ? { theme: value }
            : {}),
        })
      }}
    />
  )

  const web = state.platform === "web"
  const [defaultTheme, ...colorThemes] = themeOptions(state.baseColor)

  return (
    <div className="flex w-full flex-col gap-10 px-5 py-10 md:px-10 lg:flex-row">
      <aside className="flex w-full shrink-0 flex-col gap-6 lg:sticky lg:top-24 lg:w-64 lg:self-start">
        <div className="flex flex-col gap-2 px-3">
          <h1 className="text-4xl font-semibold tracking-[-0.03em]">
            {strings.createTitle}
          </h1>
          <p className="text-[15px] leading-[1.5] text-muted-foreground">
            {strings.createIntro}
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          {picker("platform", strings.createPlatform, [
            PLATFORMS.map((item) => ({ value: item.value, label: item.label })),
          ])}
          {picker("style", strings.style, [
            STYLES.map((value) => ({ value, label: STYLE_LABELS[value] })),
          ])}
          {web &&
            picker("base", strings.primitiveBase, [
              PRIMITIVE_BASES.map((value) => ({ value, label: value })),
            ])}
          {picker("baseColor", strings.createBaseColor, [
            options(BASE_COLORS, true),
          ])}
          {picker("theme", strings.createTheme, [
            [
              {
                value: defaultTheme ?? state.baseColor,
                label: strings.createDefault,
                swatch: swatchOf(defaultTheme ?? state.baseColor),
              },
            ],
            options(colorThemes, true),
          ])}
          {picker("font", strings.createFont, [options(FONTS)])}
          {picker("radius", strings.createRadius, [options(PRESET_RADII)])}
          {picker("iconLibrary", strings.iconLibrary, [
            PRESET_ICON_LIBRARIES.map((value) => ({
              value,
              label: ICON_LABELS[value as IconLibrary],
            })),
          ])}
          {picker("menuColor", strings.createMenuColor, [
            options(PRESET_MENU_COLORS),
          ])}
          {picker("menuAccent", strings.createMenuAccent, [
            options(PRESET_MENU_ACCENTS),
          ])}
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
        <PreviewIconsProvider icons={shown.iconLibrary as IconLibrary}>
          <CreatePreview />
        </PreviewIconsProvider>
      </div>
    </div>
  )
}
