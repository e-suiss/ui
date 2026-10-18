import * as React from "react"
import { View } from "react-native"
import { Slider } from "@/components/ui/slider"
import { Text } from "@/components/ui/text"

function ControlledDemo() {
  const [value, setValue] = React.useState(30)
  const [committed, setCommitted] = React.useState(30)
  return (
    <View className="w-full gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-medium">Brightness</Text>
        <Text className="text-sm text-muted-foreground">
          {value} / committed {committed}
        </Text>
      </View>
      <Slider
        value={value}
        onValueChange={(next) => setValue(next)}
        onValueCommitted={(next) => setCommitted(next)}
        accessibilityLabel="Brightness"
      />
    </View>
  )
}

export default function SliderControlled() {
  return <ControlledDemo />
}
