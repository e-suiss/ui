import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { LogSecurity } from "@/components/blocks/log-security"

const meta = {
  title: "Blocks/Log Security",
  component: LogSecurity,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof LogSecurity>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
