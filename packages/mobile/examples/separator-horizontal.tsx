import { View } from "react-native"
import { Separator } from "@/components/ui/separator"
import { Text } from "@/components/ui/text"

export default function SeparatorHorizontal() {
  return (
    <View className="gap-4">
      <Text className="text-sm">Above</Text>
      <Separator />
      <Text className="text-sm">Below</Text>
    </View>
  )
}
