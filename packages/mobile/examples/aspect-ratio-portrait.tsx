import { Image, View } from "react-native"
import { AspectRatio } from "@/components/ui/aspect-ratio"

const imageUri =
  "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"

export default function AspectRatioPortrait() {
  return (
    <View className="w-40 overflow-hidden rounded-lg">
      <AspectRatio ratio={9 / 16}>
        <Image source={{ uri: imageUri }} className="h-full w-full" />
      </AspectRatio>
    </View>
  )
}
