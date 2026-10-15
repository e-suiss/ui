import { cn } from "cn"
import {
  ChatCircleIcon,
  CheckIcon,
  type Icon as PhosphorIcon,
  TrayIcon,
} from "phosphor-react-native"
import * as React from "react"
import { useWindowDimensions, View } from "react-native"
import { FadeInDown, ReduceMotion } from "react-native-reanimated"
import {
  SplitView,
  type SplitViewColumn,
  SplitViewDetail,
  SplitViewItem,
  SplitViewList,
  SplitViewSidebar,
} from "@/components/patterns/split-view"
import { AnimatedView } from "@/components/ui/animated-view"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Screen } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type Status = "Open" | "Pending" | "Solved"

type Priority = "High" | "Medium" | "Low"

type Queue = Status | "All"

type Ticket = {
  id: string
  title: string
  device: string
  status: Status
  priority: Priority
  requester: string
  tint: string
}

const INITIAL_TICKETS: Ticket[] = [
  {
    id: "#4821",
    title: "Screen flickers",
    device: "Phone Pro",
    status: "Open",
    priority: "High",
    requester: "Jamie Rivera",
    tint: "bg-orange-500",
  },
  {
    id: "#4820",
    title: "Battery drains fast",
    device: "Book Air",
    status: "Pending",
    priority: "Medium",
    requester: "Morgan Lee",
    tint: "bg-cyan-500",
  },
  {
    id: "#4819",
    title: "Pods won't pair",
    device: "Pods Studio",
    status: "Open",
    priority: "Low",
    requester: "Avery Brooks",
    tint: "bg-pink-500",
  },
  {
    id: "#4818",
    title: "Cloud backup error",
    device: "Phone Air",
    status: "Solved",
    priority: "Medium",
    requester: "Taylor Kim",
    tint: "bg-green-500",
  },
]

const VIEWS: { value: Queue; icon: PhosphorIcon }[] = [
  { value: "Open", icon: ChatCircleIcon },
  { value: "Pending", icon: ChatCircleIcon },
  { value: "Solved", icon: CheckIcon },
  { value: "All", icon: TrayIcon },
]

const STATUSES: Status[] = ["Open", "Pending", "Solved"]

const PRIORITY_CLASS: Record<Priority, { box: string; text: string }> = {
  High: {
    box: "bg-destructive-10 dark:bg-destructive-20",
    text: "text-destructive",
  },
  Medium: {
    box: "bg-amber-500/10 dark:bg-amber-500/20",
    text: "text-amber-600 dark:text-amber-400",
  },
  Low: { box: "bg-secondary", text: "text-muted-foreground" },
}

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")

function Requester({
  ticket,
  size,
  className,
}: {
  ticket: Ticket
  size: "sm" | "default"
  className?: string
}) {
  return (
    <Avatar size={size} className={className}>
      <AvatarFallback className={ticket.tint}>
        {initials(ticket.requester)}
      </AvatarFallback>
    </Avatar>
  )
}

function TicketDetail({
  ticket,
  onStatusChange,
  onReply,
}: {
  ticket: Ticket
  onStatusChange: (status: Status) => void
  onReply: (text: string) => void
}) {
  const [reply, setReply] = React.useState("")

  return (
    <AnimatedView
      key={ticket.id}
      entering={FadeInDown.duration(800).reduceMotion(ReduceMotion.System)}
      className="gap-4"
    >
      <Text className="text-sm text-muted-foreground">
        {`${ticket.id} · ${ticket.device}`}
      </Text>
      <ToggleGroup
        spacing={0}
        size="sm"
        value={[ticket.status]}
        onValueChange={(value) => {
          if (value[0]) onStatusChange(value[0] as Status)
        }}
        accessibilityLabel="Status"
      >
        {STATUSES.map((status) => (
          <ToggleGroupItem key={status} value={status}>
            <Text>{status}</Text>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <Text role="heading" className="text-3xl font-semibold">
        {ticket.title}
      </Text>
      <View className="flex-row items-center gap-2.5">
        <Requester ticket={ticket} size="default" className="size-[2.125rem]" />
        <View>
          <Text className="text-sm font-semibold">{ticket.requester}</Text>
          <Text className="text-xs text-muted-foreground">Today 8:12 AM</Text>
        </View>
      </View>
      <View className="max-w-lg self-start rounded-2xl rounded-ss-sm bg-muted px-3.5 py-3">
        <Text className="text-base">
          Hi, this started right after the latest update. I tried restarting but
          it keeps happening. Can you help?
        </Text>
      </View>
      <View className="gap-2.5">
        <Textarea
          numberOfLines={3}
          value={reply}
          onChangeText={setReply}
          placeholder="Write a reply…"
          accessibilityLabel="Reply"
          className="min-h-20"
        />
        <View className="flex-row flex-wrap gap-2.5">
          <Button
            size="sm"
            disabled={!reply}
            onPress={() => {
              onReply(reply)
              setReply("")
              onStatusChange("Pending")
            }}
          >
            <Text>Send and set pending</Text>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onPress={() => onStatusChange("Solved")}
          >
            <Text>Mark as solved</Text>
          </Button>
        </View>
      </View>
    </AnimatedView>
  )
}

function InboxSupport({
  onViewChange,
  onStatusChange,
  onReply,
}: {
  onViewChange?: (view: Status | "All") => void
  onStatusChange?: (id: string, status: Status) => void
  onReply?: (id: string, text: string) => void
}) {
  const { width } = useWindowDimensions()
  const wide = width >= 768
  const [tickets, setTickets] = React.useState(INITIAL_TICKETS)
  const [view, setView] = React.useState<Queue>("Open")
  const [selected, setSelected] = React.useState("#4821")
  const [column, setColumn] = React.useState<SplitViewColumn>("list")
  const list = tickets.filter(
    (ticket) => view === "All" || ticket.status === view
  )
  const current = tickets.find((ticket) => ticket.id === selected)

  const setStatus = (id: string, status: Status) => {
    onStatusChange?.(id, status)
    setTickets((items) =>
      items.map((ticket) => (ticket.id === id ? { ...ticket, status } : ticket))
    )
  }

  return (
    <Screen edges={["top", "right", "left"]}>
      <SplitView
        column={column}
        onColumnChange={setColumn}
        className={wide ? "m-4" : undefined}
      >
        <SplitViewSidebar
          title="Support"
          className={wide ? "min-h-full bg-muted" : "px-4 pb-8"}
        >
          {VIEWS.map((item) => (
            <SplitViewItem
              key={item.value}
              isActive={view === item.value}
              onPress={() => {
                setView(item.value)
                onViewChange?.(item.value)
              }}
              className={
                wide && view === item.value ? "bg-secondary" : undefined
              }
            >
              <View className="flex-row items-center gap-2.5">
                <Icon as={item.icon} className="size-5 text-primary" />
                <Text className="flex-1">{item.value}</Text>
                <Text className="text-xs text-muted-foreground tabular-nums">
                  {String(
                    item.value === "All"
                      ? tickets.length
                      : tickets.filter((ticket) => ticket.status === item.value)
                          .length
                  )}
                </Text>
              </View>
            </SplitViewItem>
          ))}
        </SplitViewSidebar>
        <SplitViewList
          title={view}
          className={wide ? "gap-1 p-2" : "gap-1 px-4 pb-8"}
        >
          {list.map((ticket) => {
            const priority = PRIORITY_CLASS[ticket.priority]
            return (
              <SplitViewItem
                key={ticket.id}
                isActive={ticket.id === selected}
                onPress={() => setSelected(ticket.id)}
                className="py-3"
              >
                <View className="flex-row items-center gap-2">
                  <Text className="flex-1 text-xs text-muted-foreground">
                    {`${ticket.id} · ${ticket.device}`}
                  </Text>
                  <View className={cn("rounded-md px-2 py-0.5", priority.box)}>
                    <Text
                      className={cn("text-2xs font-semibold", priority.text)}
                    >
                      {ticket.priority}
                    </Text>
                  </View>
                </View>
                <Text className="text-base font-semibold">{ticket.title}</Text>
                <View className="mt-1 flex-row items-center gap-1.5">
                  <Requester ticket={ticket} size="sm" className="size-5" />
                  <Text className="text-xs text-muted-foreground">
                    {ticket.requester}
                  </Text>
                </View>
              </SplitViewItem>
            )
          })}
          {list.length === 0 ? (
            <Text className="p-6 text-center text-sm text-muted-foreground">
              No tickets
            </Text>
          ) : null}
        </SplitViewList>
        <SplitViewDetail className={wide ? "p-[1.375rem]" : "px-4 pb-8"}>
          {current ? (
            <TicketDetail
              ticket={current}
              onStatusChange={(status) => setStatus(current.id, status)}
              onReply={(text) => onReply?.(current.id, text)}
            />
          ) : null}
        </SplitViewDetail>
      </SplitView>
    </Screen>
  )
}

export { InboxSupport }
