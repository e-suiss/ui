import type { Meta, StoryObj } from "@storybook/react-native"
import { SealCheckIcon, StarIcon } from "phosphor-react-native"
import { View } from "react-native"
import { Badge } from "@/components/ui/badge"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

const meta = {
  title: "Components/Badge",
  component: Badge,
} satisfies Meta<typeof Badge>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <View className="flex-row">
      <Badge>
        <Text>Badge</Text>
      </Badge>
    </View>
  ),
}

export const Variants: Story = {
  render: () => (
    <View className="flex-row flex-wrap gap-2">
      <Badge>
        <Text>Default</Text>
      </Badge>
      <Badge variant="secondary">
        <Text>Secondary</Text>
      </Badge>
      <Badge variant="destructive">
        <Text>Destructive</Text>
      </Badge>
      <Badge variant="outline">
        <Text>Outline</Text>
      </Badge>
      <Badge variant="ghost">
        <Text>Ghost</Text>
      </Badge>
      <Badge variant="link">
        <Text>Link</Text>
      </Badge>
    </View>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <View className="flex-row flex-wrap gap-2">
      <Badge variant="secondary">
        <Icon as={SealCheckIcon} />
        <Text>Verified</Text>
      </Badge>
      <Badge variant="outline">
        <Icon as={StarIcon} />
        <Text>Featured</Text>
      </Badge>
      <Badge variant="outline" className="min-w-5 px-1">
        <Text>8</Text>
      </Badge>
    </View>
  ),
}
