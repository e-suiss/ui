import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { EmptyBag } from "@/components/blocks/empty-bag"

const meta = {
  title: "Blocks/Empty Bag",
  component: EmptyBag,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof EmptyBag>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
