"use client"

import { ScrollArea } from "@base-ui/react/scroll-area"
import { cn } from "cn"
import type * as React from "react"

const bar =
  "pointer-events-none z-10 flex touch-none opacity-0 transition-opacity duration-300 select-none data-hovering:pointer-events-auto data-hovering:opacity-100 data-scrolling:opacity-100 data-scrolling:duration-75"

export function CodeScroll({
  className,
  viewportClassName,
  children,
}: {
  className?: string
  viewportClassName?: string
  children: React.ReactNode
}) {
  return (
    <ScrollArea.Root className={cn("relative min-w-0", className)}>
      <ScrollArea.Viewport
        data-slot="code-viewport"
        className={cn(
          "overscroll-x-contain rounded-[inherit] outline-none [--fade-end:0px] [--fade-start:0px] mask-[linear-gradient(to_right,transparent,black_var(--fade-start),black_calc(100%-var(--fade-end)),transparent)] focus-visible:ring-3 focus-visible:ring-ring/50 data-overflow-x-end:[--fade-end:2.5rem] data-overflow-x-start:[--fade-start:1.5rem]",
          viewportClassName
        )}
      >
        {children}
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        orientation="horizontal"
        className={cn(bar, "h-2.5 flex-col px-3 pb-1")}
      >
        <ScrollArea.Thumb className="flex-1 rounded-full bg-foreground/30" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar
        orientation="vertical"
        className={cn(bar, "w-2.5 py-3 pe-1")}
      >
        <ScrollArea.Thumb className="flex-1 rounded-full bg-foreground/30" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  )
}
