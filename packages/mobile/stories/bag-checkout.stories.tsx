import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { BagCheckout } from "@/components/blocks/bag-checkout"

const meta = {
  title: "Blocks/Bag Checkout",
  component: BagCheckout,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof BagCheckout>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
