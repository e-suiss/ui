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
import { StyleSheet, View } from "react-native"
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
import {
  fontSize,
  palette,
  radius,
  type ThemeColors,
  useTheme,
} from "@/components/ui/theme"

type Tone = keyof ThemeColors | keyof typeof palette

function tone(colors: ThemeColors, key: Tone) {
  return { ...colors, ...palette }[key]
}

const SECTIONS: { value: string; label: string; icon: PhosphorIcon }[] = [
  { value: "users", label: "Users", icon: UsersIcon },
  { value: "roles", label: "Roles", icon: ShieldIcon },
  { value: "log", label: "Activity", icon: ChartBarIcon },
  { value: "settings", label: "Settings", icon: GearIcon },
]

type Tint = Tone

type FeedEvent = {
  actor: string
  action: string
  detail: string
  tint?: Tint
  icon?: PhosphorIcon
  warning?: boolean
}

const FEED: FeedEvent[] = [
  {
    actor: "Jamie Rivera",
    action: "signed in",
    detail: "Book Pro · San Francisco",
    tint: "indigo500",
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
    tint: "orange500",
    icon: TagIcon,
  },
  {
    actor: "Riley Chen",
    action: "answered a ticket",
    detail: "#4821 Screen flickers",
    tint: "green500",
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
    tint: "teal400",
    icon: HandbagIcon,
  },
]

type Entry = { id: number; time: string; event: FeedEvent }

const styles = StyleSheet.create({
  other: { flex: 1, gap: 8, paddingHorizontal: 16, paddingTop: 52 },
  otherTitle: { ...fontSize["3xl"], fontWeight: "700" },
  dot: { width: 7, height: 7, borderRadius: radius.full },
  separator: { marginStart: 56, height: 1 },
  row: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  avatar: { width: 28, height: 28 },
  tile: {
    width: 28,
    height: 28,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
  },
  text: { minWidth: 0, flex: 1 },
  strong: { ...fontSize.sm, fontWeight: "600" },
  time: { ...fontSize.sm, fontVariant: ["tabular-nums"] },
  body: { gap: 20, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32 },
  stats: {
    flexDirection: "row",
    overflow: "hidden",
    borderRadius: radius.xl,
  },
  stat: { flex: 1, paddingHorizontal: 12, paddingVertical: 12 },
  statDivider: { borderStartWidth: 1 },
  statValue: {
    ...fontSize.xl,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  heading: {
    marginBottom: -10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 4,
  },
  headingText: { ...fontSize.sm, flex: 1, fontWeight: "600" },
  live: { flexDirection: "row", alignItems: "center", gap: 6 },
  group: { overflow: "hidden", borderRadius: radius["2xl"] },
})

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
  const { colors } = useTheme()
  const label = SECTIONS.find((section) => section.value === value)?.label
  return (
    <View style={styles.other}>
      <Text role="heading" style={styles.otherTitle}>
        {label}
      </Text>
      <Text style={[fontSize.lg, { color: colors.mutedForeground }]}>
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
      style={[styles.dot, { backgroundColor: palette.green500 }, animatedStyle]}
    />
  )
}

function EntryRow({ entry, first }: { entry: Entry; first: boolean }) {
  const { colors } = useTheme()
  const { event } = entry
  return (
    <AnimatedView
      entering={FadeInUp.duration(700)
        .easing(Easing.bezier(0.32, 0.72, 0, 1))
        .reduceMotion(ReduceMotion.System)}
    >
      {first ? null : (
        <View style={[styles.separator, { backgroundColor: colors.border }]} />
      )}
      <View style={styles.row}>
        {event.tint ? (
          <Avatar size="sm" style={styles.avatar}>
            <AvatarFallback
              style={{ backgroundColor: tone(colors, event.tint) }}
            >
              {initials(event.actor)}
            </AvatarFallback>
          </Avatar>
        ) : (
          <View
            style={[
              styles.tile,
              {
                backgroundColor: event.warning
                  ? palette.orange500
                  : palette.zinc500,
              },
            ]}
          >
            {event.icon ? (
              <Icon
                as={event.icon}
                weight="bold"
                size={16}
                color={colors.primaryForeground}
              />
            ) : null}
          </View>
        )}
        <View style={styles.text}>
          <Text numberOfLines={1} style={fontSize.sm}>
            <Text style={styles.strong}>{event.actor}</Text>
            {` ${event.action}`}
          </Text>
          <Text
            numberOfLines={1}
            style={[fontSize.xs, { color: colors.mutedForeground }]}
          >
            {event.detail}
          </Text>
        </View>
        <Text style={[styles.time, { color: colors.mutedForeground }]}>
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
  const { colors } = useTheme()
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
                  size={12}
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
            <View style={styles.body}>
              <View style={[styles.stats, { backgroundColor: colors.muted }]}>
                {stats.map((stat, index) => (
                  <View
                    key={stat.label}
                    accessible
                    style={[
                      styles.stat,
                      index > 0 && [
                        styles.statDivider,
                        { borderColor: colors.border },
                      ],
                    ]}
                  >
                    <Text
                      numberOfLines={1}
                      style={[fontSize.xs, { color: colors.mutedForeground }]}
                    >
                      {stat.label}
                    </Text>
                    <Text
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      style={styles.statValue}
                    >
                      {stat.value}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={styles.heading}>
                <Text role="heading" style={styles.headingText}>
                  Recent events
                </Text>
                {running ? (
                  <View style={styles.live}>
                    <LiveDot />
                    <Text
                      style={[fontSize.xs, { color: colors.mutedForeground }]}
                    >
                      Live
                    </Text>
                  </View>
                ) : null}
              </View>
              <View
                accessibilityLiveRegion="polite"
                style={[styles.group, { backgroundColor: colors.muted }]}
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
