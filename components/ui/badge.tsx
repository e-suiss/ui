import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const badgeVariants = cva(
  "inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent text-xs font-semibold whitespace-nowrap transition-colors focus-visible:focus-ring aria-invalid:border-danger [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "text-link [a]:hover:underline",
        secondary: "text-label-secondary [a]:hover:underline",
        destructive:
          "text-danger [--focus-ring-color:var(--color-danger)] [a]:hover:underline",
        outline:
          "border-separator px-2 text-label has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [a]:hover:bg-item-hover",
        ghost:
          "px-2 has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [a]:hover:bg-item-hover [a]:hover:text-label-secondary",
        link: "text-link hover:underline",
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
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge }
