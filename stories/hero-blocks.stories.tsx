import type { Meta, StoryObj } from "@storybook/react-vite"

import { HeroCinematic } from "@/components/blocks/hero-cinematic"
import { HeroProduct } from "@/components/blocks/hero-product"
import { HeroTiles } from "@/components/blocks/hero-tiles"

const meta = {
  title: "Blocks/Hero",
  component: HeroProduct,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof HeroProduct>

export default meta

type Story = StoryObj<typeof meta>

export const Product: Story = {}

export const Cinematic: Story = { render: () => <HeroCinematic /> }

export const Tiles: Story = { render: () => <HeroTiles /> }
