import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { SignupSteps } from "@/components/blocks/signup-steps"

const meta = {
  title: "Blocks/Signup Steps",
  component: SignupSteps,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof SignupSteps>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
