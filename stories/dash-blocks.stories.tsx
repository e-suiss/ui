import type { Meta, StoryObj } from "@storybook/react-vite"

import { DashAnalytics } from "@/components/blocks/dash-analytics"
import { DashHealth } from "@/components/blocks/dash-health"
import { DashStore } from "@/components/blocks/dash-store"

const meta = {
  title: "Blocks/Dashboard",
  component: DashStore,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof DashStore>

export default meta

type Story = StoryObj<typeof meta>

export const Store: Story = {}

export const Health: Story = { render: () => <DashHealth /> }

export const Analytics: Story = { render: () => <DashAnalytics /> }
