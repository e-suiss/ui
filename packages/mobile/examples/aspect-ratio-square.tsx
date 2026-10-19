import { Image } from "react-native"
import { AspectRatio } from "@/components/ui/aspect-ratio"

export default function AspectRatioSquare() {
  return (
    <AspectRatio ratio={1} className="w-48 overflow-hidden rounded-lg">
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80",
        }}
        className="h-full w-full"
      />
    </AspectRatio>
  )
}
