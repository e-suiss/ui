import { View } from "react-native"
import { Separator } from "@/components/ui/separator"
import { Text } from "@/components/ui/text"

export default function SeparatorDemo() {
  return (
    <View>
      <View className="gap-1">
        <Text className="text-sm font-medium">suiss</Text>
        <Text variant="muted">An open-source UI component library.</Text>
      </View>
      <Separator className="my-4" />
      <View className="h-5 flex-row items-center gap-4">
        <Text className="text-sm">Blog</Text>
        <Separator orientation="vertical" />
        <Text className="text-sm">Docs</Text>
        <Separator orientation="vertical" />
        <Text className="text-sm">Source</Text>
      </View>
    </View>
  )
}
