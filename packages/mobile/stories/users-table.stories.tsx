import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { UsersTable } from "@/components/blocks/users-table"

const meta = {
  title: "Blocks/Users Table",
  component: UsersTable,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof UsersTable>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
