import { Button as ButtonPrimitive } from "@base-ui/react/button"
import {
  type CxOptions,
  cva,
  cx,
  type VariantProps,
} from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonStyles = cva(
  "cn-button group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "cn-button-variant-default",
        outline: "cn-button-variant-outline",
        secondary: "cn-button-variant-secondary",
        tinted: "cn-button-variant-tinted",
        ghost: "cn-button-variant-ghost",
        plain: "cn-button-variant-plain",
        destructive: "cn-button-variant-destructive",
        link: "cn-button-variant-link",
      },
      size: {
        default: "cn-button-size-default",
        xs: "cn-button-size-xs",
        sm: "cn-button-size-sm",
        lg: "cn-button-size-lg",
        xl: "cn-button-size-xl",
        icon: "cn-button-size-icon",
        "icon-xs": "cn-button-size-icon-xs",
        "icon-sm": "cn-button-size-icon-sm",
        "icon-lg": "cn-button-size-icon-lg",
        "icon-xl": "cn-button-size-icon-xl",
      },
      block: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const blockRadius = cva("", {
  variants: {
    size: {
      default: "cn-button-block-size-default",
      xs: "cn-button-block-size-xs",
      sm: "cn-button-block-size-sm",
      lg: "cn-button-block-size-lg",
      xl: "cn-button-block-size-xl",
      icon: "",
      "icon-xs": "",
      "icon-sm": "",
      "icon-lg": "",
      "icon-xl": "",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

function buttonVariants({
  block,
  size,
  className,
  ...props
}: VariantProps<typeof buttonStyles> & { className?: CxOptions[number] } = {}) {
  return cx(
    buttonStyles({ ...props, size, block }),
    block ? blockRadius({ size }) : undefined,
    className
  )
}

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
      data-variant={variant ?? "default"}
      data-size={size ?? "default"}
      className={cn(buttonVariants({ variant, size, block, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
