import {
  ArchiveIcon,
  ArrowBendUpLeftIcon,
  MagnifyingGlassIcon,
  NotePencilIcon,
  PaperPlaneTiltIcon,
  type Icon as PhosphorIcon,
  StarIcon,
  TrashIcon,
  TrayIcon,
} from "phosphor-react-native"
import * as React from "react"
import { StyleSheet, useWindowDimensions, View } from "react-native"
import { FadeInDown, ReduceMotion } from "react-native-reanimated"
import {
  SwipeAction,
  SwipeActions,
  SwipeActionsActions,
  SwipeActionsContent,
} from "@/components/interactions/swipe-actions"
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Screen } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"
import { Textarea } from "@/components/ui/textarea"
import {
  fontSize,
  radius,
  type ThemeColors,
  useTheme,
} from "@/components/ui/theme"

type Mail = {
  id: number
  from: string
  subject: string
  body: string
  time: string
  tint: keyof ThemeColors | null
  unread: boolean
  starred: boolean
}

const INITIAL_MAIL: Mail[] = [
  {
    id: 0,
    from: "suiss",
    subject: "Your order has shipped",
    body: "Order #W1048 is on its way and arrives tomorrow. A signature is required on delivery.",
    time: "9:12 AM",
    tint: null,
    unread: true,
    starred: false,
  },
  {
    id: 1,
    from: "Morgan Lee",
    subject: "Tomorrow's meeting",
    body: "Does 10:00 tomorrow work? The Q4 budget and the campaign calendar are on the agenda. I'll share the deck tonight.",
    time: "8:40 AM",
    tint: "orange",
    unread: true,
    starred: false,
  },
  {
    id: 2,
    from: "suiss Cloud",
    subject: "Your storage is almost full",
    body: "90% of your Cloud storage is used. Upgrade your plan to keep your backups running.",
    time: "Yesterday",
    tint: "blue",
    unread: true,
    starred: false,
  },
  {
    id: 3,
    from: "Riley Chen",
    subject: "Coast trip photos",
    body: "I added the photos to the shared album. The ones from the boat tour came out great.",
    time: "Yesterday",
    tint: "green",
    unread: false,
    starred: true,
  },
  {
    id: 4,
    from: "suiss Store",
    subject: "Just for you: a Trade In offer",
    body: "Bring in your old phone and get up to $650 off a new one.",
    time: "Monday",
    tint: null,
    unread: false,
    starred: false,
  },
  {
    id: 5,
    from: "App Store",
    subject: "Your receipt",
    body: "Your Studio Pro subscription renewed. Total: $4.99.",
    time: "Monday",
    tint: null,
    unread: false,
    starred: false,
  },
]

const MAILBOXES: { value: string; icon: PhosphorIcon }[] = [
  { value: "Inbox", icon: TrayIcon },
  { value: "Starred", icon: StarIcon },
  { value: "Sent", icon: PaperPlaneTiltIcon },
  { value: "Archive", icon: ArchiveIcon },
  { value: "Trash", icon: TrashIcon },
]

const ENTERING = FadeInDown.duration(800).reduceMotion(ReduceMotion.System)

const styles = StyleSheet.create({
  reader: { flex: 1 },
  toolbar: {
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 2,
    borderBottomWidth: 1,
  },
  message: { gap: 16, paddingTop: 22 },
  sender: { flexDirection: "row", alignItems: "center", gap: 12 },
  senderText: { flex: 1 },
  semibold: { ...fontSize.base, fontWeight: "600" },
  subject: { ...fontSize["2xl"], fontWeight: "600" },
  reply: { marginTop: 22, gap: 10, borderTopWidth: 1, paddingTop: 18 },
  textarea: { minHeight: 96 },
  buttons: { flexDirection: "row", gap: 10 },
  transparent: { backgroundColor: "transparent" },
  row: { position: "relative", paddingVertical: 10, paddingStart: 24 },
  dot: {
    position: "absolute",
    start: -14,
    top: 6,
    width: 8,
    height: 8,
    borderRadius: radius.full,
  },
  rowTop: { flexDirection: "row", alignItems: "center", gap: 6 },
  from: { ...fontSize.sm, flex: 1, fontWeight: "600" },
  wide: { margin: 16 },
  mailbox: { flexDirection: "row", alignItems: "center", gap: 10 },
  fill: { flex: 1 },
  count: { ...fontSize.xs, fontVariant: ["tabular-nums"] },
  sidebar: { paddingHorizontal: 16, paddingBottom: 32 },
  listWide: { gap: 8, paddingHorizontal: 8, paddingTop: 12 },
  list: { gap: 8, paddingHorizontal: 16, paddingBottom: 32 },
  listTop: { flexDirection: "row", alignItems: "center", gap: 8 },
  listTopWide: { paddingHorizontal: 4 },
  listTopCompact: { position: "absolute", end: 8, top: 0 },
  mailboxTitle: { ...fontSize.lg, fontWeight: "600" },
  search: { height: 36, borderRadius: 10 },
  searchWide: { marginHorizontal: 4 },
  rows: { gap: 2 },
  empty: { ...fontSize.sm, padding: 24, textAlign: "center" },
  detail: { flexGrow: 1, paddingHorizontal: 16, paddingBottom: 32 },
  none: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
})

function SenderAvatar({ mail }: { mail: Mail }) {
  const { colors } = useTheme()
  return (
    <Avatar size="lg">
      <AvatarFallback
        style={{ backgroundColor: colors[mail.tint ?? "label"] }}
        accessibilityLabel={mail.from}
      >
        <Text
          style={
            mail.tint
              ? undefined
              : { color: colors.surface, textTransform: "none" }
          }
        >
          {mail.tint
            ? mail.from
                .split(" ")
                .map((part) => part[0])
                .join("")
            : "s"}
        </Text>
      </AvatarFallback>
    </Avatar>
  )
}

function Reader({
  mail,
  onReply,
  onStar,
  onArchive,
  onDelete,
}: {
  mail: Mail
  onReply: (text: string) => void
  onStar: () => void
  onArchive: () => void
  onDelete: () => void
}) {
  const { colors } = useTheme()
  const [replying, setReplying] = React.useState(false)
  const [reply, setReply] = React.useState("")

  const actions: {
    label: string
    icon: PhosphorIcon
    onPress: () => void
    active?: boolean
  }[] = [
    {
      label: "Reply",
      icon: ArrowBendUpLeftIcon,
      onPress: () => setReplying(true),
    },
    {
      label: mail.starred ? "Unstar" : "Star",
      icon: StarIcon,
      onPress: onStar,
      active: mail.starred,
    },
    { label: "Archive", icon: ArchiveIcon, onPress: onArchive },
    { label: "Delete", icon: TrashIcon, onPress: onDelete },
  ]

  return (
    <View style={styles.reader}>
      <View style={[styles.toolbar, { borderBottomColor: colors.separator }]}>
        {actions.map((action) => (
          <Button
            key={action.label}
            variant="ghost"
            size="icon"
            accessibilityLabel={action.label}
            accessibilityState={
              action.active === undefined
                ? undefined
                : { selected: action.active }
            }
            onPress={action.onPress}
          >
            <Icon
              as={action.icon}
              weight={action.active ? "fill" : "regular"}
              size={20}
              color={action.active ? colors.orange : colors.labelSecondary}
            />
          </Button>
        ))}
      </View>
      <AnimatedView key={mail.id} entering={ENTERING} style={styles.message}>
        <View style={styles.sender}>
          <SenderAvatar mail={mail} />
          <View style={styles.senderText}>
            <Text style={styles.semibold}>{mail.from}</Text>
            <Text style={[fontSize.xs, { color: colors.labelSecondary }]}>
              To: Jamie Rivera
            </Text>
          </View>
          <Text style={[fontSize.xs, { color: colors.labelSecondary }]}>
            {mail.time}
          </Text>
        </View>
        <Text role="heading" style={styles.subject}>
          {mail.subject}
        </Text>
        <Text style={fontSize.base}>{mail.body}</Text>
      </AnimatedView>
      {replying ? (
        <AnimatedView
          entering={ENTERING}
          style={[styles.reply, { borderTopColor: colors.separator }]}
        >
          <Textarea
            autoFocus
            numberOfLines={4}
            value={reply}
            onChangeText={setReply}
            placeholder={`Reply to ${mail.from}`}
            accessibilityLabel={`Reply to ${mail.from}`}
            style={styles.textarea}
          />
          <View style={styles.buttons}>
            <Button
              size="sm"
              disabled={!reply}
              onPress={() => {
                onReply(reply)
                setReplying(false)
                setReply("")
              }}
            >
              <Text>Send</Text>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onPress={() => setReplying(false)}
            >
              <Text>Cancel</Text>
            </Button>
          </View>
        </AnimatedView>
      ) : null}
    </View>
  )
}

function MailRow({
  mail,
  index,
  active,
  onPress,
  onArchive,
  onDelete,
}: {
  mail: Mail
  index: number
  active: boolean
  onPress: () => void
  onArchive: () => void
  onDelete: () => void
}) {
  const { colors } = useTheme()
  const muted = { color: active ? colors.onAccent : colors.labelSecondary }
  return (
    <AnimatedView
      entering={FadeInDown.delay(index * 40)
        .duration(700)
        .reduceMotion(ReduceMotion.System)}
    >
      <SwipeActions>
        <SwipeActionsContent style={styles.transparent}>
          <SplitViewItem
            isActive={active}
            onPress={onPress}
            accessibilityHint={
              [mail.unread && "Unread", mail.starred && "Starred"]
                .filter(Boolean)
                .join(", ") || undefined
            }
            style={
              active
                ? { ...styles.row, backgroundColor: colors.accent }
                : styles.row
            }
          >
            {mail.unread ? (
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: active ? colors.onAccent : colors.accent,
                  },
                ]}
              />
            ) : null}
            <View style={styles.rowTop}>
              <Text
                numberOfLines={1}
                style={[styles.from, active && { color: colors.onAccent }]}
              >
                {mail.from}
              </Text>
              {mail.starred ? (
                <Icon
                  as={StarIcon}
                  weight="fill"
                  size={12}
                  color={active ? colors.onAccent : colors.orange}
                />
              ) : null}
              <Text style={[fontSize.xs, muted]}>{mail.time}</Text>
            </View>
            <Text
              numberOfLines={1}
              style={[fontSize.sm, active && { color: colors.onAccent }]}
            >
              {mail.subject}
            </Text>
            <Text numberOfLines={2} style={[fontSize.xs, muted]}>
              {mail.body}
            </Text>
          </SplitViewItem>
        </SwipeActionsContent>
        <SwipeActionsActions side="trailing">
          <SwipeAction variant="archive" onPress={onArchive}>
            <Icon as={ArchiveIcon} />
            <Text>Archive</Text>
          </SwipeAction>
          <SwipeAction variant="destructive" fullSwipe onPress={onDelete}>
            <Icon as={TrashIcon} />
            <Text>Delete</Text>
          </SwipeAction>
        </SwipeActionsActions>
      </SwipeActions>
    </AnimatedView>
  )
}

function InboxMail({
  onMailboxChange,
  onNewMessage,
  onReply,
  onStarChange,
  onArchive,
  onDelete,
}: {
  onMailboxChange?: (mailbox: string) => void
  onNewMessage?: () => void
  onReply?: (id: number, text: string) => void
  onStarChange?: (id: number, starred: boolean) => void
  onArchive?: (id: number) => void
  onDelete?: (id: number) => void
}) {
  const { colors } = useTheme()
  const { width } = useWindowDimensions()
  const wide = width >= 768
  const [mail, setMail] = React.useState(INITIAL_MAIL)
  const [mailbox, setMailbox] = React.useState("Inbox")
  const [selected, setSelected] = React.useState<number | null>(0)
  const [query, setQuery] = React.useState("")
  const [column, setColumn] = React.useState<SplitViewColumn>("list")
  const unread = mail.filter((item) => item.unread).length
  const starred = mail.filter((item) => item.starred).length
  const counts: Record<string, number> = { Inbox: unread, Starred: starred }
  const list = mail.filter(
    (item) =>
      (mailbox !== "Starred" || item.starred) &&
      (!query ||
        `${item.from} ${item.subject} ${item.body}`
          .toLowerCase()
          .includes(query.toLowerCase()))
  )
  const current = mail.find((item) => item.id === selected)

  const update = (id: number, patch: Partial<Mail>) =>
    setMail((items) =>
      items.map((item) => (item.id === id ? { ...item, ...patch } : item))
    )

  const remove = (id: number) => {
    const rest = mail.filter((item) => item.id !== id)
    setMail(rest)
    if (selected === id) {
      setSelected(rest[0]?.id ?? null)
      setColumn("list")
    }
  }

  return (
    <Screen edges={["top", "right", "left"]}>
      <SplitView
        column={column}
        onColumnChange={setColumn}
        style={wide ? styles.wide : undefined}
      >
        <SplitViewSidebar
          title="Mailboxes"
          style={
            wide
              ? { minHeight: "100%", backgroundColor: colors.surfaceSecondary }
              : styles.sidebar
          }
        >
          {MAILBOXES.map((box) => (
            <SplitViewItem
              key={box.value}
              isActive={mailbox === box.value}
              onPress={() => {
                setMailbox(box.value)
                onMailboxChange?.(box.value)
              }}
              style={
                wide && mailbox === box.value
                  ? { backgroundColor: colors.control }
                  : undefined
              }
            >
              <View style={styles.mailbox}>
                <Icon as={box.icon} size={20} color={colors.accent} />
                <Text style={styles.fill}>{box.value}</Text>
                <Text style={[styles.count, { color: colors.labelSecondary }]}>
                  {counts[box.value] ? String(counts[box.value]) : ""}
                </Text>
              </View>
            </SplitViewItem>
          ))}
        </SplitViewSidebar>
        <SplitViewList
          title={mailbox}
          style={wide ? styles.listWide : styles.list}
        >
          <View
            style={[
              styles.listTop,
              wide ? styles.listTopWide : styles.listTopCompact,
            ]}
          >
            {wide ? (
              <View style={styles.fill}>
                <Text style={styles.mailboxTitle}>{mailbox}</Text>
                <Text
                  style={[fontSize["2xs"], { color: colors.labelSecondary }]}
                >
                  {unread ? `${unread} unread` : "All read"}
                </Text>
              </View>
            ) : null}
            <Button
              variant="ghost"
              size="icon"
              accessibilityLabel="New message"
              onPress={onNewMessage}
            >
              <Icon as={NotePencilIcon} size={20} color={colors.accent} />
            </Button>
          </View>
          <InputGroup style={[styles.search, wide && styles.searchWide]}>
            <InputGroupAddon>
              <Icon
                as={MagnifyingGlassIcon}
                weight="bold"
                size={16}
                color={colors.labelSecondary}
              />
            </InputGroupAddon>
            <InputGroupInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search"
              accessibilityLabel="Search mail"
              returnKeyType="search"
              autoCorrect={false}
              clearButtonMode="while-editing"
            />
          </InputGroup>
          <View style={styles.rows}>
            {list.length > 0 ? (
              list.map((item, index) => (
                <MailRow
                  key={item.id}
                  mail={item}
                  index={index}
                  active={wide && item.id === selected}
                  onPress={() => {
                    setSelected(item.id)
                    update(item.id, { unread: false })
                  }}
                  onArchive={() => {
                    onArchive?.(item.id)
                    remove(item.id)
                  }}
                  onDelete={() => {
                    onDelete?.(item.id)
                    remove(item.id)
                  }}
                />
              ))
            ) : (
              <Text style={[styles.empty, { color: colors.labelSecondary }]}>
                No Results
              </Text>
            )}
          </View>
        </SplitViewList>
        <SplitViewDetail style={wide ? undefined : styles.detail}>
          {current ? (
            <Reader
              mail={current}
              onReply={(text) => onReply?.(current.id, text)}
              onStar={() => {
                onStarChange?.(current.id, !current.starred)
                update(current.id, { starred: !current.starred })
              }}
              onArchive={() => {
                onArchive?.(current.id)
                remove(current.id)
              }}
              onDelete={() => {
                onDelete?.(current.id)
                remove(current.id)
              }}
            />
          ) : (
            <View style={styles.none}>
              <Text style={{ color: colors.labelSecondary }}>
                No Message Selected
              </Text>
            </View>
          )}
        </SplitViewDetail>
      </SplitView>
    </Screen>
  )
}

export { InboxMail }
