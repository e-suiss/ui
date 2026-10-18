import { View } from "react-native"
import { Separator } from "@/components/ui/separator"
import { Text } from "@/components/ui/text"

export default function SeparatorVertical() {
  return (
    <View className="h-6 flex-row items-center gap-4">
      <Text className="text-sm">Left</Text>
      <Separator orientation="vertical" />
      <Text className="text-sm">Right</Text>
    </View>
  )
}
