"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { CheckIcon } from "@phosphor-icons/react"
import { cn } from "cn"

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-[calc(var(--radius)*0.4)] border border-label/25 bg-surface shadow-[0_0.5px_1px_color-mix(in_oklab,var(--label)_12%,transparent)] outline-none [--focus-ring-offset:0px] after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:focus-ring active:not-data-checked:bg-control dark:not-data-checked:border-transparent dark:not-data-checked:not-data-disabled:bg-label-quaternary dark:shadow-none dark:active:not-data-checked:bg-[color-mix(in_oklab,var(--label-quaternary),var(--label)_12%)] data-checked:border-accent data-checked:bg-accent data-checked:text-on-accent data-checked:shadow-none data-checked:active:border-accent-pressed data-checked:active:bg-accent-pressed data-disabled:cursor-not-allowed data-disabled:border-label/10 data-disabled:bg-control-disabled data-disabled:shadow-none data-disabled:data-checked:border-transparent data-disabled:data-checked:bg-accent-disabled aria-invalid:border-danger aria-invalid:aria-checked:border-accent group-has-disabled/field:bg-control-disabled data-checked:group-has-disabled/field:bg-accent-disabled group-has-focus-visible/field-label:ring-0 group-has-focus-visible/field-label:data-checked:border-accent",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
      >
        <CheckIcon />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
