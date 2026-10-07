import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

import {
  SplitView,
  SplitViewDetail,
  SplitViewItem,
  SplitViewList,
  SplitViewSidebar,
} from "@/components/patterns/split-view"

const mailboxes = ["Inbox", "Sent", "Drafts", "Archive"]

const messages = [
  {
    id: "order",
    from: "Acme Store",
    time: "09:12",
    subject: "Your order has shipped",
    body: "Order #1042 will be delivered tomorrow. Tracking number: 4815 1623 42.",
  },
  {
    id: "meeting",
    from: "Jordan Lee",
    time: "Yesterday",
    subject: "Tomorrow's meeting",
    body: "Does 10:00 work for you? On the agenda: the Q4 budget and the campaign plan.",
  },
  {
    id: "storage",
    from: "Cloud Drive",
    time: "Mon",
    subject: "Your storage is almost full",
    body: "Your cloud storage is 90% full. Upgrade your plan to get more space.",
  },
] as const

function MailExample({
  withSidebar = true,
  defaultColumn,
}: {
  withSidebar?: boolean
  defaultColumn?: "sidebar" | "list" | "detail"
}) {
  const [mailbox, setMailbox] = React.useState("Inbox")
  const [messageId, setMessageId] = React.useState("order")
  const message = messages.find((item) => item.id === messageId) ?? messages[0]

  return (
    <SplitView
      defaultColumn={defaultColumn}
      className="h-[34rem] max-md:h-auto"
    >
      {withSidebar && (
        <SplitViewSidebar title="Mailboxes">
          {mailboxes.map((name) => (
            <SplitViewItem
              key={name}
              isActive={mailbox === name}
              onClick={() => setMailbox(name)}
            >
              {name}
            </SplitViewItem>
          ))}
        </SplitViewSidebar>
      )}
      <SplitViewList title={mailbox}>
        {messages.map((item) => (
          <SplitViewItem
            key={item.id}
            isActive={item.id === messageId}
            onClick={() => setMessageId(item.id)}
          >
            <span className="flex items-baseline justify-between gap-2">
              <span className="truncate font-semibold">{item.from}</span>
              <span className="shrink-0 text-sm text-label-secondary">
                {item.time}
              </span>
            </span>
            <span className="truncate">{item.subject}</span>
            <span className="truncate text-sm text-label-secondary">
              {item.body}
            </span>
          </SplitViewItem>
        ))}
      </SplitViewList>
      <SplitViewDetail title={message.subject}>
        <p className="text-sm text-label-secondary">
          {message.from} · {message.time}
        </p>
        <p className="mt-6 text-base">{message.body}</p>
      </SplitViewDetail>
    </SplitView>
  )
}

const meta = {
  title: "Patterns/Split View",
  component: SplitView,
  parameters: { layout: "padded" },
} satisfies Meta<typeof SplitView>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <MailExample />,
}

export const TwoColumns: Story = {
  render: () => <MailExample withSidebar={false} />,
}

export const StartOnSidebar: Story = {
  render: () => <MailExample defaultColumn="sidebar" />,
}
