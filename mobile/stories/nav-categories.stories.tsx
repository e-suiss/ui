import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { NavCategories } from "@/components/blocks/nav-categories"

const meta = {
  title: "Blocks/Nav Categories",
  component: NavCategories,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof NavCategories>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
