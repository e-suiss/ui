import { Image, View } from "react-native"
import { AspectRatio } from "@/components/ui/aspect-ratio"

const imageUri =
  "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"

export default function AspectRatioSquare() {
  return (
    <View className="w-48 overflow-hidden rounded-lg">
      <AspectRatio ratio={1}>
        <Image source={{ uri: imageUri }} className="h-full w-full" />
      </AspectRatio>
    </View>
  )
}
