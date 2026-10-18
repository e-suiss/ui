import * as React from "react"
import { View } from "react-native"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Text } from "@/components/ui/text"

function WithDescriptionDemo() {
  const [checked, setChecked] = React.useState(true)
  return (
    <View className="flex-row items-start gap-3">
      <Checkbox
        accessibilityLabelledBy="notifications"
        checked={checked}
        onCheckedChange={setChecked}
      />
      <View className="flex-1 gap-1.5">
        <Label
          nativeID="notifications"
          onPress={() => setChecked((value) => !value)}
        >
          Enable notifications
        </Label>
        <Text className="text-sm text-muted-foreground">
          You can enable or disable notifications at any time.
        </Text>
      </View>
    </View>
  )
}

export default function CheckboxWithDescription() {
  return <WithDescriptionDemo />
}
