import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border border-transparent bg-clip-padding text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:focus-ring [--focus-ring-offset:3px] disabled:pointer-events-none aria-invalid:border-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground hover:bg-primary/80 disabled:opacity-50",
        outline:
          "border-border bg-background hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground dark:bg-transparent dark:hover:bg-accent dark:aria-expanded:bg-accent dark:hover:text-accent-foreground disabled:opacity-50",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50",
        tinted:
          "bg-primary/10 dark:bg-primary/20 text-primary hover:bg-primary/20 dark:hover:bg-primary/30 disabled:opacity-50",
        ghost:
          "hover:bg-accent hover:text-accent-foreground aria-expanded:bg-accent aria-expanded:text-accent-foreground disabled:opacity-50",
        plain:
          "text-primary hover:bg-accent aria-expanded:bg-accent disabled:opacity-50",
        destructive:
          "bg-destructive/10 dark:bg-destructive/20 text-destructive hover:bg-destructive/20 dark:hover:bg-destructive/30 hover:text-[color-mix(in_oklab,var(--destructive),var(--foreground)_15%)] [--focus-ring-color:var(--color-destructive)] dark:hover:text-destructive disabled:opacity-50",
        link: "text-primary hover:underline disabled:opacity-50",
      },
      size: {
        default:
          "h-9 gap-1.5 px-4 has-data-[icon=inline-end]:pe-3 has-data-[icon=inline-start]:ps-3",
        xs: "h-6 gap-1 px-2.75 text-2xs has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 px-3 has-data-[icon=inline-end]:pe-2 has-data-[icon=inline-start]:ps-2",
        lg: "h-11 gap-1.5 px-5.5 text-base has-data-[icon=inline-end]:pe-4.5 has-data-[icon=inline-start]:ps-4.5",
        xl: "h-14 gap-2 px-7.75 text-base has-data-[icon=inline-end]:pe-6 has-data-[icon=inline-start]:ps-6",
        icon: "size-9",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8",
        "icon-lg": "size-11",
        "icon-xl": "size-14",
      },
      block: {
        true: "w-full",
      },
    },
    compoundVariants: [
      { block: true, size: "xs", className: "rounded-sm" },
      { block: true, size: ["sm", "default"], className: "rounded-md" },
      { block: true, size: "lg", className: "rounded-lg" },
      { block: true, size: "xl", className: "rounded-xl" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  block,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, block, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
