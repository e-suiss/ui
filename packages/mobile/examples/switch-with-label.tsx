import * as React from "react"
import { View } from "react-native"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

function WithLabelDemo() {
  const [checked, setChecked] = React.useState(false)
  return (
    <View className="flex-row items-center gap-2">
      <Switch
        accessibilityLabelledBy="airplane-mode"
        checked={checked}
        onCheckedChange={setChecked}
      />
      <Label nativeID="airplane-mode" onPress={() => setChecked((v) => !v)}>
        Airplane mode
      </Label>
    </View>
  )
}

export default function SwitchWithLabel() {
  return <WithLabelDemo />
}
