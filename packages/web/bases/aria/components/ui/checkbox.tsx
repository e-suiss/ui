"use client"

import type * as React from "react"
import {
  Checkbox as CheckboxPrimitive,
  type CheckboxProps as CheckboxPrimitiveProps,
} from "react-aria-components"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { cn } from "@/lib/utils"

function Checkbox({
  className,
  children,
  checked,
  defaultChecked,
  disabled,
  onCheckedChange,
  isSelected = checked,
  defaultSelected = defaultChecked,
  isDisabled = disabled,
  onChange,
  ...props
}: Omit<CheckboxPrimitiveProps, "className" | "children"> & {
  className?: string
  children?: React.ReactNode
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  onCheckedChange?: (checked: boolean) => void
}) {
  return (
    <CheckboxPrimitive
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-[calc(var(--radius)*0.4)] border border-foreground/25 bg-background shadow-[0_0.5px_1px_color-mix(in_oklab,var(--foreground)_12%,transparent)] outline-none after:absolute after:-inset-x-3 after:-inset-y-2 data-focus-visible:border-ring data-focus-visible:ring-3 data-focus-visible:ring-ring/50 dark:not-data-selected:border-transparent dark:not-data-selected:bg-border dark:shadow-none data-selected:border-primary data-selected:bg-primary data-selected:text-primary-foreground data-selected:shadow-none data-disabled:cursor-not-allowed data-disabled:shadow-none data-disabled:data-selected:border-transparent data-invalid:border-destructive data-invalid:ring-3 data-invalid:ring-destructive/20 dark:data-invalid:ring-destructive/40 data-invalid:data-selected:border-primary group-has-focus-visible/field-label:ring-0 group-has-focus-visible/field-label:data-selected:border-primary data-disabled:opacity-50 group-has-disabled/field:opacity-50",
        className
      )}
      {...props}
      isSelected={isSelected}
      defaultSelected={defaultSelected}
      isDisabled={isDisabled}
      onChange={(next) => {
        onChange?.(next)
        onCheckedChange?.(next)
      }}
    >
      {({ isSelected, isIndeterminate }) => (
        <>
          {(isSelected || isIndeterminate) && (
            <span
              data-slot="checkbox-indicator"
              className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
            >
              <IconPlaceholder
                lucide="CheckIcon"
                tabler="IconCheck"
                hugeicons="Tick02Icon"
                phosphor="CheckIcon"
                remixicon="RiCheckLine"
              />
            </span>
          )}
          {children}
        </>
      )}
    </CheckboxPrimitive>
  )
}

export { Checkbox }
