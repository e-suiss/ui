import { cn } from "cn"
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
import { useWindowDimensions, View } from "react-native"
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

type Mail = {
  id: number
  from: string
  subject: string
  body: string
  time: string
  tint: string | null
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
    tint: "bg-orange dark:bg-orange",
    unread: true,
    starred: false,
  },
  {
    id: 2,
    from: "suiss Cloud",
    subject: "Your storage is almost full",
    body: "90% of your Cloud storage is used. Upgrade your plan to keep your backups running.",
    time: "Yesterday",
    tint: "bg-blue dark:bg-blue",
    unread: true,
    starred: false,
  },
  {
    id: 3,
    from: "Riley Chen",
    subject: "Coast trip photos",
    body: "I added the photos to the shared album. The ones from the boat tour came out great.",
    time: "Yesterday",
    tint: "bg-green dark:bg-green",
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

function SenderAvatar({ mail }: { mail: Mail }) {
  return (
    <Avatar size="lg">
      <AvatarFallback
        className={mail.tint ?? "bg-label dark:bg-label"}
        accessibilityLabel={mail.from}
      >
        <Text className={mail.tint ? undefined : "text-surface normal-case"}>
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
    <View className="flex-1">
      <View className="h-12.5 flex-row items-center justify-end gap-0.5 border-b border-separator">
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
              className={cn(
                "size-5",
                action.active ? "text-orange" : "text-label-secondary"
              )}
            />
          </Button>
        ))}
      </View>
      <AnimatedView key={mail.id} entering={ENTERING} className="gap-4 pt-5.5">
        <View className="flex-row items-center gap-3">
          <SenderAvatar mail={mail} />
          <View className="flex-1">
            <Text className="text-base font-semibold">{mail.from}</Text>
            <Text className="text-xs text-label-secondary">
              To: Jamie Rivera
            </Text>
          </View>
          <Text className="text-xs text-label-secondary">{mail.time}</Text>
        </View>
        <Text role="heading" className="text-2xl font-semibold">
          {mail.subject}
        </Text>
        <Text className="text-base">{mail.body}</Text>
      </AnimatedView>
      {replying ? (
        <AnimatedView
          entering={ENTERING}
          className="mt-5.5 gap-2.5 border-t border-separator pt-4.5"
        >
          <Textarea
            autoFocus
            numberOfLines={4}
            value={reply}
            onChangeText={setReply}
            placeholder={`Reply to ${mail.from}`}
            accessibilityLabel={`Reply to ${mail.from}`}
            className="min-h-24"
          />
          <View className="flex-row gap-2.5">
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
  const muted = active ? "text-on-accent" : "text-label-secondary"
  return (
    <AnimatedView
      entering={FadeInDown.delay(index * 40)
        .duration(700)
        .reduceMotion(ReduceMotion.System)}
    >
      <SwipeActions>
        <SwipeActionsContent className="bg-transparent">
          <SplitViewItem
            isActive={active}
            onPress={onPress}
            accessibilityHint={
              [mail.unread && "Unread", mail.starred && "Starred"]
                .filter(Boolean)
                .join(", ") || undefined
            }
            className={cn("relative py-2.5 ps-6", active && "bg-accent")}
          >
            {mail.unread ? (
              <View
                className={cn(
                  "absolute -start-3.5 top-1.5 size-2 rounded-full",
                  active ? "bg-on-accent" : "bg-accent"
                )}
              />
            ) : null}
            <View className="flex-row items-center gap-1.5">
              <Text
                numberOfLines={1}
                className={cn(
                  "flex-1 text-sm font-semibold",
                  active && "text-on-accent"
                )}
              >
                {mail.from}
              </Text>
              {mail.starred ? (
                <Icon
                  as={StarIcon}
                  weight="fill"
                  className={cn(
                    "size-3",
                    active ? "text-on-accent" : "text-orange"
                  )}
                />
              ) : null}
              <Text className={cn("text-xs", muted)}>{mail.time}</Text>
            </View>
            <Text
              numberOfLines={1}
              className={cn("text-sm", active && "text-on-accent")}
            >
              {mail.subject}
            </Text>
            <Text numberOfLines={2} className={cn("text-xs", muted)}>
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
        className={wide ? "m-4" : undefined}
      >
        <SplitViewSidebar
          title="Mailboxes"
          className={wide ? "min-h-full bg-surface-secondary" : "px-4 pb-8"}
        >
          {MAILBOXES.map((box) => (
            <SplitViewItem
              key={box.value}
              isActive={mailbox === box.value}
              onPress={() => {
                setMailbox(box.value)
                onMailboxChange?.(box.value)
              }}
              className={
                wide && mailbox === box.value ? "bg-control" : undefined
              }
            >
              <View className="flex-row items-center gap-2.5">
                <Icon as={box.icon} className="size-5 text-accent" />
                <Text className="flex-1">{box.value}</Text>
                <Text className="text-xs text-label-secondary tabular-nums">
                  {counts[box.value] ? String(counts[box.value]) : ""}
                </Text>
              </View>
            </SplitViewItem>
          ))}
        </SplitViewSidebar>
        <SplitViewList
          title={mailbox}
          className={wide ? "gap-2 px-2 pt-3" : "gap-2 px-4 pb-8"}
        >
          <View
            className={cn(
              "flex-row items-center gap-2",
              wide ? "px-1" : "absolute end-2 top-0"
            )}
          >
            {wide ? (
              <View className="flex-1">
                <Text className="text-lg font-semibold">{mailbox}</Text>
                <Text className="text-2xs text-label-secondary">
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
              <Icon as={NotePencilIcon} className="size-5 text-accent" />
            </Button>
          </View>
          <InputGroup className={cn("h-9 rounded-[0.625rem]", wide && "mx-1")}>
            <InputGroupAddon>
              <Icon
                as={MagnifyingGlassIcon}
                weight="bold"
                className="size-4 text-label-secondary"
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
          <View className="gap-0.5">
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
              <Text className="p-6 text-center text-sm text-label-secondary">
                No Results
              </Text>
            )}
          </View>
        </SplitViewList>
        <SplitViewDetail className={wide ? undefined : "grow px-4 pb-8"}>
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
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-label-secondary">No Message Selected</Text>
            </View>
          )}
        </SplitViewDetail>
      </SplitView>
    </Screen>
  )
}

export { InboxMail }
