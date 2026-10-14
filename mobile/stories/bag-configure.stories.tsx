import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { BagConfigure } from "@/components/blocks/bag-configure"

const meta = {
  title: "Blocks/Bag Configure",
  component: BagConfigure,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof BagConfigure>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
