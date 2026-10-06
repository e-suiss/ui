import type { Meta, StoryObj } from "@storybook/react-vite"

import { VerifyCode } from "@/components/blocks/verify-code"
import { VerifyDevice } from "@/components/blocks/verify-device"
import { VerifyEmail } from "@/components/blocks/verify-email"

const meta = {
  title: "Blocks/Verify",
  component: VerifyCode,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof VerifyCode>

export default meta

type Story = StoryObj<typeof meta>

export const Code: Story = {}

export const Device: Story = { render: () => <VerifyDevice /> }

export const Email: Story = { render: () => <VerifyEmail /> }
