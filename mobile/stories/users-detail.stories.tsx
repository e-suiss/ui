import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { UsersDetail } from "@/components/blocks/users-detail"

const meta = {
  title: "Blocks/Users Detail",
  component: UsersDetail,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof UsersDetail>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
