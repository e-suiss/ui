"use client"

import type * as React from "react"
import {
  Link as LinkPrimitive,
  type LinkProps as LinkPrimitiveProps,
  type Placement,
  Popover as PopoverPrimitive,
  type PopoverProps as PopoverPrimitiveProps,
  PreviewTrigger as PreviewTriggerPrimitive,
  type PreviewTriggerProps as PreviewTriggerPrimitiveProps,
} from "react-aria-components"
import { cn } from "@/lib/utils"

type Side = "top" | "right" | "bottom" | "left" | "inline-start" | "inline-end"
type Align = "start" | "center" | "end"

const AXES = {
  top: "top",
  right: "right",
  bottom: "bottom",
  left: "left",
  "inline-start": "start",
  "inline-end": "end",
} as const

function toPlacement(side: Side, align: Align): Placement {
  const axis = AXES[side]
  if (align === "center") return axis
  if (axis === "top" || axis === "bottom") return `${axis} ${align}`
  return `${axis} ${align === "start" ? "top" : "bottom"}`
}

function HoverCard({ ...props }: PreviewTriggerPrimitiveProps) {
  return <PreviewTriggerPrimitive {...props} />
}

function HoverCardTrigger({
  className,
  ...props
}: Omit<LinkPrimitiveProps, "className"> & { className?: string }) {
  return (
    <LinkPrimitive
      data-slot="hover-card-trigger"
      className={className}
      {...props}
    />
  )
}

function HoverCardContent({
  className,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 4,
  children,
  ...props
}: Omit<
  PopoverPrimitiveProps,
  "className" | "children" | "placement" | "offset" | "crossOffset"
> & {
  className?: string
  children?: React.ReactNode
  align?: Align
  alignOffset?: number
  side?: Side
  sideOffset?: number
}) {
  return (
    <PopoverPrimitive
      data-slot="hover-card-content"
      placement={toPlacement(side, align)}
      offset={sideOffset}
      crossOffset={alignOffset}
      className={cn(
        "cn-hover-card-content-aria z-50 origin-(--trigger-anchor-point) outline-hidden",
        className
      )}
      {...props}
    >
      {children}
    </PopoverPrimitive>
  )
}

export { HoverCard, HoverCardContent, HoverCardTrigger }
