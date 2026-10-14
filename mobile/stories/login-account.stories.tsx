import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { LoginAccount } from "@/components/blocks/login-account"

const meta = {
  title: "Blocks/Login Account",
  component: LoginAccount,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof LoginAccount>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
