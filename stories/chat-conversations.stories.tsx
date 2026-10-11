import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { ChatConversations } from "@/components/blocks/chat-conversations"

const meta = {
  title: "Blocks/Chat Conversations",
  component: ChatConversations,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof ChatConversations>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
