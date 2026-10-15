import type { Meta, StoryObj } from "@storybook/react-native"
import { ImageIcon } from "phosphor-react-native"
import { Image, View } from "react-native"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

const imageUri =
  "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"

const meta = {
  title: "Components/Aspect Ratio",
  component: AspectRatio,
} satisfies Meta<typeof AspectRatio>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <View className="w-full overflow-hidden rounded-lg">
      <AspectRatio ratio={16 / 9}>
        <Image source={{ uri: imageUri }} className="h-full w-full" />
      </AspectRatio>
    </View>
  ),
}

export const Square: Story = {
  render: () => (
    <View className="w-48 overflow-hidden rounded-lg">
      <AspectRatio ratio={1}>
        <Image source={{ uri: imageUri }} className="h-full w-full" />
      </AspectRatio>
    </View>
  ),
}

export const Portrait: Story = {
  render: () => (
    <View className="w-40 overflow-hidden rounded-lg">
      <AspectRatio ratio={9 / 16}>
        <Image source={{ uri: imageUri }} className="h-full w-full" />
      </AspectRatio>
    </View>
  ),
}

export const Placeholder: Story = {
  render: () => (
    <View className="w-full">
      <AspectRatio ratio={16 / 9}>
        <View className="bg-muted h-full w-full items-center justify-center gap-2 rounded-lg">
          <Icon as={ImageIcon} className="text-muted-foreground size-8" />
          <Text variant="muted">16 / 9</Text>
        </View>
      </AspectRatio>
    </View>
  ),
}
