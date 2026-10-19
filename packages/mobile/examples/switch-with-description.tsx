import * as React from "react"
import { View } from "react-native"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Text } from "@/components/ui/text"

export default function SwitchWithDescription() {
  const [checked, setChecked] = React.useState(true)
  return (
    <View className="flex-row items-center justify-between gap-4 rounded-2xl bg-muted p-4">
      <View className="flex-1 gap-1">
        <Label nativeID="marketing" onPress={() => setChecked((v) => !v)}>
          Marketing emails
        </Label>
        <Text className="text-sm text-muted-foreground">
          Receive emails about new products.
        </Text>
      </View>
      <Switch
        accessibilityLabelledBy="marketing"
        checked={checked}
        onCheckedChange={setChecked}
      />
    </View>
  )
}
