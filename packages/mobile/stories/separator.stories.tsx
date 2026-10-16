import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { Separator } from "@/components/ui/separator"
import { Text } from "@/components/ui/text"

const meta = {
  title: "Components/Separator",
  component: Separator,
} satisfies Meta<typeof Separator>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <View>
      <View className="gap-1">
        <Text className="text-sm font-medium">suiss</Text>
        <Text variant="muted">An open-source UI component library.</Text>
      </View>
      <Separator className="my-4" />
      <View className="h-5 flex-row items-center gap-4">
        <Text className="text-sm">Blog</Text>
        <Separator orientation="vertical" />
        <Text className="text-sm">Docs</Text>
        <Separator orientation="vertical" />
        <Text className="text-sm">Source</Text>
      </View>
    </View>
  ),
}

export const Horizontal: Story = {
  render: () => (
    <View className="gap-4">
      <Text className="text-sm">Above</Text>
      <Separator />
      <Text className="text-sm">Below</Text>
    </View>
  ),
}

export const Vertical: Story = {
  render: () => (
    <View className="h-6 flex-row items-center gap-4">
      <Text className="text-sm">Left</Text>
      <Separator orientation="vertical" />
      <Text className="text-sm">Right</Text>
    </View>
  ),
}
