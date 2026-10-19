import * as React from "react"
import { View } from "react-native"
import { Chip } from "@/components/ui/chip"
import { Text } from "@/components/ui/text"

export default function ChipControlled() {
  const [selected, setSelected] = React.useState(true)
  return (
    <View className="gap-3">
      <Chip selected={selected} onSelectedChange={setSelected}>
        Free delivery
      </Chip>
      <Text variant="muted">{selected ? "Selected" : "Not selected"}</Text>
    </View>
  )
}
