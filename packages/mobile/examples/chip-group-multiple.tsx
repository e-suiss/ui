import * as React from "react"
import { View } from "react-native"
import { Chip, ChipGroup } from "@/components/ui/chip"
import { Text } from "@/components/ui/text"

export default function ChipGroupMultiple() {
  const [value, setValue] = React.useState(["coffee", "bakery"])
  return (
    <View className="gap-3">
      <ChipGroup multiple value={value} onValueChange={setValue}>
        <Chip value="coffee">Coffee</Chip>
        <Chip value="lunch">Lunch</Chip>
        <Chip value="dinner">Dinner</Chip>
        <Chip value="bakery">Bakery</Chip>
        <Chip value="bars">Bars</Chip>
        <Chip value="desserts">Desserts</Chip>
      </ChipGroup>
      <Text variant="muted">Selected: {value.join(", ") || "none"}</Text>
    </View>
  )
}
