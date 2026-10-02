import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const badgeVariants = cva(
  "inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-sm border border-transparent text-xs font-semibold whitespace-nowrap underline-offset-4 transition-colors focus-visible:focus-ring aria-invalid:border-destructive [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "text-link [a]:hover:underline",
        secondary: "text-muted-foreground [a]:hover:underline",
        destructive:
          "text-destructive [--focus-ring-color:var(--color-destructive)] [a]:hover:underline",
        outline:
          "border-border px-2 text-foreground has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [a]:hover:bg-muted",
        ghost:
          "px-2 has-data-[icon=inline-end]:pe-1.5 has-data-[icon=inline-start]:ps-1.5 [a]:hover:bg-muted [a]:hover:text-muted-foreground dark:[a]:hover:bg-muted/50",
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

export { Badge, badgeVariants }
