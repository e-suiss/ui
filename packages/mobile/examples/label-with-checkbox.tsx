import * as React from "react"
import { View } from "react-native"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

function WithCheckboxDemo() {
  const [checked, setChecked] = React.useState(false)
  return (
    <View className="flex-row items-center gap-3">
      <Checkbox
        accessibilityLabelledBy="label-terms"
        checked={checked}
        onCheckedChange={setChecked}
      />
      <Label nativeID="label-terms" onPress={() => setChecked((v) => !v)}>
        Accept terms and conditions
      </Label>
    </View>
  )
}

export default function LabelWithCheckbox() {
  return <WithCheckboxDemo />
}
