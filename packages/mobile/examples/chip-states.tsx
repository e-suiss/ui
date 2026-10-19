import { View } from "react-native"
import { Chip } from "@/components/ui/chip"
import { Text } from "@/components/ui/text"

export default function ChipStates() {
  return (
    <View className="gap-4">
      <View className="gap-2">
        <Text variant="muted">Unselected</Text>
        <Chip>Open now</Chip>
      </View>
      <View className="gap-2">
        <Text variant="muted">Selected</Text>
        <Chip defaultSelected>Open now</Chip>
      </View>
      <View className="gap-2">
        <Text variant="muted">Disabled</Text>
        <View className="flex-row gap-2">
          <Chip disabled>Open now</Chip>
          <Chip disabled defaultSelected>
            Open now
          </Chip>
        </View>
      </View>
    </View>
  )
}
