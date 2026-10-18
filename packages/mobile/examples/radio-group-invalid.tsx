import { View } from "react-native"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

const options = [
  { value: "default", label: "Default" },
  { value: "comfortable", label: "Comfortable" },
  { value: "compact", label: "Compact" },
]

export default function RadioGroupInvalid() {
  return (
    <RadioGroup className="gap-3">
      {options.map((option) => (
        <View key={option.value} className="flex-row items-center gap-3">
          <RadioGroupItem
            invalid
            value={option.value}
            accessibilityLabelledBy={`radio-invalid-${option.value}`}
          />
          <Label nativeID={`radio-invalid-${option.value}`}>
            {option.label}
          </Label>
        </View>
      ))}
    </RadioGroup>
  )
}
