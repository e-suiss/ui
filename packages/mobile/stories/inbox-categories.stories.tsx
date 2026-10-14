import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { InboxCategories } from "@/components/blocks/inbox-categories"

const meta = {
  title: "Blocks/Inbox Categories",
  component: InboxCategories,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof InboxCategories>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
