import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { PriceStorage } from "@/components/blocks/price-storage"

const meta = {
  title: "Blocks/Price Storage",
  component: PriceStorage,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof PriceStorage>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
