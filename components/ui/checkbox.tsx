"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { CheckIcon } from "@phosphor-icons/react"
import { cn } from "cn"

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-xs border border-transparent bg-label-quaternary transition-shadow outline-none group-has-disabled/field:bg-control-disabled data-checked:group-has-disabled/field:bg-accent-disabled group-has-focus-visible/field-label:ring-0 group-has-focus-visible/field-label:not-data-checked:border-transparent after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:focus-ring data-disabled:cursor-not-allowed data-disabled:bg-control-disabled data-disabled:data-checked:bg-accent-disabled data-disabled:data-checked:border-transparent aria-invalid:border-danger aria-invalid:aria-checked:border-accent data-checked:border-accent data-checked:bg-accent data-checked:text-on-accent group-has-focus-visible/field-label:data-checked:border-accent",
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
