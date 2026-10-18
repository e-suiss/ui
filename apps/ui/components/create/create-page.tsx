"use client"

import { Radio } from "@base-ui/react/radio"
import { RadioGroup } from "@base-ui/react/radio-group"
import { CheckIcon } from "@phosphor-icons/react"
import * as React from "react"
import { ColorPicker } from "@/components/create/color-picker"
import { FRAME_HEIGHT, FRAME_MESSAGE } from "@/components/create/frame"
import { GetCode } from "@/components/create/get-code"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useIsMobile } from "@/hooks/use-mobile"
import { withBase } from "@/lib/base-path"
import { ICON_LABELS, type IconLibrary, STYLE_LABELS } from "@/lib/code-options"
import { parseColor } from "@/lib/create/color"
import {
  BASE_COLORS,
  type CreateState,
  DEFAULT_STATE,
  FONTS,
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
  swatchOf,
  type ThemeDefaults,
  themeOptions,
  toParams,
} from "@/lib/create/options"
import { strings } from "@/lib/strings"
import { cn } from "@/lib/utils"

const FALLBACK_PRIMARY = { r: 0, g: 113, b: 227 }

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
  display,
  footer,
}: {
  label: string
  value: string
  groups: Option[][]
  onChange: (value: string) => void
  onPreview: (value: string | null) => void
  display?: Option
  footer?: React.ReactNode
}) {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)
  const current =
    display ?? groups.flat().find((option) => option.value === value)
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
        className={cn("p-0", footer ? "w-64" : "w-56")}
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
        {footer && <div className="border-t border-border">{footer}</div>}
      </PopoverContent>
    </Popover>
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

function useFrame(state: CreateState) {
  const ref = React.useRef<HTMLIFrameElement>(null)
  const [height, setHeight] = React.useState(720)
  const latest = React.useRef(state)
  latest.current = state

  const send = React.useCallback(() => {
    ref.current?.contentWindow?.postMessage(
      {
        type: FRAME_MESSAGE,
        state: latest.current,
        dark: document.documentElement.classList.contains("dark"),
      },
      window.location.origin
    )
  }, [])

  // biome-ignore lint/correctness/useExhaustiveDependencies: resend whenever the options change
  React.useEffect(() => {
    send()
  }, [state, send])

  React.useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      if (event.source !== ref.current?.contentWindow) return
      if (event.data?.type === FRAME_MESSAGE) send()
      if (event.data?.type === FRAME_HEIGHT) setHeight(event.data.height)
    }
    window.addEventListener("message", onMessage)
    const observer = new MutationObserver(send)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })
    return () => {
      window.removeEventListener("message", onMessage)
      observer.disconnect()
    }
  }, [send])

  return { ref, height, send }
}

export function CreatePage({
  themeDefaults,
}: {
  themeDefaults: ThemeDefaults
}) {
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

  const frame = useFrame(shown)

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
    groups: Option[][],
    extra: Partial<
      Pick<React.ComponentProps<typeof Picker>, "display" | "footer">
    > = {}
  ) => {
    const custom = key === "theme" && state.primary !== ""
    return (
      <Picker
        label={pickerLabel}
        value={custom ? "" : (state[key] as string)}
        groups={groups}
        {...extra}
        onChange={(value) => {
          update(key, value as CreateState[K])
          if (key === "theme") update("primary", "")
        }}
        onPreview={(value) => {
          if (value === null) {
            setPreview({})
            return
          }
          setPreview({
            [key]: value,
            ...(key === "theme" ? { primary: "" } : {}),
            ...(key === "baseColor" && isGray(state.theme)
              ? { theme: value }
              : {}),
          })
        }}
      />
    )
  }

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
          {picker(
            "theme",
            strings.createTheme,
            [
              [
                {
                  value: defaultTheme ?? state.baseColor,
                  label: strings.createDefault,
                  swatch: swatchOf(defaultTheme ?? state.baseColor),
                },
              ],
              options(colorThemes, true),
            ],
            {
              display: state.primary
                ? {
                    value: "",
                    label: strings.createCustom,
                    swatch: state.primary,
                  }
                : undefined,
              footer: (
                <ColorPicker
                  value={state.primary}
                  fallback={
                    parseColor(swatchOf(state.theme) ?? "") ?? FALLBACK_PRIMARY
                  }
                  onChange={(primary) => {
                    setPreview({})
                    update("primary", primary)
                  }}
                />
              ),
            }
          )}
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
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[11px] tracking-[0.02em] text-muted-foreground uppercase">
            {strings.createInstall}
          </p>
          <GetCode
            state={state}
            themeDefaults={themeDefaults}
            onBaseChange={(base) => update("base", base)}
          />
        </div>
        <iframe
          ref={frame.ref}
          src={withBase("/preview/create")}
          title={strings.createPreview}
          onLoad={frame.send}
          style={{ height: frame.height }}
          className="w-full rounded-3xl border-0 bg-transparent"
        />
      </div>
    </div>
  )
}
