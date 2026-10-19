import * as React from "react"
import { View } from "react-native"
import { Chip, ChipGroup } from "@/components/ui/chip"
import { Text } from "@/components/ui/text"

export default function ChipGroupSingle() {
  const [value, setValue] = React.useState(["all"])
  return (
    <View className="gap-3">
      <ChipGroup value={value} onValueChange={setValue}>
        <Chip value="all">All</Chip>
        <Chip value="coffee">Coffee</Chip>
        <Chip value="lunch">Lunch</Chip>
        <Chip value="dinner">Dinner</Chip>
      </ChipGroup>
      <Text variant="muted">Selected: {value.join(", ") || "none"}</Text>
    </View>
  )
}
