import * as React from "react"
import { View } from "react-native"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function RadioGroupDisabledItem() {
  const [value, setValue] = React.useState("comfortable")
  return (
    <RadioGroup value={value} onValueChange={setValue}>
      <View className="flex-row items-center gap-3">
        <RadioGroupItem
          value="default"
          accessibilityLabelledBy="radio-default"
        />
        <Label nativeID="radio-default" onPress={() => setValue("default")}>
          Default
        </Label>
      </View>
      <View className="flex-row items-center gap-3">
        <RadioGroupItem
          value="comfortable"
          accessibilityLabelledBy="radio-comfortable"
        />
        <Label
          nativeID="radio-comfortable"
          onPress={() => setValue("comfortable")}
        >
          Comfortable
        </Label>
      </View>
      <View className="flex-row items-center gap-3">
        <RadioGroupItem
          value="compact"
          accessibilityLabelledBy="radio-compact"
          disabled
        />
        <Label
          nativeID="radio-compact"
          disabled
          onPress={() => setValue("compact")}
        >
          Compact
        </Label>
      </View>
    </RadioGroup>
  )
}
