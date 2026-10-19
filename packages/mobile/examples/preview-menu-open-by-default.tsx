import {
  CopyIcon,
  HeartIcon,
  ShareNetworkIcon,
  TrashIcon,
} from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import {
  PreviewMenu,
  PreviewMenuContent,
  PreviewMenuItem,
  PreviewMenuSeparator,
  PreviewMenuTrigger,
} from "@/components/interactions/preview-menu"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

const photos = [
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

export default function PreviewMenuOpenByDefault() {
  const [log, setLog] = React.useState("Touch and hold a photo.")
  return (
    <View className="gap-3">
      <View className="flex-row flex-wrap gap-2">
        {photos.map((tone, index) => {
          const label = `Photo ${index + 1}`
          return (
            <PreviewMenu key={tone} defaultOpen={index === 1}>
              <PreviewMenuTrigger
                accessibilityLabel={label}
                className="aspect-square w-[31%] overflow-hidden rounded-2xl"
              >
                <View className={`h-full w-full ${tone}`} />
              </PreviewMenuTrigger>
              <PreviewMenuContent>
                <PreviewMenuItem onPress={() => setLog(`Copied ${label}`)}>
                  Copy
                  <Icon as={CopyIcon} />
                </PreviewMenuItem>
                <PreviewMenuItem onPress={() => setLog(`Shared ${label}`)}>
                  Share
                  <Icon as={ShareNetworkIcon} />
                </PreviewMenuItem>
                <PreviewMenuItem onPress={() => setLog(`Favorited ${label}`)}>
                  Favorite
                  <Icon as={HeartIcon} />
                </PreviewMenuItem>
                <PreviewMenuSeparator />
                <PreviewMenuItem
                  variant="destructive"
                  onPress={() => setLog(`Deleted ${label}`)}
                >
                  Delete
                  <Icon as={TrashIcon} />
                </PreviewMenuItem>
              </PreviewMenuContent>
            </PreviewMenu>
          )
        })}
      </View>
      <Text variant="muted">{log}</Text>
    </View>
  )
}
