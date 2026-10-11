import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { LogActivity } from "@/components/blocks/log-activity"

const meta = {
  title: "Blocks/Log Activity",
  component: LogActivity,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof LogActivity>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
