import * as React from "react"
import { View } from "react-native"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const options = [
  { value: "default", label: "Default" },
  { value: "comfortable", label: "Comfortable" },
  { value: "compact", label: "Compact" },
]

function RadioGroupDemo({
  disabled = false,
  disabledItem,
}: {
  disabled?: boolean
  disabledItem?: string
}) {
  const [value, setValue] = React.useState("comfortable")
  return (
    <RadioGroup value={value} onValueChange={setValue} disabled={disabled}>
      {options.map((option) => {
        const isDisabled = disabled || option.value === disabledItem
        return (
          <View key={option.value} className="flex-row items-center gap-3">
            <RadioGroupItem
              value={option.value}
              accessibilityLabelledBy={`radio-${option.value}`}
              disabled={isDisabled}
            />
            <Label
              nativeID={`radio-${option.value}`}
              disabled={isDisabled}
              onPress={() => setValue(option.value)}
            >
              {option.label}
            </Label>
          </View>
        )
      })}
    </RadioGroup>
  )
}

export default function RadioGroupDisabledItem() {
  return <RadioGroupDemo disabledItem="compact" />
}
