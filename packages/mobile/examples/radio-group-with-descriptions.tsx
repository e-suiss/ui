import * as React from "react"
import { View } from "react-native"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Text } from "@/components/ui/text"

const plans = [
  {
    value: "starter",
    label: "Starter",
    description: "For individuals getting started.",
  },
  {
    value: "pro",
    label: "Pro",
    description: "For growing teams that need more.",
  },
  {
    value: "enterprise",
    label: "Enterprise",
    description: "For large organizations with custom needs.",
  },
]

function WithDescriptionsDemo() {
  const [value, setValue] = React.useState("pro")
  return (
    <RadioGroup value={value} onValueChange={setValue} className="gap-4">
      {plans.map((plan) => (
        <View key={plan.value} className="flex-row items-start gap-3">
          <RadioGroupItem
            value={plan.value}
            accessibilityLabelledBy={`plan-${plan.value}`}
          />
          <View className="flex-1 gap-1">
            <Label
              nativeID={`plan-${plan.value}`}
              onPress={() => setValue(plan.value)}
            >
              {plan.label}
            </Label>
            <Text className="text-sm text-muted-foreground">
              {plan.description}
            </Text>
          </View>
        </View>
      ))}
    </RadioGroup>
  )
}

export default function RadioGroupWithDescriptions() {
  return <WithDescriptionsDemo />
}
