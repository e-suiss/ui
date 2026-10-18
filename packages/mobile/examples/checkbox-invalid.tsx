import * as React from "react"
import { View } from "react-native"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

function InvalidDemo() {
  const [checked, setChecked] = React.useState(false)
  return (
    <View className="flex-row items-center gap-3">
      <Checkbox
        invalid={!checked}
        accessibilityLabelledBy="terms-invalid"
        checked={checked}
        onCheckedChange={setChecked}
      />
      <Label
        nativeID="terms-invalid"
        onPress={() => setChecked((value) => !value)}
      >
        Accept terms and conditions
      </Label>
    </View>
  )
}

export default function CheckboxInvalid() {
  return <InvalidDemo />
}
