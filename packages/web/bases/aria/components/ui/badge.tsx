import { cva, type VariantProps } from "class-variance-authority"
import type * as React from "react"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "cn-badge inline-flex w-fit shrink-0 items-center justify-center overflow-hidden whitespace-nowrap [&>svg]:pointer-events-none group/badge [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "cn-badge-variant-default",
        secondary: "cn-badge-variant-secondary",
        destructive: "cn-badge-variant-destructive",
        outline: "cn-badge-variant-outline",
        ghost: "cn-badge-variant-ghost",
        link: "cn-badge-variant-link",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: React.ComponentProps<"span"> & {
  render?: (props: React.HTMLAttributes<HTMLElement>) => React.ReactNode
} & VariantProps<typeof badgeVariants>) {
  const merged = {
    "data-slot": "badge",
    "data-variant": variant,
    className: cn(badgeVariants({ variant }), className),
    ...props,
  }
  if (render) return render(merged as React.HTMLAttributes<HTMLElement>)
  return <span {...merged} />
}

export { Badge }
