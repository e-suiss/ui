import * as React from "react"
import { View } from "react-native"
import { Slider } from "@/components/ui/slider"
import { Text } from "@/components/ui/text"

export default function SliderRange() {
  const [value, setValue] = React.useState<readonly number[]>([25, 75])
  return (
    <View className="w-full gap-3">
      <View className="flex-row items-center justify-between">
        <Text className="text-sm font-medium">Price</Text>
        <Text className="text-sm text-muted-foreground">
          ${value[0]} – ${value[1]}
        </Text>
      </View>
      <Slider
        value={value}
        onValueChange={setValue}
        step={5}
        minStepsBetweenValues={2}
        accessibilityLabel="Price"
      />
    </View>
  )
}
