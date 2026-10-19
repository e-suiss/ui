import * as React from "react"
import { View } from "react-native"
import {
  ReorderList,
  ReorderListHandle,
  ReorderListItem,
} from "@/components/interactions/reorder-list"
import { ItemGroup } from "@/components/ui/item"
import { Text } from "@/components/ui/text"

const tasks: Record<string, { title: string; detail?: string }> = {
  inbox: { title: "Inbox", detail: "12 messages" },
  today: { title: "Today" },
  upcoming: { title: "Upcoming", detail: "Next 7 days" },
  someday: { title: "Someday" },
  archive: {
    title: "Archive",
    detail: "Everything you finished, kept for later reference",
  },
}

const initialOrder = Object.keys(tasks)

export default function ReorderListInset() {
  const [value, setValue] = React.useState(initialOrder)
  return (
    <View className="gap-3">
      <ItemGroup variant="inset">
        <ReorderList value={value} onValueChange={setValue}>
          {value.map((key) => (
            <ReorderListItem key={key} value={key} className="ps-4">
              <View className="min-w-0 flex-1 py-3">
                <Text numberOfLines={1}>{tasks[key].title}</Text>
                {tasks[key].detail ? (
                  <Text className="text-sm text-muted-foreground">
                    {tasks[key].detail}
                  </Text>
                ) : null}
              </View>
              <ReorderListHandle
                accessibilityLabel={`Reorder ${tasks[key].title}`}
              />
            </ReorderListItem>
          ))}
        </ReorderList>
      </ItemGroup>
      <Text role="status" className="text-sm text-muted-foreground">
        {value.map((key) => tasks[key].title).join(", ")}
      </Text>
    </View>
  )
}
