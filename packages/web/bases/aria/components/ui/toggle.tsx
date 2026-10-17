"use client"

import { cva, type VariantProps } from "class-variance-authority"
import {
  ToggleButton as TogglePrimitive,
  type ToggleButtonProps as TogglePrimitiveProps,
} from "react-aria-components"
import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "cn-toggle cn-toggle-aria inline-flex items-center justify-center whitespace-nowrap outline-none disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 disabled:opacity-50 group/toggle [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "cn-toggle-variant-default",
        outline: "cn-toggle-variant-outline",
      },
      size: {
        default: "cn-toggle-size-default",
        sm: "cn-toggle-size-sm",
        lg: "cn-toggle-size-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant,
  size,
  ...props
}: Omit<TogglePrimitiveProps, "className"> &
  VariantProps<typeof toggleVariants> & { className?: string }) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
