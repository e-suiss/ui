import { View } from "react-native"
import { Fab } from "@/components/ui/fab"
import { Text } from "@/components/ui/text"

export default function FabLargeExtended() {
  return (
    <View className="flex-1">
      <View className="gap-2">
        <Text variant="h3">Notes</Text>
        <Text variant="muted">
          The button floats at the bottom end of the screen.
        </Text>
      </View>
      <Fab size="lg" label="New note" />
    </View>
  )
}
