import * as React from "react"
import {
  ReorderList,
  ReorderListHandle,
  ReorderListItem,
} from "@/components/interactions/reorder-list"
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

export default function ReorderListLeadingHandle() {
  const [value, setValue] = React.useState(initialOrder)
  return (
    <ReorderList
      value={value}
      onValueChange={setValue}
      moveUpLabel="Move earlier"
      moveDownLabel="Move later"
    >
      {value.map((key) => (
        <ReorderListItem key={key} value={key} className="pe-4">
          <ReorderListHandle
            accessibilityLabel={`Reorder ${tasks[key].title}`}
          />
          <Text numberOfLines={1} className="flex-1 py-3">
            {tasks[key].title}
          </Text>
        </ReorderListItem>
      ))}
    </ReorderList>
  )
}
