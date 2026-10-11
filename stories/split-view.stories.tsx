import type { Meta, StoryObj } from "@storybook/react-native"
import * as React from "react"
import { View } from "react-native"
import {
  SplitView,
  type SplitViewColumn,
  SplitViewDetail,
  SplitViewItem,
  SplitViewList,
  SplitViewSidebar,
} from "@/components/patterns/split-view"
import { Text } from "@/components/ui/text"

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
  breakpoint,
}: {
  withSidebar?: boolean
  defaultColumn?: SplitViewColumn
  breakpoint?: number
}) {
  const [mailbox, setMailbox] = React.useState("Inbox")
  const [messageId, setMessageId] = React.useState<string>("order")
  const message = messages.find((item) => item.id === messageId) ?? messages[0]

  return (
    <SplitView defaultColumn={defaultColumn} breakpoint={breakpoint}>
      {withSidebar ? (
        <SplitViewSidebar title="Mailboxes">
          {mailboxes.map((name) => (
            <SplitViewItem
              key={name}
              isActive={mailbox === name}
              onPress={() => setMailbox(name)}
            >
              {name}
            </SplitViewItem>
          ))}
        </SplitViewSidebar>
      ) : null}
      <SplitViewList title={mailbox}>
        {messages.map((item) => (
          <SplitViewItem
            key={item.id}
            isActive={item.id === messageId}
            onPress={() => setMessageId(item.id)}
          >
            <View className="flex-row items-baseline justify-between gap-2">
              <Text className="shrink font-semibold" numberOfLines={1}>
                {item.from}
              </Text>
              <Text className="text-sm text-label-secondary">{item.time}</Text>
            </View>
            <Text numberOfLines={1}>{item.subject}</Text>
            <Text className="text-sm text-label-secondary" numberOfLines={1}>
              {item.body}
            </Text>
          </SplitViewItem>
        ))}
      </SplitViewList>
      <SplitViewDetail title={message.subject}>
        <Text className="text-sm text-label-secondary">
          {message.from} · {message.time}
        </Text>
        <Text className="mt-6">{message.body}</Text>
      </SplitViewDetail>
    </SplitView>
  )
}

const meta = {
  title: "Patterns/Split View",
  component: SplitView,
} satisfies Meta<typeof SplitView>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <MailExample />,
}

export const DetailColumn: Story = {
  render: () => <MailExample defaultColumn="detail" />,
}

export const StartOnSidebar: Story = {
  render: () => <MailExample defaultColumn="sidebar" />,
}

export const TwoColumns: Story = {
  render: () => <MailExample withSidebar={false} />,
}

export const Wide: Story = {
  render: () => <MailExample breakpoint={0} />,
}

export const WideTwoColumns: Story = {
  render: () => <MailExample withSidebar={false} breakpoint={0} />,
}
