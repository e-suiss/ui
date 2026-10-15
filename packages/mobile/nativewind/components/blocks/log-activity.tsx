import { cn } from "cn"
import {
  CaretRightIcon,
  ChartBarIcon,
  GearIcon,
  HandbagIcon,
  NotePencilIcon,
  type Icon as PhosphorIcon,
  ShieldIcon,
  TagIcon,
  UserIcon,
  UsersIcon,
} from "phosphor-react-native"
import * as React from "react"
import { I18nManager, View } from "react-native"
import { FadeIn, FadeInDown, ReduceMotion } from "react-native-reanimated"
import { AnimatedView } from "@/components/ui/animated-view"
import { Button } from "@/components/ui/button"
import { Chip, ChipGroup } from "@/components/ui/chip"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Header,
  HeaderActions,
  HeaderLargeTitle,
  HeaderScrollView,
  HeaderTitle,
  useHeaderScroll,
} from "@/components/ui/header"
import { Icon } from "@/components/ui/icon"
import { Screen } from "@/components/ui/screen"
import { TabBar, TabBarItem, TabBarList } from "@/components/ui/tab-bar"
import { Text } from "@/components/ui/text"

const SECTIONS: { value: string; label: string; icon: PhosphorIcon }[] = [
  { value: "users", label: "Users", icon: UsersIcon },
  { value: "roles", label: "Roles", icon: ShieldIcon },
  { value: "log", label: "Activity", icon: ChartBarIcon },
  { value: "settings", label: "Settings", icon: GearIcon },
]

const KINDS = {
  Price: { icon: TagIcon, tint: "bg-orange-500" },
  Content: { icon: NotePencilIcon, tint: "bg-blue-500" },
  Security: { icon: ShieldIcon, tint: "bg-red-500" },
  Order: { icon: HandbagIcon, tint: "bg-green-500" },
  User: { icon: UserIcon, tint: "bg-purple-500" },
}

type Kind = keyof typeof KINDS

const FILTERS = ["All", ...Object.keys(KINDS)]

type Event = {
  day: string
  time: string
  actor: string
  action: string
  target: string
  kind: Kind
  diff?: [string, string]
}

const EVENTS: Event[] = [
  {
    day: "Today",
    time: "9:41 AM",
    actor: "Jamie Rivera",
    action: "updated",
    target: "Price: Phone Pro",
    kind: "Price",
    diff: ["$1,049", "$1,099"],
  },
  {
    day: "Today",
    time: "9:12 AM",
    actor: "Morgan Lee",
    action: "published",
    target: "Blog: October campaign",
    kind: "Content",
  },
  {
    day: "Today",
    time: "8:55 AM",
    actor: "System",
    action: "blocked",
    target: "5 failed sign-ins · 85.104.x.x",
    kind: "Security",
  },
  {
    day: "Yesterday",
    time: "6:20 PM",
    actor: "Riley Chen",
    action: "refunded",
    target: "Order W1044 · $999",
    kind: "Order",
  },
  {
    day: "Yesterday",
    time: "2:03 PM",
    actor: "Jamie Rivera",
    action: "changed a role",
    target: "Taylor Kim: Editor → Viewer",
    kind: "User",
    diff: ["Editor", "Viewer"],
  },
  {
    day: "Yesterday",
    time: "10:31 AM",
    actor: "Jordan Park",
    action: "created",
    target: "Product: MagCharge Wallet",
    kind: "Content",
  },
]

function AdminTabBar({
  value,
  onValueChange,
}: {
  value: string
  onValueChange: (value: string) => void
}) {
  return (
    <TabBar value={value} onValueChange={(next) => onValueChange(next)}>
      <TabBarList>
        {SECTIONS.map((section) => (
          <TabBarItem
            key={section.value}
            value={section.value}
            icon={section.icon}
          >
            {section.label}
          </TabBarItem>
        ))}
      </TabBarList>
    </TabBar>
  )
}

function OtherSection({ value, home }: { value: string; home: string }) {
  const label = SECTIONS.find((section) => section.value === value)?.label
  return (
    <View className="flex-1 gap-2 px-4 pt-[3.25rem]">
      <Text role="heading" className="text-3xl font-bold">
        {label}
      </Text>
      <Text className="text-lg text-muted-foreground">
        {`This section isn't part of the sample. Choose ${home}.`}
      </Text>
    </View>
  )
}

function EventBody({ event }: { event: Event }) {
  const kind = KINDS[event.kind]
  return (
    <>
      <View
        className={cn(
          "size-7 shrink-0 items-center justify-center rounded-[7px]",
          kind.tint
        )}
      >
        <Icon
          as={kind.icon}
          weight="bold"
          className="size-4 text-primary-foreground"
        />
      </View>
      <View className="min-w-0 flex-1">
        <Text numberOfLines={1} className="text-sm">
          <Text className="text-sm font-semibold">{event.actor}</Text>
          {` ${event.action}`}
        </Text>
        <Text numberOfLines={1} className="text-xs text-muted-foreground">
          {event.target}
        </Text>
      </View>
      <Text className="text-sm text-muted-foreground tabular-nums">
        {event.time}
      </Text>
    </>
  )
}

function EventRow({ event }: { event: Event }) {
  const [open, setOpen] = React.useState(false)

  if (!event.diff) {
    return (
      <View className="min-h-11 flex-row items-center gap-3 py-2 ps-4 pe-[2.375rem]">
        <EventBody event={event} />
      </View>
    )
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="min-h-11 flex-row items-center gap-3 px-4 py-2 active:opacity-80">
        <EventBody event={event} />
        <Icon
          as={CaretRightIcon}
          weight="bold"
          className={cn(
            "size-3 text-muted-foreground",
            open ? "rotate-90" : I18nManager.isRTL && "rotate-180"
          )}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <AnimatedView
          entering={FadeIn.duration(300).reduceMotion(ReduceMotion.System)}
          className="flex-row flex-wrap items-center gap-x-4 gap-y-1 ps-14 pe-4 pb-3"
        >
          <View className="flex-row items-center gap-2">
            <Text className="text-xs text-muted-foreground">Before</Text>
            <Text className="text-sm text-muted-foreground line-through">
              {event.diff[0]}
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-xs text-muted-foreground">After</Text>
            <Text className="text-sm font-semibold">{event.diff[1]}</Text>
          </View>
        </AnimatedView>
      </CollapsibleContent>
    </Collapsible>
  )
}

function LogActivity({
  onFilterChange,
  onExport,
  onNavigate,
}: {
  onFilterChange?: (filter: string) => void
  onExport?: (filter: string) => void
  onNavigate?: (section: string) => void
}) {
  const [section, setSection] = React.useState("log")
  const [filter, setFilter] = React.useState("All")
  const scroll = useHeaderScroll()
  const list = EVENTS.filter(
    (event) => filter === "All" || event.kind === filter
  )
  const days = [...new Set(list.map((event) => event.day))]

  return (
    <Screen edges={["top", "right", "left"]}>
      {section === "log" ? (
        <>
          <Header scroll={scroll}>
            <HeaderTitle>Activity log</HeaderTitle>
            <HeaderActions>
              <Button
                variant="secondary"
                size="sm"
                onPress={() => onExport?.(filter)}
              >
                <Text>Export</Text>
              </Button>
            </HeaderActions>
          </Header>
          <HeaderScrollView scroll={scroll}>
            <HeaderLargeTitle>Activity log</HeaderLargeTitle>
            <ChipGroup
              scrollable
              value={[filter]}
              onValueChange={(value) => {
                if (!value[0]) return
                setFilter(value[0])
                onFilterChange?.(value[0])
              }}
              accessibilityLabel="Type"
              className="px-4 pt-1 pb-2"
            >
              {FILTERS.map((item) => (
                <Chip key={item} value={item}>
                  {item}
                </Chip>
              ))}
            </ChipGroup>
            <AnimatedView
              key={filter}
              entering={FadeInDown.duration(700).reduceMotion(
                ReduceMotion.System
              )}
              className="gap-5 px-4 pt-3 pb-8"
            >
              {days.map((day) => (
                <View key={day} className="gap-2">
                  <Text role="heading" className="px-1 text-sm font-semibold">
                    {day}
                  </Text>
                  <View className="overflow-hidden rounded-2xl bg-muted">
                    {list
                      .filter((event) => event.day === day)
                      .map((event, index) => (
                        <View key={`${event.time}-${event.actor}`}>
                          {index > 0 ? (
                            <View className="ms-14 h-px bg-border" />
                          ) : null}
                          <EventRow event={event} />
                        </View>
                      ))}
                  </View>
                </View>
              ))}
            </AnimatedView>
          </HeaderScrollView>
        </>
      ) : (
        <OtherSection value={section} home="Activity" />
      )}
      <AdminTabBar
        value={section}
        onValueChange={(value) => {
          setSection(value)
          onNavigate?.(value)
        }}
      />
    </Screen>
  )
}

export { LogActivity }
