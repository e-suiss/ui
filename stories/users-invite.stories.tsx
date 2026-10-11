import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { UsersInvite } from "@/components/blocks/users-invite"

const meta = {
  title: "Blocks/Users Invite",
  component: UsersInvite,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof UsersInvite>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
