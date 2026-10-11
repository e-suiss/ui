import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { DashAnalytics } from "@/components/blocks/dash-analytics"

const meta = {
  title: "Blocks/Dash Analytics",
  component: DashAnalytics,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof DashAnalytics>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
