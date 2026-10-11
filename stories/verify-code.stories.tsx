import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { VerifyCode } from "@/components/blocks/verify-code"

const meta = {
  title: "Blocks/Verify Code",
  component: VerifyCode,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof VerifyCode>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
