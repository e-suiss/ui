import { cn } from "cn"
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
} from "@/components/patterns/split-view"
import { AnimatedView } from "@/components/ui/animated-view"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Screen } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"
import { Textarea } from "@/components/ui/textarea"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type Category = "Primary" | "Transactions" | "Updates" | "Promotions"

type Mail = {
  id: number
  from: string
  subject: string
  body: string
  time: string
  tint: string | null
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
    tint: "bg-orange dark:bg-orange",
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
    tint: "bg-blue dark:bg-blue",
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
    tint: "bg-green dark:bg-green",
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

const CATEGORIES: { value: Category; icon: PhosphorIcon; tint: string }[] = [
  { value: "Primary", icon: UsersIcon, tint: "bg-accent" },
  { value: "Transactions", icon: CreditCardIcon, tint: "bg-green" },
  { value: "Updates", icon: BellIcon, tint: "bg-purple" },
  { value: "Promotions", icon: TagIcon, tint: "bg-pink" },
]

const ENTERING = FadeInDown.duration(800).reduceMotion(ReduceMotion.System)

function SenderAvatar({ mail, className }: { mail: Mail; className?: string }) {
  return (
    <Avatar size="lg" className={className}>
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
      <View className="h-[3.125rem] flex-row items-center justify-end gap-0.5 border-b border-separator">
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
      <AnimatedView
        key={mail.id}
        entering={ENTERING}
        className="gap-4 pt-[1.375rem]"
      >
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
          className="mt-[1.375rem] gap-2.5 border-t border-separator pt-[1.125rem]"
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
        className={wide ? "m-4" : undefined}
      >
        <SplitViewList
          title="Inbox"
          className={wide ? "gap-3 px-2 pt-4" : "gap-3 px-4 pb-8"}
        >
          {wide ? (
            <Text role="heading" className="px-1.5 text-3xl font-bold">
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
            className={wide ? "px-1.5" : undefined}
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
                  className={cn(
                    "relative h-[2.125rem] gap-1.5 px-[0.6875rem]",
                    pressed ? cn("px-3.5", item.tint) : "bg-control"
                  )}
                >
                  <Icon
                    as={item.icon}
                    weight="bold"
                    className={cn(
                      "size-4",
                      pressed ? "text-on-accent" : "text-label-secondary"
                    )}
                  />
                  {pressed ? (
                    <Text className="font-semibold text-on-accent">
                      {item.value}
                    </Text>
                  ) : null}
                  {!pressed && unread ? (
                    <View className="absolute end-0 top-0 size-3 rounded-full border-2 border-surface bg-accent" />
                  ) : null}
                </ToggleGroupItem>
              )
            })}
          </ToggleGroup>
          <View key={category} className="gap-0.5">
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
              <Text className="p-[1.875rem] text-center text-sm text-label-secondary">
                {`No messages in ${category}.`}
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

export { InboxCategories }
