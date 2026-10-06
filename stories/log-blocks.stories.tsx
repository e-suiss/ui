import type { Meta, StoryObj } from "@storybook/react-vite"

import { LogActivity } from "@/components/blocks/log-activity"
import { LogLive } from "@/components/blocks/log-live"
import { LogSecurity } from "@/components/blocks/log-security"

const meta = {
  title: "Blocks/Log",
  component: LogActivity,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof LogActivity>

export default meta

type Story = StoryObj<typeof meta>

export const Activity: Story = {}

export const Live: Story = { render: () => <LogLive /> }

export const Security: Story = { render: () => <LogSecurity /> }
