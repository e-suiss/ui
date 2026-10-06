import type { Meta, StoryObj } from "@storybook/react-vite"

import { LoginAccount } from "@/components/blocks/login-account"
import { LoginPasskey } from "@/components/blocks/login-passkey"
import { LoginSheet } from "@/components/blocks/login-sheet"

const meta = {
  title: "Blocks/Login",
  component: LoginAccount,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof LoginAccount>

export default meta

type Story = StoryObj<typeof meta>

export const Account: Story = {}

export const Passkey: Story = { render: () => <LoginPasskey /> }

export const Sheet: Story = { render: () => <LoginSheet /> }
