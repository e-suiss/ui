import { Image } from "react-native"
import { AspectRatio } from "@/components/ui/aspect-ratio"

export default function AspectRatioPortrait() {
  return (
    <AspectRatio ratio={9 / 16} className="w-40 overflow-hidden rounded-lg">
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80",
        }}
        className="h-full w-full"
      />
    </AspectRatio>
  )
}
