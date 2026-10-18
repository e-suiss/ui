import { View } from "react-native"
import { Text } from "@/components/ui/text"

export default function TextHeadings() {
  return (
    <View className="gap-4">
      <Text variant="h1">Heading 1</Text>
      <Text variant="h2">Heading 2</Text>
      <Text variant="h3">Heading 3</Text>
      <Text variant="h4">Heading 4</Text>
    </View>
  )
}
