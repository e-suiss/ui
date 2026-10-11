import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import * as React from "react"
import { Pressable } from "react-native"
import { IconClassContext } from "@/components/ui/icon"
import { TextClassContext } from "@/components/ui/text"

const buttonVariants = cva(
  "shrink-0 flex-row items-center justify-center rounded-full border border-transparent",
  {
    variants: {
      variant: {
        default:
          "bg-accent active:bg-accent-pressed disabled:bg-accent-disabled",
        outline:
          "border-separator bg-surface active:bg-item-pressed dark:bg-transparent",
        secondary:
          "bg-control active:bg-control-pressed disabled:bg-control-disabled",
        tinted:
          "bg-accent-surface active:bg-accent-surface-pressed disabled:bg-accent-surface",
        ghost: "active:bg-item-pressed",
        plain: "active:bg-item-pressed",
        destructive:
          "bg-danger-surface active:bg-danger-surface-pressed disabled:bg-danger-surface",
        link: "",
      },
      size: {
        default: "h-9 gap-1.5 px-4",
        xs: "h-6 gap-1 px-2.75",
        sm: "h-8 gap-1 px-3",
        lg: "h-11 gap-1.5 px-5.5",
        xl: "h-14 gap-2 px-7.75",
        icon: "size-9",
        "icon-xs": "size-6",
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

const buttonTextVariants = cva("text-sm text-label", {
  variants: {
    variant: {
      default: "text-on-accent",
      outline: "",
      secondary: "",
      tinted: "text-link",
      ghost: "",
      plain: "text-link",
      destructive: "text-danger",
      link: "text-link",
    },
    size: {
      default: "",
      xs: "text-2xs",
      sm: "",
      lg: "text-base",
      xl: "text-base",
      icon: "",
      "icon-xs": "",
      "icon-sm": "",
      "icon-lg": "",
      "icon-xl": "",
    },
    disabled: {
      true: "",
    },
  },
  compoundVariants: [
    {
      disabled: true,
      variant: ["outline", "secondary", "ghost", "link"],
      className: "text-label-quaternary",
    },
    {
      disabled: true,
      variant: ["tinted", "plain"],
      className: "text-link/40",
    },
    {
      disabled: true,
      variant: "destructive",
      className: "text-danger/40",
    },
  ],
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>

const ButtonClassContext = React.createContext<
  ((variant: ButtonVariant) => string | undefined) | undefined
>(undefined)

type ButtonProps = React.ComponentProps<typeof Pressable> &
  React.RefAttributes<typeof Pressable> &
  VariantProps<typeof buttonVariants>

function Button({ className, variant, size, block, ...props }: ButtonProps) {
  const disabled = Boolean(props.disabled)
  const groupClassName = React.useContext(ButtonClassContext)
  return (
    <ButtonClassContext.Provider value={undefined}>
      <TextClassContext.Provider
        value={buttonTextVariants({ variant, size, disabled })}
      >
        <IconClassContext.Provider
          value={size === "xs" || size === "icon-xs" ? "size-3" : "size-4"}
        >
          <Pressable
            className={cn(
              buttonVariants({ variant, size, block }),
              groupClassName?.(variant ?? "default"),
              className
            )}
            role="button"
            {...props}
          />
        </IconClassContext.Provider>
      </TextClassContext.Provider>
    </ButtonClassContext.Provider>
  )
}

export type { ButtonProps, ButtonVariant }
export { Button, ButtonClassContext, buttonTextVariants, buttonVariants }
