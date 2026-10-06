import type { Meta, StoryObj } from "@storybook/react-vite"

import { BagCheckout } from "@/components/blocks/bag-checkout"
import { BagConfigure } from "@/components/blocks/bag-configure"
import { BagReview } from "@/components/blocks/bag-review"

const meta = {
  title: "Blocks/Bag",
  component: BagReview,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof BagReview>

export default meta

type Story = StoryObj<typeof meta>

export const Review: Story = {}

export const Checkout: Story = { render: () => <BagCheckout /> }

export const Configure: Story = { render: () => <BagConfigure /> }
