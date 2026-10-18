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

function renderRows(value: string[]) {
  return value.map((key) => {
    const task = tasks[key]
    return (
      <ReorderListItem key={key} value={key} className="ps-4">
        <View className="min-w-0 flex-1 py-3">
          <Text numberOfLines={1}>{task.title}</Text>
          {task.detail ? (
            <Text className="text-sm text-muted-foreground">{task.detail}</Text>
          ) : null}
        </View>
        <ReorderListHandle accessibilityLabel={`Reorder ${task.title}`} />
      </ReorderListItem>
    )
  })
}

function ReorderDemo({ inset = false }: { inset?: boolean }) {
  const [value, setValue] = React.useState(initialOrder)
  return (
    <View className="gap-3">
      {inset ? (
        <ItemGroup variant="inset">
          <ReorderList value={value} onValueChange={setValue}>
            {renderRows(value)}
          </ReorderList>
        </ItemGroup>
      ) : (
        <ReorderList value={value} onValueChange={setValue}>
          {renderRows(value)}
        </ReorderList>
      )}
      <Text role="status" className="text-sm text-muted-foreground">
        {value.map((key) => tasks[key].title).join(", ")}
      </Text>
    </View>
  )
}

export default function ReorderListDemo() {
  return <ReorderDemo />
}
