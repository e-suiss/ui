"use client"

import * as React from "react"
import {
  Button as ButtonPrimitive,
  type ButtonProps as ButtonPrimitiveProps,
  OverlayArrow,
  type Placement,
  Tooltip as TooltipPrimitive,
  type TooltipProps as TooltipPrimitiveProps,
  type TooltipTriggerComponentProps,
  TooltipTrigger as TooltipTriggerPrimitive,
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

type TooltipDelay = {
  delay?: number
  closeDelay?: number
}

const TooltipProviderContext = React.createContext<TooltipDelay>({})

function TooltipProvider({
  delay = 0,
  closeDelay = 0,
  children,
}: TooltipDelay & { children?: React.ReactNode }) {
  const value = React.useMemo(
    () => ({ delay, closeDelay }),
    [delay, closeDelay]
  )

  return (
    <TooltipProviderContext.Provider value={value}>
      {children}
    </TooltipProviderContext.Provider>
  )
}

function Tooltip({
  delay,
  closeDelay,
  ...props
}: TooltipTriggerComponentProps) {
  const provider = React.useContext(TooltipProviderContext)

  return (
    <TooltipTriggerPrimitive
      delay={delay ?? provider.delay ?? 600}
      closeDelay={closeDelay ?? provider.closeDelay ?? 0}
      {...props}
    />
  )
}

function TooltipTrigger({
  className,
  ...props
}: Omit<ButtonPrimitiveProps, "className"> & { className?: string }) {
  return (
    <ButtonPrimitive
      data-slot="tooltip-trigger"
      className={className}
      {...props}
    />
  )
}

function TooltipContent({
  className,
  side = "top",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  children,
  ...props
}: Omit<
  TooltipPrimitiveProps,
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
    <TooltipPrimitive
      data-slot="tooltip-content"
      placement={toPlacement(side, align)}
      offset={sideOffset}
      crossOffset={alignOffset}
      className={cn(
        "z-50 inline-flex w-fit max-w-xs origin-(--trigger-anchor-point) items-center gap-1.5 rounded-xl bg-foreground px-3 py-1.5 text-xs text-background has-data-[slot=kbd]:pe-1.5 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm data-entering:animate-in data-entering:fade-in-0 data-entering:zoom-in-95 data-exiting:animate-out data-exiting:fade-out-0 data-exiting:zoom-out-95",
        className
      )}
      {...props}
    >
      {children}
      <OverlayArrow
        className="z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-xs bg-foreground fill-foreground data-[placement=bottom]:top-1 data-[placement=left]:top-1/2! data-[placement=left]:-right-1 data-[placement=left]:translate-x-[-1.5px] rtl:data-[placement=left]:translate-x-[1.5px] data-[placement=left]:-translate-y-1/2 data-[placement=right]:top-1/2! data-[placement=right]:-left-1 data-[placement=right]:translate-x-[1.5px] rtl:data-[placement=right]:translate-x-[-1.5px] data-[placement=right]:-translate-y-1/2 data-[placement=top]:-bottom-2.5"
        style={({ placement, defaultStyle }) => {
          const { top, bottom, left, right, transform, ...style } = defaultStyle
          return placement === "top" || placement === "bottom"
            ? { ...style, left, transform }
            : { ...style, top }
        }}
      />
    </TooltipPrimitive>
  )
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
