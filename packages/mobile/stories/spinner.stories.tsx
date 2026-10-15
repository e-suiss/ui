import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Text } from "@/components/ui/text"

const meta = {
  title: "Components/Spinner",
  component: Spinner,
} satisfies Meta<typeof Spinner>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Sizes: Story = {
  render: () => (
    <View className="flex-row items-center gap-6">
      <Spinner size={12} />
      <Spinner />
      <Spinner size={24} />
      <Spinner size={32} />
    </View>
  ),
}

export const Colors: Story = {
  render: () => (
    <View className="flex-row items-center gap-6">
      <Spinner size={24} colorClassName="accent-foreground" />
      <Spinner size={24} colorClassName="accent-primary" />
      <Spinner size={24} colorClassName="accent-destructive" />
    </View>
  ),
}

export const InButton: Story = {
  render: () => (
    <View className="items-start gap-3">
      <Button disabled>
        <Spinner colorClassName="accent-primary-foreground" />
        <Text>Saving</Text>
      </Button>
      <Button variant="secondary" disabled>
        <Spinner />
        <Text>Loading</Text>
      </Button>
    </View>
  ),
}
