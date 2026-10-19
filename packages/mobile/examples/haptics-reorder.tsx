import * as React from "react"
import { View } from "react-native"
import {
  ReorderList,
  ReorderListHandle,
  ReorderListItem,
} from "@/components/interactions/reorder-list"
import { type HapticsAdapter, HapticsProvider } from "@/components/ui/haptics"
import { Text } from "@/components/ui/text"

export default function HapticsReorder() {
  const [log, setLog] = React.useState({ last: "None", count: 0 })
  const adapter = React.useMemo<HapticsAdapter>(() => {
    const record = (event: string) =>
      setLog((current) => ({ last: event, count: current.count + 1 }))
    return {
      impact: (style) => record(`impact ${style}`),
      selection: () => record("selection"),
      notification: (type) => record(`notification ${type}`),
    }
  }, [])
  const [value, setValue] = React.useState([
    "Inbox",
    "Today",
    "Upcoming",
    "Someday",
  ])
  return (
    <HapticsProvider adapter={adapter}>
      <View className="w-full gap-4">
        <View className="flex-row items-center justify-between rounded-xl bg-muted px-4 py-3">
          <Text className="text-sm text-muted-foreground">Last haptic</Text>
          <Text
            role="status"
            accessibilityLiveRegion="polite"
            className="text-sm font-medium"
          >
            {log.count > 0 ? `${log.last} (${log.count})` : log.last}
          </Text>
        </View>
        <ReorderList
          value={value}
          onValueChange={setValue}
          className="overflow-hidden rounded-2xl border border-border"
        >
          {value.map((task) => (
            <ReorderListItem key={task} value={task} className="ps-4">
              <View className="min-w-0 grow py-3">
                <Text numberOfLines={1}>{task}</Text>
              </View>
              <ReorderListHandle accessibilityLabel={`Reorder ${task}`} />
            </ReorderListItem>
          ))}
        </ReorderList>
      </View>
    </HapticsProvider>
  )
}
