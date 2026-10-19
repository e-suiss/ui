import * as React from "react"
import { View } from "react-native"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Text } from "@/components/ui/text"

export default function RadioGroupWithDescriptions() {
  const [value, setValue] = React.useState("pro")
  return (
    <RadioGroup value={value} onValueChange={setValue} className="gap-4">
      <View className="flex-row items-start gap-3">
        <RadioGroupItem
          value="starter"
          accessibilityLabelledBy="plan-starter"
        />
        <View className="flex-1 gap-1">
          <Label nativeID="plan-starter" onPress={() => setValue("starter")}>
            Starter
          </Label>
          <Text className="text-sm text-muted-foreground">
            For individuals getting started.
          </Text>
        </View>
      </View>
      <View className="flex-row items-start gap-3">
        <RadioGroupItem value="pro" accessibilityLabelledBy="plan-pro" />
        <View className="flex-1 gap-1">
          <Label nativeID="plan-pro" onPress={() => setValue("pro")}>
            Pro
          </Label>
          <Text className="text-sm text-muted-foreground">
            For growing teams that need more.
          </Text>
        </View>
      </View>
      <View className="flex-row items-start gap-3">
        <RadioGroupItem
          value="enterprise"
          accessibilityLabelledBy="plan-enterprise"
        />
        <View className="flex-1 gap-1">
          <Label
            nativeID="plan-enterprise"
            onPress={() => setValue("enterprise")}
          >
            Enterprise
          </Label>
          <Text className="text-sm text-muted-foreground">
            For large organizations with custom needs.
          </Text>
        </View>
      </View>
    </RadioGroup>
  )
}
