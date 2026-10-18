import { View } from "react-native"
import { Badge } from "@/components/ui/badge"
import { Text } from "@/components/ui/text"

export default function BadgeVariants() {
  return (
    <View className="flex-row flex-wrap gap-2">
      <Badge>
        <Text>Default</Text>
      </Badge>
      <Badge variant="secondary">
        <Text>Secondary</Text>
      </Badge>
      <Badge variant="destructive">
        <Text>Destructive</Text>
      </Badge>
      <Badge variant="outline">
        <Text>Outline</Text>
      </Badge>
      <Badge variant="ghost">
        <Text>Ghost</Text>
      </Badge>
      <Badge variant="link">
        <Text>Link</Text>
      </Badge>
    </View>
  )
}
