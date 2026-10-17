"use client"

import { Checkbox as CheckboxPrimitive } from "radix-ui"
import type * as React from "react"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { cn } from "@/lib/utils"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "cn-checkbox peer relative shrink-0 outline-none after:absolute after:-inset-x-3 after:-inset-y-2",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
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
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
