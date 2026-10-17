"use client"

import * as React from "react"
import {
  Button as ButtonPrimitive,
  type ButtonProps as ButtonPrimitiveProps,
  DialogTrigger as DialogTriggerPrimitive,
  type DialogTriggerProps as DialogTriggerPrimitiveProps,
  type Placement,
  Popover as PopoverPrimitive,
  type PopoverProps as PopoverPrimitiveProps,
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

function useLabelling<T extends HTMLElement>(
  attribute: "aria-labelledby" | "aria-describedby"
) {
  const id = React.useId()
  const ref = React.useRef<T>(null)

  React.useLayoutEffect(() => {
    const popup = ref.current?.closest('[data-trigger="DialogTrigger"]')
    if (!popup) return
    popup.setAttribute(attribute, id)
    return () => popup.removeAttribute(attribute)
  }, [attribute, id])

  return { id, ref }
}

function Popover({ ...props }: DialogTriggerPrimitiveProps) {
  return <DialogTriggerPrimitive {...props} />
}

function PopoverTrigger({
  className,
  ...props
}: Omit<ButtonPrimitiveProps, "className"> & { className?: string }) {
  return (
    <ButtonPrimitive
      data-slot="popover-trigger"
      className={className}
      {...props}
    />
  )
}

function PopoverContent({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
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
      data-slot="popover-content"
      placement={toPlacement(side, align)}
      offset={sideOffset}
      crossOffset={alignOffset}
      className={cn(
        "cn-popover-content-aria z-50 w-72 origin-(--trigger-anchor-point) outline-hidden",
        className
      )}
      {...props}
    >
      {children}
    </PopoverPrimitive>
  )
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("cn-popover-header", className)}
      {...props}
    />
  )
}

function PopoverTitle({ className, ...props }: React.ComponentProps<"h2">) {
  const { id, ref } = useLabelling<HTMLHeadingElement>("aria-labelledby")

  return (
    <h2
      ref={ref}
      id={id}
      data-slot="popover-title"
      className={cn("cn-popover-title", className)}
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  const { id, ref } = useLabelling<HTMLParagraphElement>("aria-describedby")

  return (
    <p
      ref={ref}
      id={id}
      data-slot="popover-description"
      className={cn("cn-popover-description", className)}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
}
