import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { InboxSupport } from "@/components/blocks/inbox-support"

const meta = {
  title: "Blocks/Inbox Support",
  component: InboxSupport,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof InboxSupport>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
