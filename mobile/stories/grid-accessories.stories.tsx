import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { GridAccessories } from "@/components/blocks/grid-accessories"

const meta = {
  title: "Blocks/Grid Accessories",
  component: GridAccessories,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof GridAccessories>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
