"use client"

import { Radio as RadioPrimitive } from "@base-ui/react/radio"
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group"
import { cn } from "cn"

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid w-full gap-3", className)}
      {...props}
    />
  )
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "peer relative flex aspect-square size-4 shrink-0 rounded-full border border-label/25 bg-surface shadow-[0_0.5px_1px_color-mix(in_oklab,var(--label)_12%,transparent)] outline-none [--focus-ring-offset:0px] group-has-focus-visible/field-label:ring-0 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:focus-ring active:not-data-checked:bg-control dark:not-data-checked:border-transparent dark:not-data-checked:not-data-disabled:bg-label-quaternary dark:shadow-none dark:active:not-data-checked:bg-[color-mix(in_oklab,var(--label-quaternary),var(--label)_12%)] data-checked:border-accent data-checked:bg-accent data-checked:text-on-accent data-checked:shadow-none data-checked:active:border-accent-pressed data-checked:active:bg-accent-pressed data-disabled:cursor-not-allowed data-disabled:border-label/10 data-disabled:bg-control-disabled data-disabled:shadow-none data-disabled:data-checked:border-transparent data-disabled:data-checked:bg-accent-disabled aria-invalid:border-danger",
        className
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex size-4 items-center justify-center"
      >
        <span className="absolute top-1/2 inset-s-1/2 size-2 -translate-x-1/2 rtl:translate-x-1/2 -translate-y-1/2 rounded-full bg-on-accent dark:size-2.5" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
