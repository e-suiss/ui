import type { Meta, StoryObj } from "@storybook/react-vite"

import { UsersDetail } from "@/components/blocks/users-detail"
import { UsersInvite } from "@/components/blocks/users-invite"
import { UsersTable } from "@/components/blocks/users-table"

const meta = {
  title: "Blocks/Users",
  component: UsersTable,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof UsersTable>

export default meta

type Story = StoryObj<typeof meta>

export const List: Story = {}

export const Detail: Story = { render: () => <UsersDetail /> }

export const Invite: Story = { render: () => <UsersInvite /> }
