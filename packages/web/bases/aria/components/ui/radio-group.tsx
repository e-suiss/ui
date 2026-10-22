"use client"

import type * as React from "react"
import {
  RadioGroup as RadioGroupPrimitive,
  type RadioGroupProps as RadioGroupPrimitiveProps,
  Radio as RadioPrimitive,
  type RadioProps as RadioPrimitiveProps,
} from "react-aria-components"
import { cn } from "@/lib/utils"

function RadioGroup({
  className,
  ...props
}: Omit<RadioGroupPrimitiveProps, "className"> & { className?: string }) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("cn-radio-group w-full", className)}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  children,
  ...props
}: Omit<RadioPrimitiveProps, "className" | "children"> & {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <RadioPrimitive
      data-slot="radio-group-item"
      className={cn(
        "cn-radio-group-item flex cn-radio-group-item-aria peer relative aspect-square shrink-0 border outline-none after:absolute after:-inset-x-3 after:-inset-y-2 group/radio-group-item",
        className
      )}
      {...props}
    >
      {({ isSelected }) => (
        <>
          {isSelected && (
            <span
              data-slot="radio-group-indicator"
              className="cn-radio-group-indicator"
            >
              <span className="absolute top-1/2 inset-s-1/2 size-2 -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground dark:size-2.5" />
            </span>
          )}
          {children}
        </>
      )}
    </RadioPrimitive>
  )
}

export { RadioGroup, RadioGroupItem }
