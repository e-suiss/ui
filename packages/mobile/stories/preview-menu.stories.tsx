import type { Meta, StoryObj } from "@storybook/react-native"
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

function PhotoGrid({
  withDisabled = false,
  openIndex,
}: {
  withDisabled?: boolean
  openIndex?: number
}) {
  const [log, setLog] = React.useState("Touch and hold a photo.")
  return (
    <View className="gap-3">
      <View className="flex-row flex-wrap gap-2">
        {photos.map((tone, index) => {
          const label = `Photo ${index + 1}`
          return (
            <PreviewMenu key={tone} defaultOpen={index === openIndex}>
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
                <PreviewMenuItem
                  disabled={withDisabled}
                  onPress={() => setLog(`Favorited ${label}`)}
                >
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

const meta = {
  title: "Interactions/Preview Menu",
  component: PreviewMenu,
} satisfies Meta<typeof PreviewMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <PhotoGrid />,
}

export const OpenByDefault: Story = {
  render: () => <PhotoGrid openIndex={1} />,
}

export const DisabledItem: Story = {
  render: () => <PhotoGrid withDisabled openIndex={0} />,
}

export const CustomPreview: Story = {
  render: () => <AlbumPreview />,
}

export const CustomPreviewOpen: Story = {
  render: () => <AlbumPreview defaultOpen />,
}
