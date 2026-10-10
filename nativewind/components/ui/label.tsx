import { cn } from "cn"
import * as LabelPrimitive from "@/components/primitives/label"
import { resolveClassName } from "@/components/primitives/use-render"

function Label({
  className,
  onPress,
  onLongPress,
  onPressIn,
  onPressOut,
  disabled,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Text>) {
  return (
    <LabelPrimitive.Root
      className={(state) =>
        cn(
          "flex select-none flex-row items-center gap-2",
          state.disabled && "opacity-50"
        )
      }
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled ?? undefined}
    >
      <LabelPrimitive.Text
        className={(state) =>
          cn(
            "text-foreground text-sm font-medium",
            resolveClassName(className, state)
          )
        }
        {...props}
      />
    </LabelPrimitive.Root>
  )
}

export { Label }
