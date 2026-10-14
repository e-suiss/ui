import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { LogLive } from "@/components/blocks/log-live"

const meta = {
  title: "Blocks/Log Live",
  component: LogLive,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof LogLive>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
