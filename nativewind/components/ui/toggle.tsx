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
        outline: "border border-separator bg-transparent",
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
  if (state.disabled) return state.pressed ? "bg-control-disabled" : undefined
  return cn(
    "active:scale-[0.96]",
    state.pressed
      ? "bg-item-hover active:bg-item-pressed"
      : "active:bg-item-hover"
  )
}

function toggleTextClassName(state: ToggleState) {
  return cn(
    "text-sm text-label",
    state.pressed && "text-link",
    state.disabled && "text-label-quaternary"
  )
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
