import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { ChatThread } from "@/components/blocks/chat-thread"

const meta = {
  title: "Blocks/Chat Thread",
  component: ChatThread,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof ChatThread>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
