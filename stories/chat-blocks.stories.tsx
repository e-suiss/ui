import type { Meta, StoryObj } from "@storybook/react-vite"

import { ChatConversations } from "@/components/blocks/chat-conversations"
import { ChatSupport } from "@/components/blocks/chat-support"
import { ChatThread } from "@/components/blocks/chat-thread"

const meta = {
  title: "Blocks/Chat",
  component: ChatConversations,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ChatConversations>

export default meta

type Story = StoryObj<typeof meta>

export const Conversations: Story = {}

export const Thread: Story = { render: () => <ChatThread /> }

export const Support: Story = { render: () => <ChatSupport /> }
