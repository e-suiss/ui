import { cn } from "cn"
import { View } from "react-native"
import * as RadioGroupPrimitive from "@/components/primitives/radio-group"
import { resolveClassName } from "@/components/primitives/use-render"

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      className={(state) => cn("gap-3", resolveClassName(className, state))}
      {...props}
    />
  )
}

function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      className={(state) =>
        cn(
          "aspect-square size-4 shrink-0 items-center justify-center rounded-full border border-transparent bg-input-90",
          state.disabled && "opacity-50",
          resolveClassName(className, state)
        )
      }
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="size-4 items-center justify-center rounded-full bg-primary">
        <View className="size-2 rounded-full bg-primary-foreground dark:size-2.5" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  )
}

export { RadioGroup, RadioGroupItem }
