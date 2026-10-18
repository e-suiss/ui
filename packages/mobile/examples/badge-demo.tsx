import { View } from "react-native"
import { Badge } from "@/components/ui/badge"
import { Text } from "@/components/ui/text"

export default function BadgeDemo() {
  return (
    <View className="flex-row">
      <Badge>
        <Text>Badge</Text>
      </Badge>
    </View>
  )
}
