"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

function ScrollArea({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="scroll-area"
      className={cn("cn-scroll-area relative", className)}
      {...props}
    >
      <div
        data-slot="scroll-area-viewport"
        // biome-ignore lint/a11y/noNoninteractiveTabindex: the scrollable viewport is reachable by keyboard
        tabIndex={0}
        className="cn-scroll-area-viewport"
      >
        {children}
      </div>
    </div>
  )
}

function ScrollBar(
  _props: React.ComponentProps<"div"> & {
    orientation?: "vertical" | "horizontal"
  }
) {
  return null
}

export { ScrollArea, ScrollBar }
