import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Pressable } from "react-native"
import {
  Toggle as TogglePrimitive,
  type ToggleState,
} from "@/components/primitives/toggle"
import { resolveClassName } from "@/components/primitives/use-render"
import { Icon } from "@/components/ui/icon"
import { TextClassContext } from "@/components/ui/text"

const toggleVariants = cva(
  "flex-row items-center justify-center gap-1 rounded-lg",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-border bg-transparent",
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

function toggleStateClassName(state: ToggleState) {
  return cn(
    state.pressed && "bg-accent",
    state.disabled ? "opacity-50" : "active:scale-96 active:opacity-80"
  )
}

function toggleTextClassName(state: ToggleState) {
  return cn("text-sm text-foreground", state.pressed && "text-primary")
}

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      className={(state) =>
        cn(
          toggleVariants({ variant, size }),
          toggleStateClassName(state),
          resolveClassName(className, state)
        )
      }
      render={(renderProps, state) => (
        <TextClassContext.Provider value={toggleTextClassName(state)}>
          <Pressable {...renderProps} />
        </TextClassContext.Provider>
      )}
      {...props}
    />
  )
}

function ToggleIcon({
  className,
  ...props
}: React.ComponentProps<typeof Icon>) {
  return <Icon className={cn("size-4 shrink-0", className)} {...props} />
}

export {
  Toggle,
  ToggleIcon,
  toggleStateClassName,
  toggleTextClassName,
  toggleVariants,
}
