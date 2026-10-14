import {
  ArchiveIcon,
  ArrowBendUpLeftIcon,
  BellIcon,
  CreditCardIcon,
  type Icon as PhosphorIcon,
  StarIcon,
  TagIcon,
  TrashIcon,
  UsersIcon,
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

type Category = "Primary" | "Transactions" | "Updates" | "Promotions"

type Mail = {
  id: number
  from: string
  subject: string
  body: string
  time: string
  tint: Tint | null
  category: Category
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
    category: "Transactions",
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
    category: "Primary",
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
    category: "Updates",
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
    category: "Primary",
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
    category: "Promotions",
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
    category: "Transactions",
    unread: false,
    starred: false,
  },
]

const CATEGORIES: { value: Category; icon: PhosphorIcon; tint: Tint }[] = [
  { value: "Primary", icon: UsersIcon, tint: "accent" },
  { value: "Transactions", icon: CreditCardIcon, tint: "green" },
  { value: "Updates", icon: BellIcon, tint: "purple" },
  { value: "Promotions", icon: TagIcon, tint: "pink" },
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
  listWide: { gap: 12, paddingHorizontal: 8, paddingTop: 16 },
  list: { gap: 12, paddingHorizontal: 16, paddingBottom: 32 },
  title: { ...fontSize["3xl"], paddingHorizontal: 6, fontWeight: "700" },
  toggles: { paddingHorizontal: 6 },
  toggle: { position: "relative", height: 34, gap: 6, paddingHorizontal: 11 },
  toggleOn: { paddingHorizontal: 14 },
  toggleText: { fontWeight: "600" },
  badge: {
    position: "absolute",
    end: 0,
    top: 0,
    width: 12,
    height: 12,
    borderRadius: radius.full,
    borderWidth: 2,
  },
  rows: { gap: 2 },
  empty: { ...fontSize.sm, padding: 30, textAlign: "center" },
  detail: { flexGrow: 1, paddingHorizontal: 16, paddingBottom: 32 },
  none: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },
})

function SenderAvatar({ mail, style }: { mail: Mail; style?: ViewStyle }) {
  const { colors } = useTheme()
  return (
    <Avatar size="lg" style={style}>
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

function InboxCategories({
  onCategoryChange,
  onReply,
  onStarChange,
  onArchive,
  onDelete,
}: {
  onCategoryChange?: (category: Category) => void
  onReply?: (id: number, text: string) => void
  onStarChange?: (id: number, starred: boolean) => void
  onArchive?: (id: number) => void
  onDelete?: (id: number) => void
}) {
  const { colors } = useTheme()
  const { width } = useWindowDimensions()
  const wide = width >= 768
  const [mail, setMail] = React.useState(INITIAL_MAIL)
  const [category, setCategory] = React.useState<Category>("Primary")
  const [selected, setSelected] = React.useState<number | null>(1)
  const [column, setColumn] = React.useState<SplitViewColumn>("list")
  const list = mail.filter((item) => item.category === category)
  const current = list.find((item) => item.id === selected)

  const update = (id: number, patch: Partial<Mail>) =>
    setMail((items) =>
      items.map((item) => (item.id === id ? { ...item, ...patch } : item))
    )

  const remove = (id: number) => {
    const rest = mail.filter((item) => item.id !== id)
    setMail(rest)
    if (selected === id) {
      setSelected(rest.find((item) => item.category === category)?.id ?? null)
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
        <SplitViewList
          title="Inbox"
          style={wide ? styles.listWide : styles.list}
        >
          {wide ? (
            <Text role="heading" style={styles.title}>
              Inbox
            </Text>
          ) : null}
          <ToggleGroup
            value={[category]}
            onValueChange={(value) => {
              const next = value[0] as Category | undefined
              if (!next) return
              setCategory(next)
              setSelected(
                mail.find((item) => item.category === next)?.id ?? null
              )
              onCategoryChange?.(next)
            }}
            accessibilityLabel="Category"
            spacing={1.5}
            style={wide ? styles.toggles : undefined}
          >
            {CATEGORIES.map((item) => {
              const unread = mail.some(
                (entry) => entry.category === item.value && entry.unread
              )
              const pressed = category === item.value
              return (
                <ToggleGroupItem
                  key={item.value}
                  value={item.value}
                  accessibilityLabel={item.value}
                  accessibilityHint={!pressed && unread ? "Unread" : undefined}
                  style={[
                    styles.toggle,
                    pressed
                      ? [
                          styles.toggleOn,
                          { backgroundColor: colors[item.tint] },
                        ]
                      : { backgroundColor: colors.control },
                  ]}
                >
                  <Icon
                    as={item.icon}
                    weight="bold"
                    size={16}
                    color={pressed ? colors.onAccent : colors.labelSecondary}
                  />
                  {pressed ? (
                    <Text
                      style={[styles.toggleText, { color: colors.onAccent }]}
                    >
                      {item.value}
                    </Text>
                  ) : null}
                  {!pressed && unread ? (
                    <View
                      style={[
                        styles.badge,
                        {
                          borderColor: colors.surface,
                          backgroundColor: colors.accent,
                        },
                      ]}
                    />
                  ) : null}
                </ToggleGroupItem>
              )
            })}
          </ToggleGroup>
          <View key={category} style={styles.rows}>
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
                {`No messages in ${category}.`}
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

export { InboxCategories }
