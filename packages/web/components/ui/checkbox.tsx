"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { CheckIcon } from "@phosphor-icons/react"
import { cn } from "cn"

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-4 shrink-0 items-center justify-center rounded-[calc(var(--radius)*0.4)] border border-foreground/25 bg-background shadow-[0_0.5px_1px_color-mix(in_oklab,var(--foreground)_12%,transparent)] outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:not-data-checked:border-transparent dark:not-data-checked:bg-border dark:shadow-none data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground data-checked:shadow-none data-disabled:cursor-not-allowed data-disabled:shadow-none data-disabled:data-checked:border-transparent aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:aria-checked:border-primary group-has-focus-visible/field-label:ring-0 group-has-focus-visible/field-label:data-checked:border-primary data-disabled:opacity-50 group-has-disabled/field:opacity-50",
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
