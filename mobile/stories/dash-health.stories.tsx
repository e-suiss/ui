import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { DashHealth } from "@/components/blocks/dash-health"

const meta = {
  title: "Blocks/Dash Health",
  component: DashHealth,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof DashHealth>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
