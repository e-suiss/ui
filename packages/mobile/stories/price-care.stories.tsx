import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { PriceCare } from "@/components/blocks/price-care"

const meta = {
  title: "Blocks/Price Care",
  component: PriceCare,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof PriceCare>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
