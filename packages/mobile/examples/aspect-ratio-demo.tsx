import { Image, View } from "react-native"
import { AspectRatio } from "@/components/ui/aspect-ratio"

const imageUri =
  "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"

export default function AspectRatioDemo() {
  return (
    <View className="w-full overflow-hidden rounded-lg">
      <AspectRatio ratio={16 / 9}>
        <Image source={{ uri: imageUri }} className="h-full w-full" />
      </AspectRatio>
    </View>
  )
}
