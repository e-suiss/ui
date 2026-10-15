import { cn } from "cn"
import {
  CaretRightIcon,
  ChartBarIcon,
  FlameIcon,
  HeartIcon,
  MinusIcon,
  MoonIcon,
  type Icon as PhosphorIcon,
  type IconProps as PhosphorIconProps,
  PlusIcon,
  UsersIcon,
} from "phosphor-react-native"
import * as React from "react"
import { I18nManager, Pressable, View } from "react-native"
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

type Category = "Activity" | "Heart" | "Sleep" | "Mobility"

type Section = "Summary" | "Sharing" | Category

type CategoryStyle = {
  value: Category
  icon: PhosphorIcon
  tint: string
  text: string
}

const CATEGORIES: [CategoryStyle, ...CategoryStyle[]] = [
  {
    value: "Activity",
    icon: FlameIcon,
    tint: "bg-orange-500",
    text: "text-orange-500",
  },
  { value: "Heart", icon: HeartIcon, tint: "bg-red-500", text: "text-red-500" },
  {
    value: "Sleep",
    icon: MoonIcon,
    tint: "bg-cyan-500",
    text: "text-cyan-500",
  },
  {
    value: "Mobility",
    icon: ChartBarIcon,
    tint: "bg-green-500",
    text: "text-green-500",
  },
]

const SECTIONS: { value: Section; icon: PhosphorIcon; tint: string }[] = [
  { value: "Summary", icon: HeartIcon, tint: "bg-pink-500" },
  { value: "Sharing", icon: UsersIcon, tint: "bg-blue-500" },
]

type Metric = {
  category: Category
  label: string
  value: string
  unit?: string
  bar: string
  line: string
  data: number[]
  bars?: boolean
}

const METRICS: Metric[] = [
  {
    category: "Activity",
    label: "Move",
    value: "486",
    unit: "kcal",
    bar: "bg-red-500",
    line: "text-red-500",
    data: [40, 62, 38, 70, 55, 81, 65],
    bars: true,
  },
  {
    category: "Activity",
    label: "Steps",
    value: "8,412",
    unit: "steps",
    bar: "bg-orange-500",
    line: "text-orange-500",
    data: [60, 80, 45, 90, 70, 95, 52],
    bars: true,
  },
  {
    category: "Heart",
    label: "Resting Heart Rate",
    value: "58",
    unit: "bpm",
    bar: "bg-red-500",
    line: "text-red-500",
    data: [61, 60, 59, 58, 60, 57, 58],
  },
  {
    category: "Sleep",
    label: "Sleep",
    value: "7 hr 12 min",
    bar: "bg-cyan-500",
    line: "text-cyan-500",
    data: [68, 74, 59, 79, 64, 86, 72],
    bars: true,
  },
  {
    category: "Heart",
    label: "Cardio Fitness",
    value: "42.1",
    unit: "VO₂ max",
    bar: "bg-red-500",
    line: "text-red-500",
    data: [40, 40, 41, 41, 42, 42, 42],
  },
  {
    category: "Mobility",
    label: "Walking Speed",
    value: "5.1",
    unit: "km/h",
    bar: "bg-green-500",
    line: "text-green-500",
    data: [48, 50, 49, 51, 50, 52, 51],
  },
]

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]

const SparkContext = React.createContext("")

function SparkLine({ color }: PhosphorIconProps) {
  const points = React.useContext(SparkContext)
  return (
    <Svg width={120} height={36} viewBox="0 0 120 36">
      <Polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

function Spark({ metric }: { metric: Metric }) {
  const max = Math.max(...metric.data)
  const min = Math.min(...metric.data)

  if (metric.bars) {
    return (
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        className="h-9 flex-row items-end gap-1"
      >
        {metric.data.map((value, index) => (
          <View
            key={DAYS[index]}
            style={{ height: `${(value / max) * 100}%` }}
            className={cn(
              "w-2 rounded-[3px]",
              metric.bar,
              index < metric.data.length - 1 && "opacity-45"
            )}
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
      <SparkContext.Provider value={points}>
        <Icon as={SparkLine} className={cn("size-9", metric.line)} />
      </SparkContext.Provider>
    </View>
  )
}

function Tile({ icon, tint }: { icon: PhosphorIcon; tint: string }) {
  return (
    <ItemMedia className={cn("size-7.25 rounded-[7px]", tint)}>
      <Icon
        as={icon}
        weight="fill"
        className="size-4 text-primary-foreground"
      />
    </ItemMedia>
  )
}

function Chevron({ className }: { className?: string }) {
  return (
    <Icon
      as={CaretRightIcon}
      weight="bold"
      className={cn(
        "size-3.5 text-muted-foreground",
        I18nManager.isRTL && "rotate-180",
        className
      )}
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
  const category =
    CATEGORIES.find((item) => item.value === metric.category) ?? CATEGORIES[0]
  return (
    <AnimatedView
      entering={FadeInDown.delay(index * 40)
        .duration(800)
        .reduceMotion(ReduceMotion.System)}
      className="flex-row items-center gap-3"
    >
      {editing ? (
        <Button
          size="icon-xs"
          accessibilityLabel={`${pinned ? "Unpin" : "Pin"} ${metric.label}`}
          hitSlop={10}
          onPress={onTogglePin}
          className={pinned ? "bg-destructive" : "bg-green-500"}
        >
          <Icon
            as={pinned ? MinusIcon : PlusIcon}
            weight="bold"
            className="size-3.5 text-primary-foreground"
          />
        </Button>
      ) : null}
      <Pressable
        role="button"
        onPress={onPress}
        className={cn(
          "min-w-0 flex-1 gap-2.5 rounded-xl bg-background px-4 py-3 active:opacity-80 dark:bg-muted",
          editing && !pinned && "opacity-55"
        )}
      >
        <View className="flex-row items-center gap-1.5">
          <Icon
            as={category.icon}
            weight="fill"
            className={cn("size-4", category.text)}
          />
          <Text
            numberOfLines={1}
            className={cn("flex-1 text-base font-semibold", category.text)}
          >
            {metric.label}
          </Text>
          <Text className="text-sm text-muted-foreground">9:41</Text>
          <Chevron className="size-3" />
        </View>
        <View className="flex-row items-end gap-4">
          <Text className="flex-1">
            <Text className="text-3xl font-bold tabular-nums">
              {metric.value}
            </Text>
            {metric.unit ? (
              <Text className="text-base font-semibold text-muted-foreground">
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
    <View className="gap-2.5 px-4">
      <View className="mt-2.5 flex-row items-center gap-2">
        <Text role="heading" className="flex-1 text-xl font-bold">
          {summary ? "Pinned" : "Last 7 days"}
        </Text>
        {summary ? (
          <Button
            variant="plain"
            size="sm"
            accessibilityState={{ selected: editing }}
            onPress={() => setEditing(!editing)}
          >
            <Text className={cn("text-base", editing && "font-semibold")}>
              {editing ? "Done" : "Edit"}
            </Text>
          </Button>
        ) : null}
      </View>
      {cards.length > 0 ? (
        <View className="gap-2.5">
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
        <Text className="py-7.5 text-center text-base text-muted-foreground">
          No pinned items. Use Edit to add some.
        </Text>
      )}
    </View>
  )
}

function ProfileAvatar() {
  return (
    <Avatar className="size-8.5">
      <AvatarFallback className="bg-indigo-500">JR</AvatarFallback>
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
  tint: string
  onPress: () => void
}) {
  return (
    <Item size="sm" onPress={onPress} className="min-h-11 gap-3.5 py-2">
      <Tile icon={icon} tint={tint} />
      <ItemContent>
        <ItemTitle className="font-normal">{label}</ItemTitle>
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
  const [section, setSection] = React.useState<Section | null>("Summary")
  const scroll = useHeaderScroll()

  return (
    <Screen
      variant="secondary"
      edges={["top", "right", "left"]}
      className="dark:bg-background"
    >
      <Header scroll={scroll}>
        {section ? (
          <HeaderBack onPress={() => setSection(null)}>Health</HeaderBack>
        ) : null}
        <HeaderTitle>{section ?? "Health"}</HeaderTitle>
      </Header>
      <HeaderScrollView key={section ?? "health"} scroll={scroll}>
        <HeaderLargeTitle className="flex-row items-center gap-2.5">
          <Text role="heading" className="flex-1 text-3xl font-bold">
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
          <View className="gap-2 px-4">
            <ItemGroup variant="inset" className="bg-background dark:bg-muted">
              {SECTIONS.map((item, index) => (
                <React.Fragment key={item.value}>
                  {index > 0 ? <ItemSeparator className="ms-14.25" /> : null}
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
              className="mt-4 px-1 text-xl font-bold text-foreground"
            >
              Categories
            </Text>
            <ItemGroup variant="inset" className="bg-background dark:bg-muted">
              {CATEGORIES.map((item, index) => (
                <React.Fragment key={item.value}>
                  {index > 0 ? <ItemSeparator className="ms-14.25" /> : null}
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
        <View className="h-8" />
      </HeaderScrollView>
    </Screen>
  )
}

export { DashHealth }
