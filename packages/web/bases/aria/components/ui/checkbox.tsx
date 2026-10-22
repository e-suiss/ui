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
        "cn-checkbox flex cn-checkbox-aria peer relative shrink-0 outline-none after:absolute after:-inset-x-3 after:-inset-y-2",
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
              className="cn-checkbox-indicator grid place-content-center text-current transition-none [&>svg]:size-3.5"
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
