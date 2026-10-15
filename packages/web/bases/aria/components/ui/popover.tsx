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
        "z-50 flex w-72 origin-(--trigger-anchor-point) flex-col gap-4 rounded-2xl bg-popover p-4 text-base text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-hidden duration-100 data-[placement=bottom]:slide-in-from-top-2 data-[placement=left]:slide-in-from-right-2 data-[placement=right]:slide-in-from-left-2 data-[placement=top]:slide-in-from-bottom-2 dark:ring-foreground/10 data-entering:animate-in data-entering:fade-in-0 data-entering:zoom-in-95 data-exiting:animate-out data-exiting:fade-out-0 data-exiting:zoom-out-95",
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
      className={cn("flex flex-col gap-1 text-sm", className)}
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
      className={cn("text-base font-semibold", className)}
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
      className={cn("text-muted-foreground", className)}
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
