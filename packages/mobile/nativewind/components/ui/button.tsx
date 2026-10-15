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
        default: "bg-primary active:opacity-80 disabled:opacity-50",
        outline:
          "border-border bg-background active:opacity-80 disabled:opacity-50 dark:bg-transparent",
        secondary: "bg-secondary active:opacity-80 disabled:opacity-50",
        tinted:
          "bg-primary-10 active:opacity-80 disabled:opacity-50 dark:bg-primary-20",
        ghost: "active:opacity-80 disabled:opacity-50",
        plain: "active:opacity-80 disabled:opacity-50",
        destructive:
          "bg-destructive-10 active:opacity-80 disabled:opacity-50 dark:bg-destructive-20",
        link: "active:opacity-80 disabled:opacity-50",
      },
      size: {
        default: "h-9 gap-1.5 px-4",
        xs: "h-6 gap-1 px-[0.6875rem]",
        sm: "h-8 gap-1 px-3",
        lg: "h-11 gap-1.5 px-[1.375rem]",
        xl: "h-14 gap-2 px-[1.9375rem]",
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

const buttonTextVariants = cva("text-sm text-foreground", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      outline: "",
      secondary: "text-secondary-foreground",
      tinted: "text-primary",
      ghost: "",
      plain: "text-primary",
      destructive: "text-destructive",
      link: "text-primary",
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
  },
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
  React.RefAttributes<React.ComponentRef<typeof Pressable>> &
  VariantProps<typeof buttonVariants>

function Button({ className, variant, size, block, ...props }: ButtonProps) {
  const groupClassName = React.useContext(ButtonClassContext)
  return (
    <ButtonClassContext.Provider value={undefined}>
      <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
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
