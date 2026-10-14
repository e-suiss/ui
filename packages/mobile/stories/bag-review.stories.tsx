import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { BagReview } from "@/components/blocks/bag-review"

const meta = {
  title: "Blocks/Bag Review",
  component: BagReview,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof BagReview>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
