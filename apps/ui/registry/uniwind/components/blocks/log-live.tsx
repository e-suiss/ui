import { cn } from "cn"
import {
  ChartBarIcon,
  ChatCircleIcon,
  CloudIcon,
  GearIcon,
  HandbagIcon,
  PauseIcon,
  type Icon as PhosphorIcon,
  PlayIcon,
  ShieldIcon,
  TagIcon,
  UsersIcon,
  WarningIcon,
} from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import {
  cancelAnimation,
  Easing,
  FadeInUp,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated"
import { AnimatedView } from "@/components/ui/animated-view"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
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

type FeedEvent = {
  actor: string
  action: string
  detail: string
  tint?: string
  icon?: PhosphorIcon
  warning?: boolean
}

const FEED: FeedEvent[] = [
  {
    actor: "Jamie Rivera",
    action: "signed in",
    detail: "Book Pro · San Francisco",
    tint: "bg-indigo dark:bg-indigo",
  },
  {
    actor: "System",
    action: "finished a backup",
    detail: "12.4 GB · 3 min",
    icon: CloudIcon,
  },
  {
    actor: "Morgan Lee",
    action: "updated a product",
    detail: "Phone Air · 240 in stock",
    tint: "bg-orange dark:bg-orange",
    icon: TagIcon,
  },
  {
    actor: "Riley Chen",
    action: "answered a ticket",
    detail: "#4821 Screen flickers",
    tint: "bg-green dark:bg-green",
    icon: ChatCircleIcon,
  },
  {
    actor: "System",
    action: "raised a warning",
    detail: "API latency 820 ms",
    icon: WarningIcon,
    warning: true,
  },
  {
    actor: "Jordan Park",
    action: "approved an order",
    detail: "W1052 · $399",
    tint: "bg-mint dark:bg-mint",
    icon: HandbagIcon,
  },
]

type Entry = { id: number; time: string; event: FeedEvent }

const clock = (date: Date) => {
  const hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, "0")
  return `${hours % 12 || 12}:${minutes} ${hours < 12 ? "AM" : "PM"}`
}

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")

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
    <View className="flex-1 gap-2 px-4 pt-13">
      <Text role="heading" className="text-3xl font-bold">
        {label}
      </Text>
      <Text className="text-lg text-label-secondary">
        {`This section isn't part of the sample. Choose ${home}.`}
      </Text>
    </View>
  )
}

function LiveDot() {
  const opacity = useSharedValue(1)

  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.4, {
        duration: 1000,
        easing: Easing.bezier(0.4, 0, 0.6, 1),
      }),
      -1,
      true,
      undefined,
      ReduceMotion.System
    )
    return () => cancelAnimation(opacity)
  }, [opacity])

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  return (
    <AnimatedView
      className="size-1.75 rounded-full bg-green"
      style={animatedStyle}
    />
  )
}

function EntryRow({ entry, first }: { entry: Entry; first: boolean }) {
  const { event } = entry
  return (
    <AnimatedView
      entering={FadeInUp.duration(700)
        .easing(Easing.bezier(0.32, 0.72, 0, 1))
        .reduceMotion(ReduceMotion.System)}
    >
      {first ? null : <View className="ms-14 h-px bg-separator" />}
      <View className="min-h-11 flex-row items-center gap-3 px-4 py-2">
        {event.tint ? (
          <Avatar size="sm" className="size-7">
            <AvatarFallback className={event.tint}>
              {initials(event.actor)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <View
            className={cn(
              "size-7 shrink-0 items-center justify-center rounded-[7px]",
              event.warning ? "bg-orange" : "bg-gray"
            )}
          >
            {event.icon ? (
              <Icon
                as={event.icon}
                weight="bold"
                className="size-4 text-on-accent"
              />
            ) : null}
          </View>
        )}
        <View className="min-w-0 flex-1">
          <Text numberOfLines={1} className="text-sm">
            <Text className="text-sm font-semibold">{event.actor}</Text>
            {` ${event.action}`}
          </Text>
          <Text numberOfLines={1} className="text-xs text-label-secondary">
            {event.detail}
          </Text>
        </View>
        <Text className="text-sm text-label-secondary tabular-nums">
          {entry.time}
        </Text>
      </View>
    </AnimatedView>
  )
}

function LogLive({
  onRunningChange,
  onNavigate,
}: {
  onRunningChange?: (running: boolean) => void
  onNavigate?: (section: string) => void
}) {
  const [section, setSection] = React.useState("log")
  const [entries, setEntries] = React.useState<Entry[]>([])
  const [running, setRunning] = React.useState(true)
  const [count, setCount] = React.useState(0)
  const next = React.useRef(0)
  const scroll = useHeaderScroll()

  React.useEffect(() => {
    if (!running) return
    const push = () => {
      const id = next.current++
      const event = FEED[id % FEED.length]
      if (!event) return
      setCount((current) => current + 1)
      setEntries((current) =>
        [{ id, time: clock(new Date()), event }, ...current].slice(0, 7)
      )
    }
    if (next.current === 0) push()
    const timer = setInterval(push, 2200)
    return () => clearInterval(timer)
  }, [running])

  const toggle = () => {
    onRunningChange?.(!running)
    setRunning(!running)
  }

  const stats = [
    {
      label: "This session",
      value: `${count} ${count === 1 ? "event" : "events"}`,
    },
    { label: "Active users", value: "14" },
    { label: "Avg. response", value: "182 ms" },
  ]

  return (
    <Screen edges={["top", "right", "left"]}>
      {section === "log" ? (
        <>
          <Header scroll={scroll}>
            <HeaderTitle>Live activity</HeaderTitle>
            <HeaderActions>
              <Button variant="secondary" size="sm" onPress={toggle}>
                <Icon
                  as={running ? PauseIcon : PlayIcon}
                  weight="fill"
                  className="size-3"
                />
                <Text>{running ? "Pause" : "Resume"}</Text>
              </Button>
            </HeaderActions>
          </Header>
          <HeaderScrollView scroll={scroll}>
            <HeaderLargeTitle
              subtitle={running ? "Events appear as they happen" : "Paused"}
            >
              Live activity
            </HeaderLargeTitle>
            <View className="gap-5 px-4 pt-3 pb-8">
              <View className="flex-row overflow-hidden rounded-xl bg-surface-secondary">
                {stats.map((stat, index) => (
                  <View
                    key={stat.label}
                    accessible
                    className={cn(
                      "flex-1 px-3 py-3",
                      index > 0 && "border-s border-separator"
                    )}
                  >
                    <Text
                      numberOfLines={1}
                      className="text-xs text-label-secondary"
                    >
                      {stat.label}
                    </Text>
                    <Text
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      className="text-xl font-semibold tabular-nums"
                    >
                      {stat.value}
                    </Text>
                  </View>
                ))}
              </View>
              <View className="-mb-2.5 flex-row items-center gap-2 px-1">
                <Text role="heading" className="flex-1 text-sm font-semibold">
                  Recent events
                </Text>
                {running ? (
                  <View className="flex-row items-center gap-1.5">
                    <LiveDot />
                    <Text className="text-xs text-label-secondary">Live</Text>
                  </View>
                ) : null}
              </View>
              <View
                accessibilityLiveRegion="polite"
                className="overflow-hidden rounded-2xl bg-surface-secondary"
              >
                {entries.map((entry, index) => (
                  <EntryRow key={entry.id} entry={entry} first={index === 0} />
                ))}
              </View>
            </View>
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

export { LogLive }
