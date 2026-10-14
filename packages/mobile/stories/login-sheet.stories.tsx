import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { LoginSheet } from "@/components/blocks/login-sheet"

const meta = {
  title: "Blocks/Login Sheet",
  component: LoginSheet,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof LoginSheet>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
