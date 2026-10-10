import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import * as React from "react"
import * as TogglePrimitive from "@/components/primitives/toggle"
import { resolveClassName } from "@/components/primitives/use-render"
import { Icon } from "@/components/ui/icon"
import { TextClassContext } from "@/components/ui/text"

const toggleVariants = cva(
  "group flex-row items-center justify-center gap-1 rounded-3xl active:bg-muted",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent active:bg-muted",
      },
      size: {
        default: "h-9 min-w-9 px-3",
        sm: "h-8 min-w-8 px-3",
        lg: "h-10 min-w-10 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TextClassContext.Provider
      value={cn(
        "text-sm font-medium text-foreground",
        typeof className === "string" ? className : undefined
      )}
    >
      <TogglePrimitive.Root
        className={(state) =>
          cn(
            toggleVariants({ variant, size }),
            state.disabled && "opacity-50",
            state.pressed && "bg-muted",
            resolveClassName(className, state)
          )
        }
        {...props}
      />
    </TextClassContext.Provider>
  )
}

function ToggleIcon({
  className,
  ...props
}: React.ComponentProps<typeof Icon>) {
  const textClass = React.useContext(TextClassContext)
  return (
    <Icon className={cn("size-4 shrink-0", textClass, className)} {...props} />
  )
}

export { Toggle, ToggleIcon, toggleVariants }
