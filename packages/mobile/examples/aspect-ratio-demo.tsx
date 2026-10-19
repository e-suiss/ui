import { Image } from "react-native"
import { AspectRatio } from "@/components/ui/aspect-ratio"

export default function AspectRatioDemo() {
  return (
    <AspectRatio ratio={16 / 9} className="w-full overflow-hidden rounded-lg">
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80",
        }}
        className="h-full w-full"
      />
    </AspectRatio>
  )
}
