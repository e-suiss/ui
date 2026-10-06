import type { Meta, StoryObj } from "@storybook/react-vite"

import { InboxCategories } from "@/components/blocks/inbox-categories"
import { InboxMail } from "@/components/blocks/inbox-mail"
import { InboxSupport } from "@/components/blocks/inbox-support"

const meta = {
  title: "Blocks/Inbox",
  component: InboxMail,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof InboxMail>

export default meta

type Story = StoryObj<typeof meta>

export const Mail: Story = {}

export const Categories: Story = { render: () => <InboxCategories /> }

export const Support: Story = { render: () => <InboxSupport /> }
