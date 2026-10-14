import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { RolesRequests } from "@/components/blocks/roles-requests"

const meta = {
  title: "Blocks/Roles Requests",
  component: RolesRequests,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof RolesRequests>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
