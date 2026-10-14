import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { SignupTrial } from "@/components/blocks/signup-trial"

const meta = {
  title: "Blocks/Signup Trial",
  component: SignupTrial,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof SignupTrial>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
