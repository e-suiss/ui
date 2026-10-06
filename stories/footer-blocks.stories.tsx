import type { Meta, StoryObj } from "@storybook/react-vite"

import { FooterCompact } from "@/components/blocks/footer-compact"
import { FooterDirectory } from "@/components/blocks/footer-directory"
import { FooterServices } from "@/components/blocks/footer-services"

const meta = {
  title: "Blocks/Footer",
  component: FooterDirectory,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof FooterDirectory>

export default meta

type Story = StoryObj<typeof meta>

export const Directory: Story = {}

export const Compact: Story = { render: () => <FooterCompact /> }

export const Services: Story = { render: () => <FooterServices /> }
