import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { DashStore } from "@/components/blocks/dash-store"

const meta = {
  title: "Blocks/Dash Store",
  component: DashStore,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof DashStore>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
