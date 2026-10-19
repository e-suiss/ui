import * as React from "react"
import { View } from "react-native"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export default function CheckboxWithLabel() {
  const [checked, setChecked] = React.useState(false)
  return (
    <View className="flex-row items-center gap-3">
      <Checkbox
        accessibilityLabelledBy="terms"
        checked={checked}
        onCheckedChange={setChecked}
      />
      <Label nativeID="terms" onPress={() => setChecked((value) => !value)}>
        Accept terms and conditions
      </Label>
    </View>
  )
}
