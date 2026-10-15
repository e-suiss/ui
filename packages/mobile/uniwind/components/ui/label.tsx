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
      className="flex-row items-center gap-2"
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled ?? undefined}
    >
      <LabelPrimitive.Text
        className={(state) =>
          cn(
            "text-base font-semibold text-foreground",
            state.disabled && "opacity-50",
            resolveClassName(className, state)
          )
        }
        {...props}
      />
    </LabelPrimitive.Root>
  )
}

export { Label }
