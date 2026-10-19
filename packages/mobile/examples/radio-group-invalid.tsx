import { View } from "react-native"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function RadioGroupInvalid() {
  return (
    <RadioGroup className="gap-3">
      <View className="flex-row items-center gap-3">
        <RadioGroupItem
          invalid
          value="default"
          accessibilityLabelledBy="radio-invalid-default"
        />
        <Label nativeID="radio-invalid-default">Default</Label>
      </View>
      <View className="flex-row items-center gap-3">
        <RadioGroupItem
          invalid
          value="comfortable"
          accessibilityLabelledBy="radio-invalid-comfortable"
        />
        <Label nativeID="radio-invalid-comfortable">Comfortable</Label>
      </View>
      <View className="flex-row items-center gap-3">
        <RadioGroupItem
          invalid
          value="compact"
          accessibilityLabelledBy="radio-invalid-compact"
        />
        <Label nativeID="radio-invalid-compact">Compact</Label>
      </View>
    </RadioGroup>
  )
}
