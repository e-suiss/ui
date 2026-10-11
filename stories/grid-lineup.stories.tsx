import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { GridLineup } from "@/components/blocks/grid-lineup"

const meta = {
  title: "Blocks/Grid Lineup",
  component: GridLineup,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof GridLineup>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
