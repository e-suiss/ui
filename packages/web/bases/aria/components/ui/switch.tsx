"use client"

import type * as React from "react"
import {
  SwitchButton,
  SwitchField,
  type SwitchFieldProps,
} from "react-aria-components"
import { cn } from "@/lib/utils"

function Switch({
  className,
  size = "default",
  children,
  ...props
}: Omit<SwitchFieldProps, "className" | "children"> & {
  className?: string
  children?: React.ReactNode
  size?: "sm" | "default"
}) {
  return (
    <SwitchField className="contents" {...props}>
      <SwitchButton
        data-slot="switch"
        data-size={size}
        className={cn(
          "cn-switch cn-switch-aria peer group/switch relative inline-flex items-center outline-none after:absolute after:-inset-x-3 after:-inset-y-2 data-disabled:cursor-not-allowed data-disabled:opacity-50",
          className
        )}
      >
        {({ isSelected }) => (
          <>
            <span
              data-slot="switch-thumb"
              data-checked={isSelected || undefined}
              data-unchecked={!isSelected || undefined}
              className="cn-switch-thumb cn-switch-thumb-aria pointer-events-none block ring-0"
            />
            {children}
          </>
        )}
      </SwitchButton>
    </SwitchField>
  )
}

export { Switch }
