import type { Meta, StoryObj } from "@storybook/react-vite"

import { BentoCloserLook } from "@/components/blocks/bento-closer-look"
import { BentoFeatures } from "@/components/blocks/bento-features"
import { BentoStats } from "@/components/blocks/bento-stats"

const meta = {
  title: "Blocks/Bento",
  component: BentoFeatures,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof BentoFeatures>

export default meta

type Story = StoryObj<typeof meta>

export const Features: Story = {}

export const Stats: Story = { render: () => <BentoStats /> }

export const CloserLook: Story = { render: () => <BentoCloserLook /> }
