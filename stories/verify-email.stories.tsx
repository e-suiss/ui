import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { VerifyEmail } from "@/components/blocks/verify-email"

const meta = {
  title: "Blocks/Verify Email",
  component: VerifyEmail,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof VerifyEmail>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
