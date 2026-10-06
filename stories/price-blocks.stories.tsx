import type { Meta, StoryObj } from "@storybook/react-vite"

import { PriceBundle } from "@/components/blocks/price-bundle"
import { PriceCare } from "@/components/blocks/price-care"
import { PriceStorage } from "@/components/blocks/price-storage"

const meta = {
  title: "Blocks/Pricing",
  component: PriceStorage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof PriceStorage>

export default meta

type Story = StoryObj<typeof meta>

export const Storage: Story = {}

export const Bundle: Story = { render: () => <PriceBundle /> }

export const Care: Story = { render: () => <PriceCare /> }
