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
          state.checked &&
            state.disabled &&
            "border-transparent bg-accent-disabled",
          state.checked &&
            !state.disabled &&
            "border-accent bg-accent active:border-accent-pressed active:bg-accent-pressed",
          !state.checked &&
            state.disabled &&
            "border-label/10 bg-control-disabled dark:border-transparent",
          !(state.checked || state.disabled) &&
            cn(
              "border-label/25 bg-surface shadow-xs active:bg-control dark:border-transparent dark:bg-label-quaternary dark:shadow-none",
              invalid && "border-danger dark:border-danger"
            ),
          resolveClassName(className, state)
        )
      }
      hitSlop={HIT_SLOP}
      {...props}
    >
      <RadioPrimitive.Indicator className="items-center justify-center">
        <View className="size-2 rounded-full bg-on-accent dark:size-2.5" />
      </RadioPrimitive.Indicator>
    </RadioPrimitive.Root>
  )
}

export { RadioGroup, RadioGroupItem }
