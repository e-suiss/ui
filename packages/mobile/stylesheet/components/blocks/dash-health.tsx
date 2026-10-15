import {
  CaretRightIcon,
  ChartBarIcon,
  FlameIcon,
  HeartIcon,
  MinusIcon,
  MoonIcon,
  type Icon as PhosphorIcon,
  PlusIcon,
  UsersIcon,
} from "phosphor-react-native"
import * as React from "react"
import { I18nManager, Pressable, StyleSheet, View } from "react-native"
import { FadeInDown, ReduceMotion } from "react-native-reanimated"
import Svg, { Polyline } from "react-native-svg"
import { AnimatedView } from "@/components/ui/animated-view"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Header,
  HeaderBack,
  HeaderLargeTitle,
  HeaderScrollView,
  HeaderTitle,
  useHeaderScroll,
} from "@/components/ui/header"
import { Icon } from "@/components/ui/icon"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { Screen } from "@/components/ui/screen"
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

type Tint = Tone

type Category = "Activity" | "Heart" | "Sleep" | "Mobility"

type Section = "Summary" | "Sharing" | Category

type CategoryStyle = {
  value: Category
  icon: PhosphorIcon
  tint: Tint
  text: Tint
}

const CATEGORIES: [CategoryStyle, ...CategoryStyle[]] = [
  {
    value: "Activity",
    icon: FlameIcon,
    tint: "orange500",
    text: "orange500",
  },
  { value: "Heart", icon: HeartIcon, tint: "red500", text: "red500" },
  { value: "Sleep", icon: MoonIcon, tint: "cyan500", text: "cyan500" },
  {
    value: "Mobility",
    icon: ChartBarIcon,
    tint: "green500",
    text: "green500",
  },
]

const SECTIONS: { value: Section; icon: PhosphorIcon; tint: Tint }[] = [
  { value: "Summary", icon: HeartIcon, tint: "pink500" },
  { value: "Sharing", icon: UsersIcon, tint: "blue500" },
]

type Metric = {
  category: Category
  label: string
  value: string
  unit?: string
  bar: Tint
  line: Tint
  data: number[]
  bars?: boolean
}

const METRICS: Metric[] = [
  {
    category: "Activity",
    label: "Move",
    value: "486",
    unit: "kcal",
    bar: "red500",
    line: "red500",
    data: [40, 62, 38, 70, 55, 81, 65],
    bars: true,
  },
  {
    category: "Activity",
    label: "Steps",
    value: "8,412",
    unit: "steps",
    bar: "orange500",
    line: "orange500",
    data: [60, 80, 45, 90, 70, 95, 52],
    bars: true,
  },
  {
    category: "Heart",
    label: "Resting Heart Rate",
    value: "58",
    unit: "bpm",
    bar: "red500",
    line: "red500",
    data: [61, 60, 59, 58, 60, 57, 58],
  },
  {
    category: "Sleep",
    label: "Sleep",
    value: "7 hr 12 min",
    bar: "cyan500",
    line: "cyan500",
    data: [68, 74, 59, 79, 64, 86, 72],
    bars: true,
  },
  {
    category: "Heart",
    label: "Cardio Fitness",
    value: "42.1",
    unit: "VO₂ max",
    bar: "red500",
    line: "red500",
    data: [40, 40, 41, 41, 42, 42, 42],
  },
  {
    category: "Mobility",
    label: "Walking Speed",
    value: "5.1",
    unit: "km/h",
    bar: "green500",
    line: "green500",
    data: [48, 50, 49, 51, 50, 52, 51],
  },
]

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]

const styles = StyleSheet.create({
  bars: {
    height: 36,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 4,
  },
  bar: { width: 8, borderRadius: 3 },
  tile: { width: 29, height: 29, borderRadius: 7 },
  card: { flexDirection: "row", alignItems: "center", gap: 12 },
  cardBody: {
    minWidth: 0,
    flex: 1,
    gap: 10,
    borderRadius: radius.xl,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 6 },
  cardLabel: { ...fontSize.base, flex: 1, fontWeight: "600" },
  cardBottom: { flexDirection: "row", alignItems: "flex-end", gap: 16 },
  value: {
    ...fontSize["3xl"],
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  unit: { ...fontSize.base, fontWeight: "600" },
  section: { gap: 10, paddingHorizontal: 16 },
  sectionTop: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionTitle: { ...fontSize.xl, flex: 1, fontWeight: "700" },
  cards: { gap: 10 },
  empty: { ...fontSize.base, paddingVertical: 30, textAlign: "center" },
  row: { minHeight: 44, gap: 14, paddingVertical: 8 },
  largeTitle: { flexDirection: "row", alignItems: "center", gap: 10 },
  largeTitleText: { ...fontSize["3xl"], flex: 1, fontWeight: "700" },
  home: { gap: 8, paddingHorizontal: 16 },
  categories: {
    ...fontSize.xl,
    marginTop: 16,
    paddingHorizontal: 4,
    fontWeight: "700",
  },
})

function Spark({ metric }: { metric: Metric }) {
  const { colors } = useTheme()
  const max = Math.max(...metric.data)
  const min = Math.min(...metric.data)

  if (metric.bars) {
    return (
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        style={styles.bars}
      >
        {metric.data.map((value, index) => (
          <View
            key={DAYS[index]}
            style={[
              styles.bar,
              {
                height: `${(value / max) * 100}%`,
                backgroundColor: tone(colors, metric.bar),
              },
              index < metric.data.length - 1 && { opacity: 0.45 },
            ]}
          />
        ))}
      </View>
    )
  }

  const points = metric.data
    .map(
      (value, index) =>
        `${((index / (metric.data.length - 1)) * 120).toFixed(1)},${(36 - ((value - min) / Math.max(1, max - min)) * 30 - 3).toFixed(1)}`
    )
    .join(" ")

  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <Svg width={120} height={36} viewBox="0 0 120 36">
        <Polyline
          points={points}
          fill="none"
          stroke={tone(colors, metric.line)}
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  )
}

function Tile({ icon, tint }: { icon: PhosphorIcon; tint: Tint }) {
  const { colors } = useTheme()
  return (
    <ItemMedia style={[styles.tile, { backgroundColor: tone(colors, tint) }]}>
      <Icon
        as={icon}
        weight="fill"
        size={16}
        color={colors.primaryForeground}
      />
    </ItemMedia>
  )
}

function Chevron({ size = 14 }: { size?: number }) {
  const { colors } = useTheme()
  return (
    <Icon
      as={CaretRightIcon}
      weight="bold"
      size={size}
      color={colors.mutedForeground}
      style={
        I18nManager.isRTL ? { transform: [{ rotate: "180deg" }] } : undefined
      }
    />
  )
}

function MetricCard({
  metric,
  index,
  editing,
  pinned,
  onTogglePin,
  onPress,
}: {
  metric: Metric
  index: number
  editing: boolean
  pinned: boolean
  onTogglePin: () => void
  onPress: () => void
}) {
  const { colors, isDark } = useTheme()
  const category =
    CATEGORIES.find((item) => item.value === metric.category) ?? CATEGORIES[0]
  return (
    <AnimatedView
      entering={FadeInDown.delay(index * 40)
        .duration(800)
        .reduceMotion(ReduceMotion.System)}
      style={styles.card}
    >
      {editing ? (
        <Button
          size="icon-xs"
          accessibilityLabel={`${pinned ? "Unpin" : "Pin"} ${metric.label}`}
          hitSlop={10}
          onPress={onTogglePin}
          style={{
            backgroundColor: pinned ? colors.destructive : palette.green500,
          }}
        >
          <Icon
            as={pinned ? MinusIcon : PlusIcon}
            weight="bold"
            size={14}
            color={colors.primaryForeground}
          />
        </Button>
      ) : null}
      <Pressable
        role="button"
        onPress={onPress}
        style={({ pressed }) => [
          styles.cardBody,
          {
            backgroundColor: isDark ? colors.muted : colors.background,
          },
          editing && !pinned && { opacity: 0.55 },
          pressed && { opacity: 0.8 },
        ]}
      >
        <View style={styles.cardTop}>
          <Icon
            as={category.icon}
            weight="fill"
            size={16}
            color={tone(colors, category.text)}
          />
          <Text
            numberOfLines={1}
            style={[styles.cardLabel, { color: tone(colors, category.text) }]}
          >
            {metric.label}
          </Text>
          <Text style={[fontSize.sm, { color: colors.mutedForeground }]}>
            9:41
          </Text>
          <Chevron size={12} />
        </View>
        <View style={styles.cardBottom}>
          <Text style={{ flex: 1 }}>
            <Text style={styles.value}>{metric.value}</Text>
            {metric.unit ? (
              <Text style={[styles.unit, { color: colors.mutedForeground }]}>
                {` ${metric.unit}`}
              </Text>
            ) : null}
          </Text>
          <Spark metric={metric} />
        </View>
      </Pressable>
    </AnimatedView>
  )
}

function SectionView({
  section,
  onMetricPress,
  onPinnedChange,
}: {
  section: Section
  onMetricPress?: (label: string) => void
  onPinnedChange?: (pinned: string[]) => void
}) {
  const { colors } = useTheme()
  const [editing, setEditing] = React.useState(false)
  const [pinned, setPinned] = React.useState<string[]>([
    "Move",
    "Steps",
    "Resting Heart Rate",
    "Sleep",
  ])
  const summary = section === "Summary"
  const cards = METRICS.filter((metric) =>
    summary
      ? editing || pinned.includes(metric.label)
      : metric.category === section
  )

  const togglePin = (label: string) => {
    const next = pinned.includes(label)
      ? pinned.filter((item) => item !== label)
      : [...pinned, label]
    setPinned(next)
    onPinnedChange?.(next)
  }

  return (
    <View style={styles.section}>
      <View style={styles.sectionTop}>
        <Text role="heading" style={styles.sectionTitle}>
          {summary ? "Pinned" : "Last 7 days"}
        </Text>
        {summary ? (
          <Button
            variant="plain"
            size="sm"
            accessibilityState={{ selected: editing }}
            onPress={() => setEditing(!editing)}
          >
            <Text style={[fontSize.base, editing && { fontWeight: "600" }]}>
              {editing ? "Done" : "Edit"}
            </Text>
          </Button>
        ) : null}
      </View>
      {cards.length > 0 ? (
        <View style={styles.cards}>
          {cards.map((metric, index) => (
            <MetricCard
              key={metric.label}
              metric={metric}
              index={index}
              editing={editing}
              pinned={pinned.includes(metric.label)}
              onTogglePin={() => togglePin(metric.label)}
              onPress={() => onMetricPress?.(metric.label)}
            />
          ))}
        </View>
      ) : (
        <Text style={[styles.empty, { color: colors.mutedForeground }]}>
          No pinned items. Use Edit to add some.
        </Text>
      )}
    </View>
  )
}

function ProfileAvatar() {
  return (
    <Avatar style={{ width: 34, height: 34 }}>
      <AvatarFallback style={{ backgroundColor: palette.indigo500 }}>
        JR
      </AvatarFallback>
    </Avatar>
  )
}

function SectionRow({
  label,
  icon,
  tint,
  onPress,
}: {
  label: string
  icon: PhosphorIcon
  tint: Tint
  onPress: () => void
}) {
  return (
    <Item size="sm" onPress={onPress} style={styles.row}>
      <Tile icon={icon} tint={tint} />
      <ItemContent>
        <ItemTitle style={{ fontWeight: "400" }}>{label}</ItemTitle>
      </ItemContent>
      <ItemActions>
        <Chevron />
      </ItemActions>
    </Item>
  )
}

function DashHealth({
  onMetricPress,
  onPinnedChange,
}: {
  onMetricPress?: (label: string) => void
  onPinnedChange?: (pinned: string[]) => void
}) {
  const { colors, isDark } = useTheme()
  const [section, setSection] = React.useState<Section | null>("Summary")
  const scroll = useHeaderScroll()

  const group = {
    backgroundColor: isDark ? colors.muted : colors.background,
  }

  return (
    <Screen
      variant="secondary"
      edges={["top", "right", "left"]}
      style={isDark ? { backgroundColor: colors.background } : undefined}
    >
      <Header scroll={scroll}>
        {section ? (
          <HeaderBack onPress={() => setSection(null)}>Health</HeaderBack>
        ) : null}
        <HeaderTitle>{section ?? "Health"}</HeaderTitle>
      </Header>
      <HeaderScrollView key={section ?? "health"} scroll={scroll}>
        <HeaderLargeTitle style={styles.largeTitle}>
          <Text role="heading" style={styles.largeTitleText}>
            {section ?? "Health"}
          </Text>
          <ProfileAvatar />
        </HeaderLargeTitle>
        {section ? (
          <SectionView
            section={section}
            onMetricPress={onMetricPress}
            onPinnedChange={onPinnedChange}
          />
        ) : (
          <View style={styles.home}>
            <ItemGroup variant="inset" style={group}>
              {SECTIONS.map((item, index) => (
                <React.Fragment key={item.value}>
                  {index > 0 ? (
                    <ItemSeparator style={{ marginStart: 57 }} />
                  ) : null}
                  <SectionRow
                    label={item.value}
                    icon={item.icon}
                    tint={item.tint}
                    onPress={() => setSection(item.value)}
                  />
                </React.Fragment>
              ))}
            </ItemGroup>
            <Text
              role="heading"
              style={[styles.categories, { color: colors.foreground }]}
            >
              Categories
            </Text>
            <ItemGroup variant="inset" style={group}>
              {CATEGORIES.map((item, index) => (
                <React.Fragment key={item.value}>
                  {index > 0 ? (
                    <ItemSeparator style={{ marginStart: 57 }} />
                  ) : null}
                  <SectionRow
                    label={item.value}
                    icon={item.icon}
                    tint={item.tint}
                    onPress={() => setSection(item.value)}
                  />
                </React.Fragment>
              ))}
            </ItemGroup>
          </View>
        )}
        <View style={{ height: 32 }} />
      </HeaderScrollView>
    </Screen>
  )
}

export { DashHealth }
