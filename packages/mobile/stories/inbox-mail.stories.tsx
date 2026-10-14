import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { InboxMail } from "@/components/blocks/inbox-mail"

const meta = {
  title: "Blocks/Inbox Mail",
  component: InboxMail,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof InboxMail>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
