import { cn } from "cn"
import * as LabelPrimitive from "@/components/primitives/label"

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
      className={cn(
        "flex select-none flex-row items-center gap-2",
        disabled && "opacity-50"
      )}
      onPress={onPress}
      onLongPress={onLongPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      disabled={disabled}
    >
      <LabelPrimitive.Text
        className={cn("text-foreground text-sm font-medium", className)}
        {...props}
      />
    </LabelPrimitive.Root>
  )
}

export { Label }
