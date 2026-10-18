import { ShareNetworkIcon, TrashIcon } from "phosphor-react-native"
import { View } from "react-native"
import {
  PreviewMenu,
  PreviewMenuContent,
  PreviewMenuItem,
  PreviewMenuTrigger,
} from "@/components/interactions/preview-menu"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

const _photos = [
  "bg-blue-500",
  "bg-orange-500",
  "bg-green-500",
  "bg-indigo-500",
  "bg-yellow-500",
  "bg-pink-500",
  "bg-teal-500",
  "bg-purple-500",
  "bg-teal-400",
]

function AlbumPreview({ defaultOpen }: { defaultOpen?: boolean }) {
  return (
    <PreviewMenu aspectRatio={4 / 3} defaultOpen={defaultOpen}>
      <PreviewMenuTrigger className="flex-row items-center gap-3 rounded-xl bg-muted p-3">
        <View className="size-12 rounded-lg bg-blue-500" />
        <View>
          <Text className="font-semibold">Trip to the coast</Text>
          <Text variant="muted">48 photos</Text>
        </View>
      </PreviewMenuTrigger>
      <PreviewMenuContent
        preview={
          <View className="h-full w-full justify-end bg-blue-500 p-4">
            <Text className="text-lg font-semibold text-primary-foreground">
              Trip to the coast
            </Text>
            <Text className="text-sm text-primary-foreground">
              48 photos · Updated today
            </Text>
          </View>
        }
      >
        <PreviewMenuItem>
          Share album
          <Icon as={ShareNetworkIcon} />
        </PreviewMenuItem>
        <PreviewMenuItem variant="destructive">
          Delete album
          <Icon as={TrashIcon} />
        </PreviewMenuItem>
      </PreviewMenuContent>
    </PreviewMenu>
  )
}

export default function PreviewMenuCustomPreview() {
  return <AlbumPreview />
}
