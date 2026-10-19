import * as React from "react"
import { View } from "react-native"
import {
  SplitView,
  SplitViewDetail,
  SplitViewItem,
  SplitViewList,
} from "@/components/patterns/split-view"
import { Text } from "@/components/ui/text"

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
  const [messageId, setMessageId] = React.useState<string>("order")
  const message = messages.find((item) => item.id === messageId) ?? messages[0]

  return (
    <SplitView>
      <SplitViewList title="Inbox">
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
              <Text className="text-sm text-muted-foreground">{item.time}</Text>
            </View>
            <Text numberOfLines={1}>{item.subject}</Text>
            <Text className="text-sm text-muted-foreground" numberOfLines={1}>
              {item.body}
            </Text>
          </SplitViewItem>
        ))}
      </SplitViewList>
      <SplitViewDetail title={message.subject}>
        <Text className="text-sm text-muted-foreground">
          {message.from} · {message.time}
        </Text>
        <Text className="mt-6">{message.body}</Text>
      </SplitViewDetail>
    </SplitView>
  )
}
