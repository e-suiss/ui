import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { GridCarousel } from "@/components/blocks/grid-carousel"

const meta = {
  title: "Blocks/Grid Carousel",
  component: GridCarousel,
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof GridCarousel>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
