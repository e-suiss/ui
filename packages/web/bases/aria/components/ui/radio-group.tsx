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
      className={cn("grid w-full gap-3", className)}
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
        "peer relative flex aspect-square size-4 shrink-0 rounded-full border border-foreground/25 bg-background shadow-[0_0.5px_1px_color-mix(in_oklab,var(--foreground)_12%,transparent)] outline-none group-has-focus-visible/field-label:ring-0 after:absolute after:-inset-x-3 after:-inset-y-2 data-focus-visible:border-ring data-focus-visible:ring-3 data-focus-visible:ring-ring/50 dark:not-data-selected:border-transparent dark:not-data-selected:bg-border dark:shadow-none data-selected:border-primary data-selected:bg-primary data-selected:text-primary-foreground data-selected:shadow-none data-disabled:cursor-not-allowed data-disabled:shadow-none data-disabled:data-selected:border-transparent data-invalid:border-destructive data-invalid:ring-3 data-invalid:ring-destructive/20 dark:data-invalid:ring-destructive/40 data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {({ isSelected }) => (
        <>
          {isSelected && (
            <span
              data-slot="radio-group-indicator"
              className="flex size-4 items-center justify-center"
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
