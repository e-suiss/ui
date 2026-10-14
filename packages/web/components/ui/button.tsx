import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

const buttonVariants = cva(
  "inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full border border-transparent bg-clip-padding text-sm whitespace-nowrap transition-colors outline-none select-none focus-visible:focus-ring [--focus-ring-offset:3px] disabled:pointer-events-none aria-invalid:border-danger [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-accent text-on-accent hover:bg-accent-hover active:bg-accent-pressed disabled:bg-accent-disabled",
        outline:
          "border-separator bg-surface hover:bg-item-hover hover:text-label active:bg-item-pressed aria-expanded:bg-item-selected aria-expanded:text-label dark:bg-transparent dark:hover:bg-item-hover dark:active:bg-item-pressed dark:aria-expanded:bg-item-selected disabled:text-label-quaternary",
        secondary:
          "bg-control text-label hover:bg-control-hover active:bg-control-pressed disabled:bg-control-disabled disabled:text-label-quaternary",
        tinted:
          "bg-accent-surface text-link hover:bg-accent-surface-hover active:bg-accent-surface-pressed disabled:bg-accent-surface disabled:text-link/40",
        ghost:
          "hover:bg-item-hover hover:text-label aria-expanded:bg-item-selected aria-expanded:text-label disabled:text-label-quaternary",
        plain:
          "text-link hover:bg-item-hover active:bg-item-pressed aria-expanded:bg-item-selected disabled:text-link/40",
        destructive:
          "bg-danger-surface text-danger hover:bg-danger-surface-hover hover:text-[color-mix(in_oklab,var(--danger),var(--label)_15%)] active:bg-danger-surface-pressed [--focus-ring-color:var(--color-danger)] dark:hover:text-danger disabled:bg-danger-surface disabled:text-danger/40",
        link: "text-link hover:underline disabled:text-label-quaternary",
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
