import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { SignupForm } from "@/components/blocks/signup-form"

const meta = {
  title: "Blocks/Signup Form",
  component: SignupForm,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof SignupForm>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
