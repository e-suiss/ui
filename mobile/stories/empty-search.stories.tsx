import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { EmptySearch } from "@/components/blocks/empty-search"

const meta = {
  title: "Blocks/Empty Search",
  component: EmptySearch,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof EmptySearch>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
