"use client"

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-1 rounded-lg text-sm whitespace-nowrap transition-[color,background-color,scale] duration-200 ease-[cubic-bezier(0.3,1.25,0.5,1)] outline-none active:scale-96 motion-reduce:active:scale-100 hover:bg-item-hover hover:text-label focus-visible:focus-ring disabled:pointer-events-none disabled:text-label-quaternary aria-invalid:border-danger aria-pressed:bg-item-hover aria-pressed:text-link aria-pressed:hover:bg-item-hover aria-pressed:hover:text-link aria-pressed:active:bg-item-pressed disabled:aria-pressed:bg-control-disabled disabled:aria-pressed:text-label-quaternary [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-separator bg-transparent hover:bg-item-hover",
      },
      size: {
        default:
          "h-9 min-w-9 px-3 has-data-[icon=inline-end]:pe-2.5 has-data-[icon=inline-start]:ps-2.5",
        sm: "h-8 min-w-8 px-3 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2",
        lg: "h-10 min-w-10 px-4 has-data-[icon=inline-end]:pe-3 has-data-[icon=inline-start]:ps-3",
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
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
