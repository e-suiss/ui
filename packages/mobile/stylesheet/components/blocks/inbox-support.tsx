import {
  ChatCircleIcon,
  CheckIcon,
  type Icon as PhosphorIcon,
  TrayIcon,
} from "phosphor-react-native"
import * as React from "react"
import {
  StyleSheet,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native"
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
import {
  fontSize,
  radius,
  type ThemeColors,
  useTheme,
} from "@/components/ui/theme"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type Tint = keyof ThemeColors

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
  tint: Tint
}

const INITIAL_TICKETS: Ticket[] = [
  {
    id: "#4821",
    title: "Screen flickers",
    device: "Phone Pro",
    status: "Open",
    priority: "High",
    requester: "Jamie Rivera",
    tint: "orange",
  },
  {
    id: "#4820",
    title: "Battery drains fast",
    device: "Book Air",
    status: "Pending",
    priority: "Medium",
    requester: "Morgan Lee",
    tint: "cyan",
  },
  {
    id: "#4819",
    title: "Pods won't pair",
    device: "Pods Studio",
    status: "Open",
    priority: "Low",
    requester: "Avery Brooks",
    tint: "pink",
  },
  {
    id: "#4818",
    title: "Cloud backup error",
    device: "Phone Air",
    status: "Solved",
    priority: "Medium",
    requester: "Taylor Kim",
    tint: "green",
  },
]

const VIEWS: { value: Queue; icon: PhosphorIcon }[] = [
  { value: "Open", icon: ChatCircleIcon },
  { value: "Pending", icon: ChatCircleIcon },
  { value: "Solved", icon: CheckIcon },
  { value: "All", icon: TrayIcon },
]

const STATUSES: Status[] = ["Open", "Pending", "Solved"]

const PRIORITY_COLORS: Record<Priority, { box: Tint; text: Tint }> = {
  High: { box: "dangerSurface", text: "danger" },
  Medium: { box: "warningSurface", text: "warning" },
  Low: { box: "control", text: "labelSecondary" },
}

const styles = StyleSheet.create({
  detail: { gap: 16 },
  title: { ...fontSize["3xl"], fontWeight: "600" },
  requester: { flexDirection: "row", alignItems: "center", gap: 10 },
  semibold: { ...fontSize.sm, fontWeight: "600" },
  bubble: {
    maxWidth: 512,
    alignSelf: "flex-start",
    borderRadius: radius["2xl"],
    borderTopStartRadius: radius.sm,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  replyBox: { gap: 10 },
  textarea: { minHeight: 80 },
  buttons: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  wide: { margin: 16 },
  sidebar: { paddingHorizontal: 16, paddingBottom: 32 },
  view: { flexDirection: "row", alignItems: "center", gap: 10 },
  fill: { flex: 1 },
  count: { ...fontSize.xs, fontVariant: ["tabular-nums"] },
  listWide: { gap: 4, padding: 8 },
  list: { gap: 4, paddingHorizontal: 16, paddingBottom: 32 },
  ticket: { paddingVertical: 12 },
  ticketTop: { flexDirection: "row", alignItems: "center", gap: 8 },
  ticketId: { ...fontSize.xs, flex: 1 },
  priority: {
    borderRadius: radius.md,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  priorityText: { ...fontSize["2xs"], fontWeight: "600" },
  ticketTitle: { ...fontSize.base, fontWeight: "600" },
  ticketFooter: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  empty: { ...fontSize.sm, padding: 24, textAlign: "center" },
  detailWide: { padding: 22 },
  detailCompact: { paddingHorizontal: 16, paddingBottom: 32 },
})

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")

function Requester({
  ticket,
  size,
  style,
}: {
  ticket: Ticket
  size: "sm" | "default"
  style?: ViewStyle
}) {
  const { colors } = useTheme()
  return (
    <Avatar size={size} style={style}>
      <AvatarFallback style={{ backgroundColor: colors[ticket.tint] }}>
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
  const { colors } = useTheme()
  const [reply, setReply] = React.useState("")

  return (
    <AnimatedView
      key={ticket.id}
      entering={FadeInDown.duration(800).reduceMotion(ReduceMotion.System)}
      style={styles.detail}
    >
      <Text style={[fontSize.sm, { color: colors.labelSecondary }]}>
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
      <Text role="heading" style={styles.title}>
        {ticket.title}
      </Text>
      <View style={styles.requester}>
        <Requester
          ticket={ticket}
          size="default"
          style={{ width: 34, height: 34 }}
        />
        <View>
          <Text style={styles.semibold}>{ticket.requester}</Text>
          <Text style={[fontSize.xs, { color: colors.labelSecondary }]}>
            Today 8:12 AM
          </Text>
        </View>
      </View>
      <View
        style={[styles.bubble, { backgroundColor: colors.surfaceSecondary }]}
      >
        <Text style={fontSize.base}>
          Hi, this started right after the latest update. I tried restarting but
          it keeps happening. Can you help?
        </Text>
      </View>
      <View style={styles.replyBox}>
        <Textarea
          numberOfLines={3}
          value={reply}
          onChangeText={setReply}
          placeholder="Write a reply…"
          accessibilityLabel="Reply"
          style={styles.textarea}
        />
        <View style={styles.buttons}>
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
  const { colors } = useTheme()
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
        style={wide ? styles.wide : undefined}
      >
        <SplitViewSidebar
          title="Support"
          style={
            wide
              ? { minHeight: "100%", backgroundColor: colors.surfaceSecondary }
              : styles.sidebar
          }
        >
          {VIEWS.map((item) => (
            <SplitViewItem
              key={item.value}
              isActive={view === item.value}
              onPress={() => {
                setView(item.value)
                onViewChange?.(item.value)
              }}
              style={
                wide && view === item.value
                  ? { backgroundColor: colors.control }
                  : undefined
              }
            >
              <View style={styles.view}>
                <Icon as={item.icon} size={20} color={colors.accent} />
                <Text style={styles.fill}>{item.value}</Text>
                <Text style={[styles.count, { color: colors.labelSecondary }]}>
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
          style={wide ? styles.listWide : styles.list}
        >
          {list.map((ticket) => {
            const priority = PRIORITY_COLORS[ticket.priority]
            return (
              <SplitViewItem
                key={ticket.id}
                isActive={ticket.id === selected}
                onPress={() => setSelected(ticket.id)}
                style={styles.ticket}
              >
                <View style={styles.ticketTop}>
                  <Text
                    style={[styles.ticketId, { color: colors.labelSecondary }]}
                  >
                    {`${ticket.id} · ${ticket.device}`}
                  </Text>
                  <View
                    style={[
                      styles.priority,
                      { backgroundColor: colors[priority.box] },
                    ]}
                  >
                    <Text
                      style={[
                        styles.priorityText,
                        { color: colors[priority.text] },
                      ]}
                    >
                      {ticket.priority}
                    </Text>
                  </View>
                </View>
                <Text style={styles.ticketTitle}>{ticket.title}</Text>
                <View style={styles.ticketFooter}>
                  <Requester
                    ticket={ticket}
                    size="sm"
                    style={{ width: 20, height: 20 }}
                  />
                  <Text style={[fontSize.xs, { color: colors.labelSecondary }]}>
                    {ticket.requester}
                  </Text>
                </View>
              </SplitViewItem>
            )
          })}
          {list.length === 0 ? (
            <Text style={[styles.empty, { color: colors.labelSecondary }]}>
              No tickets
            </Text>
          ) : null}
        </SplitViewList>
        <SplitViewDetail
          style={wide ? styles.detailWide : styles.detailCompact}
        >
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
