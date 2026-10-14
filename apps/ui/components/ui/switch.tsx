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
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border-2 transition-colors outline-none group-has-focus-visible/field-label:ring-0 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:focus-ring aria-invalid:border-danger data-[size=default]:h-6 data-[size=default]:w-13 data-[size=sm]:h-5 data-[size=sm]:w-11 data-checked:border-accent data-checked:bg-accent group-has-focus-visible/field-label:data-checked:border-accent data-unchecked:border-transparent data-unchecked:bg-label-quaternary group-has-focus-visible/field-label:data-unchecked:border-transparent data-disabled:cursor-not-allowed data-disabled:data-checked:border-transparent data-disabled:data-checked:bg-accent-disabled data-disabled:data-unchecked:bg-control-disabled",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full bg-surface shadow-sm ring-0 transition-[translate,width] duration-200 ease-[cubic-bezier(0.32,0.72,0,1)] not-dark:bg-clip-padding group-data-[size=default]/switch:h-5 group-data-[size=default]/switch:w-8 group-data-[size=sm]/switch:h-4 group-data-[size=sm]/switch:w-6.5 data-unchecked:translate-x-0 group-data-[size=default]/switch:data-checked:translate-x-4 group-data-[size=sm]/switch:data-checked:translate-x-3.5 rtl:group-data-[size=default]/switch:data-checked:-translate-x-4 rtl:group-data-[size=sm]/switch:data-checked:-translate-x-3.5 group-[:active:not([data-disabled])]/switch:group-data-[size=default]/switch:w-9 group-[:active:not([data-disabled])]/switch:group-data-[size=sm]/switch:w-7.5 group-[:active:not([data-disabled])]/switch:group-data-[size=default]/switch:data-checked:translate-x-3 group-[:active:not([data-disabled])]/switch:group-data-[size=sm]/switch:data-checked:translate-x-2.5 rtl:group-[:active:not([data-disabled])]/switch:group-data-[size=default]/switch:data-checked:-translate-x-3 rtl:group-[:active:not([data-disabled])]/switch:group-data-[size=sm]/switch:data-checked:-translate-x-2.5 dark:bg-label"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
