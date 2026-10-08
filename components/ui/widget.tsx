"use client"

import { cn } from "cn"
import * as React from "react"

type WidgetSize = "small" | "medium" | "large" | "extra-large"

const WIDGET_DIMENSIONS: Record<WidgetSize, [number, number]> = {
  small: [168, 168],
  medium: [352, 168],
  large: [352, 352],
  "extra-large": [720, 352],
}

function nearestSize(width: number, height: number, sizes: WidgetSize[]) {
  let best: WidgetSize | null = null
  let bestDistance = Number.POSITIVE_INFINITY
  for (const size of sizes) {
    const [w, h] = WIDGET_DIMENSIONS[size]
    const distance = (width - w) ** 2 + (height - h) ** 2
    if (distance < bestDistance) {
      best = size
      bestDistance = distance
    }
  }
  return best
}

function WidgetHandle({
  placement,
  onPointerDown,
  onDoubleClick,
}: {
  placement: "inside" | "outside"
  onPointerDown: (event: React.PointerEvent<HTMLSpanElement>) => void
  onDoubleClick: () => void
}) {
  return (
    <span
      aria-hidden="true"
      data-slot="widget-handle"
      data-placement={placement}
      onPointerDown={onPointerDown}
      onDoubleClick={onDoubleClick}
      className="group/widget-handle absolute cursor-nwse-resize touch-none after:absolute after:-inset-3 after:content-[''] data-[placement=inside]:inset-e-0 data-[placement=inside]:bottom-0 data-[placement=inside]:size-7 data-[placement=outside]:-inset-e-1.5 data-[placement=outside]:-bottom-1.5 data-[placement=outside]:size-8.5 rtl:-scale-x-100 rtl:cursor-nesw-resize"
    >
      <svg
        aria-hidden
        viewBox={placement === "inside" ? "0 0 28 28" : "0 0 34 34"}
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
        className="pointer-events-none size-full overflow-visible stroke-label-quaternary opacity-0 transition-[stroke,opacity] duration-200 group-hover/widget-handle:stroke-accent group-hover/widget-handle:opacity-100 group-data-dragging/widget-handle:stroke-accent group-data-dragging/widget-handle:opacity-100 pointer-coarse:opacity-100"
      >
        <path
          d={
            placement === "inside"
              ? "M19.9 9.3A22 22 0 0 1 9.3 19.9"
              : "M29.9 13.9A33 33 0 0 1 13.9 29.9"
          }
        />
      </svg>
    </span>
  )
}

function Widget({
  className,
  size,
  defaultSize,
  onSizeChange,
  sizes = ["small", "medium", "large", "extra-large"],
  resizable = false,
  handle = "outside",
  align = "start",
  style,
  ref,
  ...props
}: React.ComponentProps<"div"> & {
  size?: WidgetSize | "auto"
  defaultSize?: WidgetSize | "auto"
  onSizeChange?: (size: WidgetSize | "auto") => void
  sizes?: WidgetSize[]
  resizable?: boolean | "free"
  handle?: "inside" | "outside"
  align?: "start" | "center"
}) {
  const initialSize = defaultSize ?? (resizable ? "small" : "auto")
  const [uncontrolledSize, setUncontrolledSize] = React.useState(initialSize)
  const [freeSize, setFreeSize] = React.useState<[number, number] | null>(null)
  const [preview, setPreview] = React.useState<WidgetSize | null>(null)
  const widgetRef = React.useRef<HTMLDivElement>(null)
  const current = size ?? uncontrolledSize

  const select = (next: WidgetSize | "auto") => {
    if (size === undefined) setUncontrolledSize(next)
    onSizeChange?.(next)
  }

  const startResize = (event: React.PointerEvent<HTMLSpanElement>) => {
    const widget = widgetRef.current
    if (!widget || event.button !== 0) return
    event.preventDefault()
    const handle = event.currentTarget
    handle.setPointerCapture(event.pointerId)
    handle.dataset.dragging = ""
    widget.dataset.resizing = resizable === "free" ? "free" : "snap"
    const direction = getComputedStyle(widget).direction === "rtl" ? -1 : 1
    const startX = event.clientX
    const startY = event.clientY
    const startWidth = widget.offsetWidth
    const startHeight = widget.offsetHeight
    const [minWidth, minHeight] = WIDGET_DIMENSIONS.small
    const maxWidth = Math.max(
      ...sizes.map((item) => WIDGET_DIMENSIONS[item][0])
    )
    const maxHeight = Math.max(
      ...sizes.map((item) => WIDGET_DIMENSIONS[item][1])
    )
    const free = resizable === "free"
    let last: WidgetSize | null = null
    const move = (moveEvent: PointerEvent) => {
      const width = startWidth + (moveEvent.clientX - startX) * direction
      const height = startHeight + moveEvent.clientY - startY
      const stretch = free ? 0 : 48
      setFreeSize([
        Math.max(minWidth, Math.min(maxWidth + stretch, width)),
        Math.max(minHeight, Math.min(maxHeight + stretch, height)),
      ])
      if (free) return
      const next = nearestSize(width, height, sizes)
      if (next !== last) {
        last = next
        setPreview(next)
      }
    }
    const end = () => {
      delete handle.dataset.dragging
      delete widget.dataset.resizing
      handle.removeEventListener("pointermove", move)
      handle.removeEventListener("pointerup", end)
      handle.removeEventListener("pointercancel", end)
      if (free) return
      setPreview(null)
      setFreeSize(null)
      if (last && last !== current) select(last)
    }
    handle.addEventListener("pointermove", move)
    handle.addEventListener("pointerup", end)
    handle.addEventListener("pointercancel", end)
  }

  const resetSize = () => {
    setFreeSize(null)
    select(initialSize)
  }

  const widget = (
    <div
      ref={(node) => {
        widgetRef.current = node
        if (typeof ref === "function") return ref(node)
        if (ref) ref.current = node
      }}
      data-slot="widget"
      data-size={current}
      data-align={align}
      style={
        freeSize ? { ...style, width: freeSize[0], height: freeSize[1] } : style
      }
      className={cn(
        "group/widget @container/widget flex max-w-full min-w-0 flex-col gap-3 overflow-hidden rounded-3xl bg-surface-secondary p-4 text-base text-label transition-[width,height] duration-500 ease-in-out data-[align=center]:items-center data-[align=center]:justify-center data-[align=center]:text-center data-resizing:transition-none data-[resizing=snap]:*:shrink-0 data-[size=auto]:size-full data-[size=extra-large]:h-88 data-[size=extra-large]:w-180 data-[size=large]:size-88 data-[size=medium]:h-42 data-[size=medium]:w-88 data-[size=small]:size-42 motion-reduce:transition-none",
        className
      )}
      {...props}
    />
  )

  if (!resizable) return widget

  return (
    <div
      data-slot="widget-container"
      data-size={current}
      className="relative w-fit max-w-full data-[size=auto]:size-full"
    >
      {preview && (
        <span
          aria-hidden="true"
          data-slot="widget-preview"
          className="pointer-events-none absolute inset-s-0 top-0 z-10 animate-in transition-[width,height] duration-500 ease-in-out fade-in-0 motion-reduce:transition-none"
          style={{
            width: WIDGET_DIMENSIONS[preview][0],
            height: WIDGET_DIMENSIONS[preview][1],
          }}
        >
          <svg
            aria-hidden
            fill="none"
            className="size-full overflow-visible stroke-label/25"
          >
            <rect
              width="100%"
              height="100%"
              rx="28"
              strokeWidth="1"
              strokeDasharray="3 3"
              strokeLinecap="round"
            />
          </svg>
        </span>
      )}
      {widget}
      <WidgetHandle
        placement={handle}
        onPointerDown={startResize}
        onDoubleClick={resetSize}
      />
    </div>
  )
}

function WidgetHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="widget-header"
      className={cn(
        "flex max-w-full min-w-0 items-center gap-2 group-data-[align=center]/widget:flex-col group-data-[align=center]/widget:gap-3",
        className
      )}
      {...props}
    />
  )
}

function WidgetIcon({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"span"> & {
  size?: "default" | "sm" | "lg"
}) {
  return (
    <span
      data-slot="widget-icon"
      data-size={size}
      aria-hidden="true"
      className={cn(
        "flex shrink-0 items-center justify-center text-label data-[size=default]:size-8 data-[size=default]:rounded-lg data-[size=default]:bg-control data-[size=lg]:size-13 data-[size=lg]:rounded-2xl data-[size=lg]:bg-control [&_svg]:pointer-events-none data-[size=default]:[&_svg:not([class*='size-'])]:size-4.5 data-[size=lg]:[&_svg:not([class*='size-'])]:size-6 data-[size=sm]:[&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      {...props}
    />
  )
}

function WidgetTitle({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="widget-title"
      className={cn(
        "max-w-full min-w-0 truncate text-sm font-semibold",
        className
      )}
      {...props}
    />
  )
}

function WidgetAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="widget-action"
      className={cn(
        "ms-auto flex shrink-0 items-center group-data-[align=center]/widget:hidden",
        className
      )}
      {...props}
    />
  )
}

function WidgetDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="widget-description"
      className={cn("text-sm text-label-secondary", className)}
      {...props}
    />
  )
}

function WidgetValue({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="widget-value"
      className={cn(
        "text-3xl font-semibold tracking-tight tabular-nums",
        className
      )}
      {...props}
    />
  )
}

function WidgetContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="widget-content"
      className={cn("flex min-h-0 flex-1 flex-col gap-1", className)}
      {...props}
    />
  )
}

function WidgetFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="widget-footer"
      className={cn(
        "mt-auto flex min-w-0 items-center gap-1.5 text-xs text-label-secondary group-data-[align=center]/widget:mt-0 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5",
        className
      )}
      {...props}
    />
  )
}

export {
  Widget,
  WidgetAction,
  WidgetContent,
  WidgetDescription,
  WidgetFooter,
  WidgetHeader,
  WidgetIcon,
  type WidgetSize,
  WidgetTitle,
  WidgetValue,
}
