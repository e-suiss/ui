import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import type * as React from "react"
import { cn } from "@/lib/utils"

const markerVariants = cva(
  "cn-marker group/marker relative flex items-center [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "",
        separator: "cn-marker-variant-separator",
        border: "cn-marker-variant-border",
      },
    },
  }
)

function Marker({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof markerVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      data-slot="marker"
      data-variant={variant}
      className={cn(markerVariants({ variant, className }))}
      {...props}
    />
  )
}

function MarkerIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="marker-icon"
      aria-hidden="true"
      className={cn(
        "cn-marker-icon shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    />
  )
}

function MarkerContent({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="marker-content"
      className={cn(
        "cn-marker-content min-w-0 wrap-break-word *:[a]:underline *:[a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export { Marker, MarkerContent, MarkerIcon }
