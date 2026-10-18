import { Image, View } from "react-native"
import {
  ImageViewer,
  ImageViewerContent,
  type ImageViewerImage,
  ImageViewerTrigger,
} from "@/components/interactions/image-viewer"
import { Text } from "@/components/ui/text"

const images: ImageViewerImage[] = [
  {
    source: {
      uri: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=1200&q=80",
    },
    accessibilityLabel: "Mountain lake at sunrise",
  },
  {
    source: {
      uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80",
    },
    accessibilityLabel: "Valley with a river",
  },
  {
    source: {
      uri: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&q=80",
    },
    accessibilityLabel: "Lake between mountains",
  },
  {
    source: {
      uri: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=80",
    },
    accessibilityLabel: "Foggy hills",
  },
  {
    source: {
      uri: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80",
    },
    accessibilityLabel: "Forest path",
  },
]

function Gallery({
  defaultOpen,
  defaultIndex,
}: {
  defaultOpen?: boolean
  defaultIndex?: number
}) {
  return (
    <ImageViewer
      images={images}
      defaultOpen={defaultOpen}
      defaultIndex={defaultIndex}
    >
      <View className="gap-3">
        <View className="flex-row flex-wrap gap-2">
          {images.map((image, index) => (
            <ImageViewerTrigger
              key={image.accessibilityLabel}
              index={index}
              accessibilityLabel={image.accessibilityLabel}
              className="aspect-square w-[31%] overflow-hidden rounded-xl bg-muted"
            >
              <Image source={image.source} className="h-full w-full" />
            </ImageViewerTrigger>
          ))}
        </View>
        <Text variant="muted">
          Tap a photo. Pinch or double-tap to zoom, swipe down to close.
        </Text>
      </View>
      <ImageViewerContent />
    </ImageViewer>
  )
}

export default function ImageViewerDemo() {
  return <Gallery />
}
