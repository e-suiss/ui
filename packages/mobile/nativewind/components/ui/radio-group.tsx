import { cn } from "cn"
import { View } from "react-native"
import * as RadioPrimitive from "@/components/primitives/radio"
import {
  RadioGroup as RadioGroupPrimitive,
  type RadioGroupProps,
} from "@/components/primitives/radio-group"
import { resolveClassName } from "@/components/primitives/use-render"

const HIT_SLOP = { top: 8, bottom: 8, left: 12, right: 12 }

function RadioGroup<Value = string>({
  className,
  ...props
}: RadioGroupProps<Value>) {
  return (
    <RadioGroupPrimitive<Value>
      className={(state) =>
        cn("w-full gap-3", resolveClassName(className, state))
      }
      {...props}
    />
  )
}

function RadioGroupItem<Value = string>({
  className,
  invalid,
  ...props
}: RadioPrimitive.RootProps<Value> & { invalid?: boolean }) {
  return (
    <RadioPrimitive.Root<Value>
      className={(state) =>
        cn(
          "aspect-square size-4 shrink-0 items-center justify-center rounded-full border",
          state.checked
            ? "border-primary bg-primary"
            : cn(
                "border-foreground-25 bg-background shadow-sm dark:border-transparent dark:bg-border dark:shadow-none",
                invalid && "border-destructive dark:border-destructive"
              ),
          state.disabled ? "opacity-50" : "active:opacity-80",
          resolveClassName(className, state)
        )
      }
      hitSlop={HIT_SLOP}
      {...props}
    >
      <RadioPrimitive.Indicator className="items-center justify-center">
        <View className="size-2 rounded-full bg-primary-foreground dark:size-2.5" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
