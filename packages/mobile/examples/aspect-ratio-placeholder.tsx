import { ImageIcon } from "phosphor-react-native"
import { View } from "react-native"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

export default function AspectRatioPlaceholder() {
  return (
    <View className="w-full">
      <AspectRatio ratio={16 / 9}>
        <View className="bg-muted h-full w-full items-center justify-center gap-2 rounded-lg">
          <Icon as={ImageIcon} className="text-muted-foreground size-8" />
          <Text variant="muted">16 / 9</Text>
        </View>
      </AspectRatio>
    </View>
  )
}
