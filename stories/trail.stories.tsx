import type { Meta, StoryObj } from "@storybook/react-vite"

import { Trail, type TrailItem } from "@/components/patterns/trail"

const article: TrailItem[] = [
  { label: "Support", href: "#support" },
  { label: "Account", href: "#account" },
  { label: "Security", href: "#security" },
  { label: "Turn on two-factor authentication" },
]

const deep: TrailItem[] = [
  { label: "Support", href: "#support" },
  { label: "Products", href: "#products" },
  { label: "Workspace", href: "#workspace" },
  { label: "Billing", href: "#billing" },
  { label: "Invoices", href: "#invoices" },
  { label: "Download an invoice as PDF" },
]

const meta = {
  title: "Patterns/Trail",
  component: Trail,
  parameters: { layout: "padded" },
  args: { items: article },
} satisfies Meta<typeof Trail>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Collapsed: Story = {
  args: { items: deep, maxItems: 4 },
}

export const BackLabel: Story = {
  args: { backLabel: "Back" },
}

export const TwoLevels: Story = {
  args: { items: article.slice(2) },
}
