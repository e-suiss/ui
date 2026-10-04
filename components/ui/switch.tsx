"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"
import { cn } from "cn"

function Switch({
  className,
  size = "default",
  ...props
}: SwitchPrimitive.Root.Props & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border-2 transition-all outline-none group-has-focus-visible/field-label:ring-0 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:focus-ring aria-invalid:border-danger data-[size=default]:h-5 data-[size=default]:w-11 data-[size=sm]:h-4 data-[size=sm]:w-7 data-checked:border-accent data-checked:bg-accent group-has-focus-visible/field-label:data-checked:border-accent data-unchecked:border-transparent data-unchecked:bg-label-quaternary group-has-focus-visible/field-label:data-unchecked:border-transparent data-disabled:cursor-not-allowed data-disabled:data-checked:border-transparent data-disabled:data-checked:bg-accent-disabled data-disabled:data-unchecked:bg-control-disabled",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full bg-surface shadow-sm ring-0 transition-transform not-dark:bg-clip-padding group-data-[size=default]/switch:h-4 group-data-[size=default]/switch:w-6 group-data-[size=sm]/switch:h-3 group-data-[size=sm]/switch:w-4 data-checked:translate-x-[calc(100%-8px)] rtl:data-checked:-translate-x-[calc(100%-8px)] dark:data-checked:bg-on-accent data-unchecked:translate-x-0 rtl:data-unchecked:translate-x-0 dark:data-unchecked:bg-label"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
