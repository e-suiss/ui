import type { Meta, StoryObj } from "@storybook/react-vite"

import { GridAccessories } from "@/components/blocks/grid-accessories"
import { GridCarousel } from "@/components/blocks/grid-carousel"
import { GridLineup } from "@/components/blocks/grid-lineup"

const meta = {
  title: "Blocks/Grid",
  component: GridCarousel,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof GridCarousel>

export default meta

type Story = StoryObj<typeof meta>

export const Carousel: Story = {}

export const Lineup: Story = { render: () => <GridLineup /> }

export const Accessories: Story = { render: () => <GridAccessories /> }
