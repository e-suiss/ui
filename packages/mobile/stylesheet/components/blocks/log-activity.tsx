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
import { I18nManager, Pressable, StyleSheet, View } from "react-native"
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

const KINDS = {
  Price: { icon: TagIcon, tint: "orange500" },
  Content: { icon: NotePencilIcon, tint: "blue500" },
  Security: { icon: ShieldIcon, tint: "red500" },
  Order: { icon: HandbagIcon, tint: "green500" },
  User: { icon: UserIcon, tint: "purple500" },
} satisfies Record<string, { icon: PhosphorIcon; tint: Tint }>

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

const styles = StyleSheet.create({
  other: { flex: 1, gap: 8, paddingHorizontal: 16, paddingTop: 52 },
  otherTitle: { ...fontSize["3xl"], fontWeight: "700" },
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
  row: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
    paddingStart: 16,
    paddingEnd: 38,
  },
  trigger: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  diff: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: 16,
    rowGap: 4,
    paddingStart: 56,
    paddingEnd: 16,
    paddingBottom: 12,
  },
  diffItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  chips: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 8 },
  body: { gap: 20, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32 },
  day: { gap: 8 },
  dayTitle: { ...fontSize.sm, paddingHorizontal: 4, fontWeight: "600" },
  group: { overflow: "hidden", borderRadius: radius["2xl"] },
  separator: { marginStart: 56, height: 1 },
})

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

function caretStyle(open: boolean) {
  if (open) return { transform: [{ rotate: "90deg" }] }
  if (I18nManager.isRTL) return { transform: [{ rotate: "180deg" }] }
  return
}

function EventBody({ event }: { event: Event }) {
  const { colors } = useTheme()
  const kind = KINDS[event.kind]
  return (
    <>
      <View style={[styles.tile, { backgroundColor: tone(colors, kind.tint) }]}>
        <Icon
          as={kind.icon}
          weight="bold"
          size={16}
          color={colors.primaryForeground}
        />
      </View>
      <View style={styles.text}>
        <Text numberOfLines={1} style={fontSize.sm}>
          <Text style={styles.strong}>{event.actor}</Text>
          {` ${event.action}`}
        </Text>
        <Text
          numberOfLines={1}
          style={[fontSize.xs, { color: colors.mutedForeground }]}
        >
          {event.target}
        </Text>
      </View>
      <Text style={[styles.time, { color: colors.mutedForeground }]}>
        {event.time}
      </Text>
    </>
  )
}

function EventRow({ event }: { event: Event }) {
  const { colors } = useTheme()
  const [open, setOpen] = React.useState(false)

  if (!event.diff) {
    return (
      <View style={styles.row}>
        <EventBody event={event} />
      </View>
    )
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        style={styles.trigger}
        render={(renderProps) => {
          const { style: baseStyle, ...rest } = renderProps
          return (
            <Pressable
              {...rest}
              style={({ pressed }) => [baseStyle, pressed && { opacity: 0.8 }]}
            />
          )
        }}
      >
        <EventBody event={event} />
        <Icon
          as={CaretRightIcon}
          weight="bold"
          size={12}
          color={colors.mutedForeground}
          style={caretStyle(open)}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <AnimatedView
          entering={FadeIn.duration(300).reduceMotion(ReduceMotion.System)}
          style={styles.diff}
        >
          <View style={styles.diffItem}>
            <Text style={[fontSize.xs, { color: colors.mutedForeground }]}>
              Before
            </Text>
            <Text
              style={[
                fontSize.sm,
                {
                  color: colors.mutedForeground,
                  textDecorationLine: "line-through",
                },
              ]}
            >
              {event.diff[0]}
            </Text>
          </View>
          <View style={styles.diffItem}>
            <Text style={[fontSize.xs, { color: colors.mutedForeground }]}>
              After
            </Text>
            <Text style={styles.strong}>{event.diff[1]}</Text>
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
  const { colors } = useTheme()
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
              style={styles.chips}
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
              style={styles.body}
            >
              {days.map((day) => (
                <View key={day} style={styles.day}>
                  <Text role="heading" style={styles.dayTitle}>
                    {day}
                  </Text>
                  <View
                    style={[styles.group, { backgroundColor: colors.muted }]}
                  >
                    {list
                      .filter((event) => event.day === day)
                      .map((event, index) => (
                        <View key={`${event.time}-${event.actor}`}>
                          {index > 0 ? (
                            <View
                              style={[
                                styles.separator,
                                { backgroundColor: colors.border },
                              ]}
                            />
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
