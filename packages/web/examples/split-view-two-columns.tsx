import * as React from "react"
import {
  SplitView,
  SplitViewDetail,
  SplitViewItem,
  SplitViewList,
} from "@/components/patterns/split-view"

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

export default function SplitViewTwoColumns() {
  const [messageId, setMessageId] = React.useState("order")
  const message = messages.find((item) => item.id === messageId) ?? messages[0]

  return (
    <SplitView className="h-[30rem] max-md:h-auto">
      <SplitViewList title="Inbox">
        {messages.map((item) => (
          <SplitViewItem
            key={item.id}
            isActive={item.id === messageId}
            onClick={() => setMessageId(item.id)}
          >
            <span className="flex items-baseline justify-between gap-2">
              <span className="truncate font-semibold">{item.from}</span>
              <span className="shrink-0 text-sm text-muted-foreground">
                {item.time}
              </span>
            </span>
            <span className="truncate">{item.subject}</span>
            <span className="truncate text-sm text-muted-foreground">
              {item.body}
            </span>
          </SplitViewItem>
        ))}
      </SplitViewList>
      <SplitViewDetail title={message.subject}>
        <p className="text-sm text-muted-foreground">
          {message.from} · {message.time}
        </p>
        <p className="mt-6 text-base">{message.body}</p>
      </SplitViewDetail>
    </SplitView>
  )
}
