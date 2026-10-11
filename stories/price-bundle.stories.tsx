import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { PriceBundle } from "@/components/blocks/price-bundle"

const meta = {
  title: "Blocks/Price Bundle",
  component: PriceBundle,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof PriceBundle>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
