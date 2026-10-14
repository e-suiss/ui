import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { VerifyDevice } from "@/components/blocks/verify-device"

const meta = {
  title: "Blocks/Verify Device",
  component: VerifyDevice,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof VerifyDevice>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
