import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { ChatSupport } from "@/components/blocks/chat-support"

const meta = {
  title: "Blocks/Chat Support",
  component: ChatSupport,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof ChatSupport>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
