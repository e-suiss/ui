"use client"

import {
  Separator as SeparatorPrimitive,
  type SeparatorProps as SeparatorPrimitiveProps,
} from "react-aria-components"
import { cn } from "@/lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  elementType = "div",
  ...props
}: Omit<SeparatorPrimitiveProps, "className"> & { className?: string }) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      elementType={elementType}
      data-orientation={orientation}
      data-horizontal={orientation === "horizontal" || undefined}
      data-vertical={orientation === "vertical" || undefined}
      className={cn("cn-separator shrink-0 bg-border", className)}
      {...props}
    />
  )
}

export { Separator }
