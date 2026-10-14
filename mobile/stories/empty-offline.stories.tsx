import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { EmptyOffline } from "@/components/blocks/empty-offline"

const meta = {
  title: "Blocks/Empty Offline",
  component: EmptyOffline,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof EmptyOffline>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
