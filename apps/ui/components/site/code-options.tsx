"use client"

import { Radio } from "@base-ui/react/radio"
import { RadioGroup } from "@base-ui/react/radio-group"
import { SlidersHorizontalIcon } from "@phosphor-icons/react"
import * as React from "react"
import { Anchor } from "@/components/site/anchor"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  BASES,
  type CodeOptions,
  codeOptions,
  DEFAULT_OPTIONS,
  ICON_LABELS,
  ICON_LIBRARIES,
} from "@/lib/code-options"
import { strings } from "@/lib/strings"
import { cn } from "@/lib/utils"

const KEY = "suiss-code"

const listeners = new Set<() => void>()
let current: CodeOptions | null = null

function readStored(): CodeOptions {
  try {
    const stored = JSON.parse(window.localStorage.getItem(KEY) ?? "{}")
    return codeOptions(new URLSearchParams(window.location.search), stored)
  } catch {
    return DEFAULT_OPTIONS
  }
}

function snapshot() {
  if (current === null) current = readStored()
  return current
}

function subscribe(listener: () => void) {
  const sync = (event: StorageEvent) => {
    if (event.key !== KEY) return
    current = readStored()
    listener()
  }
  listeners.add(listener)
  window.addEventListener("storage", sync)
  return () => {
    listeners.delete(listener)
    window.removeEventListener("storage", sync)
  }
}

function persist(options: CodeOptions) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(options))
    const url = new URL(window.location.href)
    for (const [name, value] of Object.entries(options))
      if (url.searchParams.has(name)) url.searchParams.set(name, value)
    window.history.replaceState(window.history.state, "", url)
    return true
  } catch {
    return false
  }
}

function select(options: Partial<CodeOptions>) {
  current = { ...snapshot(), ...options }
  persist(current)
  for (const listener of listeners) listener()
}

export function useCodeOptions() {
  return React.useSyncExternalStore(subscribe, snapshot, () => DEFAULT_OPTIONS)
}

function Options({
  label,
  value,
  options,
  onChange,
  mono,
}: {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
  mono?: boolean
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
        onValueChange={(next) => onChange(String(next))}
        className="flex flex-wrap gap-1.5"
      >
        {options.map((option) => (
          <Radio.Root
            key={option.value}
            value={option.value}
            className={cn(
              "inline-flex h-8 cursor-pointer items-center rounded-full px-3.5 text-[13px] font-medium tracking-[-0.01em] outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
              "bg-foreground/5 text-foreground/70 hover:bg-foreground/10 hover:text-foreground data-checked:bg-foreground data-checked:text-background",
              mono && "font-mono text-xs tracking-normal"
            )}
          >
            {option.label}
          </Radio.Root>
        ))}
      </RadioGroup>
    </div>
  )
}

export function CodeOptionsMenu() {
  const options = useCodeOptions()
  const changed =
    options.icons !== DEFAULT_OPTIONS.icons ||
    options.base !== DEFAULT_OPTIONS.base
  return (
    <Popover>
      <PopoverTrigger
        aria-label={strings.codeOptions}
        className="relative flex size-10 cursor-pointer items-center justify-center rounded-full bg-foreground/5 text-foreground outline-none transition-colors duration-300 hover:bg-foreground/10 focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <SlidersHorizontalIcon className="size-4.5" />
        {changed && (
          <span className="absolute top-2 end-2 size-1.5 rounded-full bg-foreground" />
        )}
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[min(20rem,calc(100vw-2rem))] gap-5 p-5"
      >
        <Options
          label={strings.iconLibrary}
          value={options.icons}
          options={ICON_LIBRARIES.map((value) => ({
            value,
            label: ICON_LABELS[value],
          }))}
          onChange={(icons) => select({ icons: icons as CodeOptions["icons"] })}
        />
        {BASES.length > 1 && (
          <Options
            label={strings.primitiveBase}
            value={options.base}
            options={BASES.map((value) => ({ value, label: value }))}
            onChange={(base) => select({ base })}
            mono
          />
        )}
        <p className="text-[13px] leading-[1.45] tracking-[-0.01em] text-muted-foreground">
          {strings.codeOptionsHint}{" "}
          <Anchor
            href="/docs/installation#choose-the-primitive-base"
            className="text-foreground underline-offset-4 hover:underline"
          >
            {strings.codeOptionsLink}
          </Anchor>
        </p>
      </PopoverContent>
    </Popover>
  )
}
