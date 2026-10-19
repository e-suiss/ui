import { cn } from "cn"
import { MinusIcon, PlusIcon } from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import * as NumberField from "@/components/primitives/number-field"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

export default function PrimitivesNumberfieldControlled() {
  const [value, setValue] = React.useState<number | null>(2.5)
  return (
    <View className="w-full gap-2">
      <NumberField.Root
        className={(state) =>
          cn("w-full gap-2", state.disabled && "opacity-50")
        }
        value={value}
        onValueChange={setValue}
        step={0.5}
        min={0}
        format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
      >
        <Text className="text-sm font-medium">Weight</Text>
        <NumberField.Group className="h-11 flex-row items-center overflow-hidden rounded-lg bg-secondary">
          <NumberField.Decrement className="h-full w-12 items-center justify-center">
            <Icon as={MinusIcon} className="size-4" />
          </NumberField.Decrement>
          <NumberField.Input
            accessibilityLabel="Weight"
            className="h-full flex-1 text-center text-base text-foreground"
          />
          <NumberField.Increment className="h-full w-12 items-center justify-center">
            <Icon as={PlusIcon} className="size-4" />
          </NumberField.Increment>
        </NumberField.Group>
      </NumberField.Root>
      <Text variant="muted">Value: {value === null ? "empty" : value}</Text>
    </View>
  )
}
