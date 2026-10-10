import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Pressable } from "react-native"
import { TextClassContext } from "@/components/ui/text"

const buttonVariants = cva(
  "shrink-0 flex-row items-center justify-center rounded-full border border-transparent",
  {
    variants: {
      variant: {
        default: "bg-primary active:bg-primary/80",
        outline:
          "border-border bg-background active:bg-muted dark:bg-transparent dark:active:bg-input/30",
        secondary: "bg-secondary active:opacity-80",
        ghost: "active:bg-muted dark:active:bg-muted/50",
        destructive:
          "bg-destructive/10 active:bg-destructive/20 dark:bg-destructive/20 dark:active:bg-destructive/30",
        link: "",
      },
      size: {
        default: "h-9 gap-1.5 px-3",
        xs: "h-6 gap-1 px-2.5",
        sm: "h-8 gap-1 px-3",
        lg: "h-10 gap-1.5 px-4",
        icon: "size-9",
        "icon-xs": "size-6",
        "icon-sm": "size-8",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const buttonTextVariants = cva("text-sm font-medium text-foreground", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      outline: "",
      secondary: "text-secondary-foreground",
      ghost: "",
      destructive: "text-destructive",
      link: "text-primary",
    },
    size: {
      default: "",
      xs: "text-xs",
      sm: "",
      lg: "",
      icon: "",
      "icon-xs": "text-xs",
      "icon-sm": "",
      "icon-lg": "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

type ButtonProps = React.ComponentProps<typeof Pressable> &
  React.RefAttributes<typeof Pressable> &
  VariantProps<typeof buttonVariants>

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
      <Pressable
        className={cn(
          props.disabled && "opacity-50",
          buttonVariants({ variant, size }),
          className
        )}
        role="button"
        {...props}
      />
    </TextClassContext.Provider>
  )
}

export type { ButtonProps }
export { Button, buttonTextVariants, buttonVariants }
