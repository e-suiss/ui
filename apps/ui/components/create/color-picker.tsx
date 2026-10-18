"use client"

import * as React from "react"
import {
  type ColorFormat,
  formatColor,
  type Hsv,
  hsvToRgb,
  oklchString,
  parseColor,
  type Rgb,
  rgbToHsv,
} from "@/lib/create/color"
import { strings } from "@/lib/strings"
import { cn } from "@/lib/utils"

const FORMATS: { value: ColorFormat; label: string }[] = [
  { value: "hex", label: "HEX" },
  { value: "rgb", label: "RGB" },
  { value: "oklch", label: "OKLCH" },
]
const STEP = 0.02
const HUE_STEP = 2

const clamp = (value: number) => Math.min(1, Math.max(0, value))

function useDrag(onMove: (x: number, y: number) => void) {
  const ref = React.useRef<HTMLDivElement>(null)
  const move = (event: React.PointerEvent) => {
    const box = ref.current?.getBoundingClientRect()
    if (!box) return
    onMove(
      clamp((event.clientX - box.left) / box.width),
      clamp((event.clientY - box.top) / box.height)
    )
  }
  return {
    ref,
    onPointerDown: (event: React.PointerEvent) => {
      event.currentTarget.setPointerCapture(event.pointerId)
      move(event)
    },
    onPointerMove: (event: React.PointerEvent) => {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) move(event)
    },
  }
}

export function ColorPicker({
  value,
  fallback,
  onChange,
}: {
  value: string
  fallback: Rgb
  onChange: (oklch: string) => void
}) {
  const rgb = parseColor(value) ?? fallback
  const [hsv, setHsv] = React.useState<Hsv>(() => rgbToHsv(rgb))
  const [format, setFormat] = React.useState<ColorFormat>("hex")
  const [text, setText] = React.useState(() => formatColor(rgb, "hex"))
  const [invalid, setInvalid] = React.useState(false)
  const editing = React.useRef(false)

  const commit = (next: Hsv) => {
    setHsv(next)
    const color = hsvToRgb(next)
    if (!editing.current) setText(formatColor(color, format))
    onChange(oklchString(color))
  }

  const area = useDrag((x, y) => commit({ ...hsv, s: x, v: 1 - y }))
  const pure = hsvToRgb({ h: hsv.h, s: 1, v: 1 })

  return (
    <div className="flex flex-col gap-3 p-3">
      <p className="text-xs text-muted-foreground">{strings.createCustom}</p>
      <div
        {...area}
        role="slider"
        tabIndex={0}
        aria-label={strings.createSaturation}
        aria-valuetext={`${Math.round(hsv.s * 100)}%, ${Math.round(hsv.v * 100)}%`}
        aria-valuenow={Math.round(hsv.s * 100)}
        onKeyDown={(event) => {
          const moves: Record<string, [number, number]> = {
            ArrowLeft: [-STEP, 0],
            ArrowRight: [STEP, 0],
            ArrowUp: [0, STEP],
            ArrowDown: [0, -STEP],
          }
          const step = moves[event.key]
          if (!step) return
          event.preventDefault()
          commit({
            ...hsv,
            s: clamp(hsv.s + step[0]),
            v: clamp(hsv.v + step[1]),
          })
        }}
        style={{
          backgroundColor: `rgb(${pure.r} ${pure.g} ${pure.b})`,
          backgroundImage:
            "linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent)",
        }}
        className="relative h-36 w-full cursor-crosshair touch-none rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        <span
          aria-hidden
          style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%` }}
          className="pointer-events-none absolute size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-[0_0_0_1px_rgb(0_0_0/0.3)] rtl:translate-x-1/2"
        />
      </div>
      <input
        type="range"
        min={0}
        max={360}
        step={HUE_STEP}
        value={Math.round(hsv.h)}
        aria-label={strings.createHue}
        onChange={(event) => commit({ ...hsv, h: Number(event.target.value) })}
        style={{
          backgroundImage:
            "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
        }}
        className="h-3 w-full cursor-pointer appearance-none rounded-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50 [&::-moz-range-thumb]:size-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-[0_0_0_1px_rgb(0_0_0/0.3)]"
      />
      <div className="flex gap-1 rounded-lg bg-foreground/5 p-0.5">
        {FORMATS.map((item) => (
          <button
            key={item.value}
            type="button"
            aria-pressed={format === item.value}
            onClick={() => {
              setFormat(item.value)
              setText(formatColor(hsvToRgb(hsv), item.value))
              setInvalid(false)
            }}
            className="flex-1 rounded-md py-1 text-[11px] font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:shadow-sm"
          >
            {item.label}
          </button>
        ))}
      </div>
      <input
        value={text}
        aria-label={strings.createColorValue}
        aria-invalid={invalid || undefined}
        spellCheck={false}
        onFocus={() => {
          editing.current = true
        }}
        onBlur={() => {
          editing.current = false
          setInvalid(false)
          setText(formatColor(hsvToRgb(hsv), format))
        }}
        onChange={(event) => {
          setText(event.target.value)
          const parsed = parseColor(event.target.value)
          setInvalid(!parsed)
          if (parsed) commit(rgbToHsv(parsed))
        }}
        className={cn(
          "h-8 w-full rounded-lg bg-foreground/5 px-2.5 font-mono text-xs text-foreground outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
          invalid && "ring-2 ring-destructive/60"
        )}
      />
    </div>
  )
}
