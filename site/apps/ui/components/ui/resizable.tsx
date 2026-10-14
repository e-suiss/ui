"use client"

import { cn } from "cn"
import * as React from "react"
import * as ResizablePrimitive from "react-resizable-panels"

function animateJumps(
  group: HTMLElement | null,
  previous: ResizablePrimitive.Layout | null,
  next: ResizablePrimitive.Layout
) {
  if (!group || !previous) return
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
  const jumped = Object.entries(next).some(
    ([id, size]) => Math.abs(size - (previous[id] ?? size)) > 8
  )
  if (!jumped) return
  for (const [id, to] of Object.entries(next)) {
    const panel = Array.from(group.children).find(
      (child): child is HTMLElement =>
        child instanceof HTMLElement && child.id === id
    )
    const from = previous[id]
    if (!panel || from === undefined) continue
    for (const animation of panel.getAnimations()) animation.cancel()
    panel.animate(
      [
        { flexGrow: String(from), opacity: from < 1 ? 0 : 1 },
        { flexGrow: String(to), opacity: to < 1 ? 0 : 1 },
      ],
      { duration: 500, easing: "cubic-bezier(0.45, 0, 0.2, 1)" }
    )
  }
}

function markCollapsed(
  group: HTMLElement | null,
  layout: ResizablePrimitive.Layout
) {
  if (!group) return
  for (const handle of group.querySelectorAll<HTMLElement>(
    ":scope > [data-slot=resizable-handle]"
  )) {
    const before = handle.previousElementSibling?.id ?? ""
    const after = handle.nextElementSibling?.id ?? ""
    if ((layout[before] ?? 1) < 0.5) handle.dataset.collapsed = "start"
    else if ((layout[after] ?? 1) < 0.5) handle.dataset.collapsed = "end"
    else delete handle.dataset.collapsed
  }
}

function ResizablePanelGroup({
  className,
  variant = "default",
  onLayoutChange,
  elementRef,
  ...props
}: ResizablePrimitive.GroupProps & {
  variant?: "default" | "cards"
}) {
  const layout = React.useRef<ResizablePrimitive.Layout | null>(null)
  const group = React.useRef<HTMLDivElement | null>(null)

  return (
    <ResizablePrimitive.Group
      data-slot="resizable-panel-group"
      data-variant={variant}
      className={cn(
        "group/resizable flex h-full w-full aria-[orientation=vertical]:flex-col data-[variant=cards]:*:data-[slot=resizable-panel]:rounded-2xl data-[variant=cards]:*:data-[slot=resizable-panel]:bg-surface-secondary",
        className
      )}
      elementRef={(node: HTMLDivElement | null) => {
        group.current = node
        if (typeof elementRef === "function") elementRef(node)
        else if (elementRef) elementRef.current = node
      }}
      onLayoutChange={(next) => {
        animateJumps(group.current, layout.current, next)
        markCollapsed(group.current, next)
        layout.current = next
        onLayoutChange?.(next)
      }}
      {...props}
    />
  )
}

function ResizablePanel({
  className,
  onResize,
  ...props
}: ResizablePrimitive.PanelProps) {
  const [empty, setEmpty] = React.useState(false)

  return (
    <ResizablePrimitive.Panel
      data-slot="resizable-panel"
      data-empty={empty ? "" : undefined}
      inert={empty}
      className={cn("overflow-hidden!", className)}
      onResize={(size, id, previous) => {
        setEmpty(size.inPixels < 1)
        onResize?.(size, id, previous)
      }}
      {...props}
    />
  )
}

function ResizableHandle({
  withHandle,
  className,
  ...props
}: ResizablePrimitive.SeparatorProps & {
  withHandle?: boolean
}) {
  return (
    <ResizablePrimitive.Separator
      data-slot="resizable-handle"
      className={cn(
        "group/resizable-handle relative flex w-px items-center justify-center bg-separator after:absolute after:inset-y-0 after:inset-s-1/2 after:w-1 after:-translate-x-1/2 rtl:after:translate-x-1/2 focus-visible:focus-ring focus-visible:outline-hidden aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:inset-s-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 rtl:aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90",
        "group-data-[variant=cards]/resizable:w-3.5 group-data-[variant=cards]/resizable:rounded-full group-data-[variant=cards]/resizable:bg-transparent group-data-[variant=cards]/resizable:aria-[orientation=horizontal]:h-3.5 group-data-[variant=cards]/resizable:aria-[orientation=horizontal]:w-full",
        "transition-[width,height,background-color] duration-500 ease-[cubic-bezier(0.45,0,0.2,1)] data-collapsed:bg-transparent aria-[orientation=vertical]:data-collapsed:after:w-4 aria-[orientation=horizontal]:data-collapsed:after:h-4 group-data-[variant=cards]/resizable:aria-[orientation=vertical]:data-collapsed:w-0 group-data-[variant=cards]/resizable:aria-[orientation=horizontal]:data-collapsed:h-0 motion-reduce:transition-none",
        className
      )}
      {...props}
    >
      <div
        data-with-handle={withHandle ? "" : undefined}
        className="z-10 hidden h-6 w-1 shrink-0 rounded-lg bg-separator transition-[background-color,opacity,translate] duration-200 data-with-handle:flex group-data-collapsed/resizable-handle:flex group-data-collapsed/resizable-handle:opacity-0 group-data-collapsed/resizable-handle:group-hover/resizable-handle:opacity-100 group-data-collapsed/resizable-handle:group-data-[separator=hover]/resizable-handle:opacity-100 group-data-collapsed/resizable-handle:group-data-[separator=active]/resizable-handle:opacity-100 group-aria-[orientation=vertical]/resizable-handle:group-data-[collapsed=start]/resizable-handle:translate-x-1.5 group-aria-[orientation=vertical]/resizable-handle:group-data-[collapsed=end]/resizable-handle:-translate-x-1.5 rtl:group-aria-[orientation=vertical]/resizable-handle:group-data-[collapsed=start]/resizable-handle:-translate-x-1.5 rtl:group-aria-[orientation=vertical]/resizable-handle:group-data-[collapsed=end]/resizable-handle:translate-x-1.5 group-aria-[orientation=horizontal]/resizable-handle:group-data-[collapsed=start]/resizable-handle:translate-y-1.5 group-aria-[orientation=horizontal]/resizable-handle:group-data-[collapsed=end]/resizable-handle:-translate-y-1.5 group-data-[variant=cards]/resizable:flex group-data-[variant=cards]/resizable:h-10 group-data-[variant=cards]/resizable:rounded-full group-data-[variant=cards]/resizable:bg-label-quaternary group-data-[variant=cards]/resizable:group-data-[separator=active]/resizable-handle:bg-label-secondary group-data-[variant=cards]/resizable:group-data-[separator=hover]/resizable-handle:bg-label-secondary"
      />
    </ResizablePrimitive.Separator>
  )
}

export { ResizableHandle, ResizablePanel, ResizablePanelGroup }
