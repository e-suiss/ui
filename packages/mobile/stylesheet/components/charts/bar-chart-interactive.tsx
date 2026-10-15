import * as React from "react"
import { StyleSheet, View } from "react-native"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ReferenceLine,
  XAxis,
  YAxis,
} from "@/components/ui/chart"
import { Text } from "@/components/ui/text"
import {
  fontSize,
  palette,
  type ThemeColors,
  useTheme,
} from "@/components/ui/theme"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type Tone = keyof ThemeColors | keyof typeof palette

function tone(colors: ThemeColors, key: Tone) {
  return { ...colors, ...palette }[key]
}

type Category = "social" | "productivity" | "entertainment"

type Period = "week" | "day"

const CATEGORIES: Category[] = ["social", "productivity", "entertainment"]

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
]

const USAGE: [social: number, productivity: number, entertainment: number][] = [
  [48, 95, 62],
  [55, 120, 40],
  [70, 88, 95],
  [42, 130, 35],
  [65, 100, 80],
  [110, 30, 140],
  [95, 25, 120],
]

const WEEK: Record<Category, number>[] = USAGE.map(
  ([social, productivity, entertainment]) => ({
    social,
    productivity,
    entertainment,
  })
)

const PROFILE = [
  1, 0, 0, 0, 0, 0, 1, 4, 6, 5, 4, 5, 7, 6, 5, 4, 5, 6, 7, 9, 10, 11, 8, 4,
]

const APPS: { name: string; category: Category; share: number }[] = [
  { name: "Chat", category: "social", share: 0.55 },
  { name: "Messages", category: "social", share: 0.45 },
  { name: "Browser", category: "productivity", share: 0.45 },
  { name: "Mail", category: "productivity", share: 0.3 },
  { name: "Docs", category: "productivity", share: 0.25 },
  { name: "Video", category: "entertainment", share: 0.6 },
  { name: "Music", category: "entertainment", share: 0.4 },
]

const chartConfig = {
  social: { label: "Social", color: "chart-1" },
  productivity: { label: "Productivity", color: "cyan-500" },
  entertainment: { label: "Entertainment", color: "chart-4" },
} satisfies ChartConfig

const SWATCH: Record<Category, Tone> = {
  social: "chart1",
  productivity: "cyan500",
  entertainment: "chart4",
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },
  heading: { minWidth: 208, flexGrow: 1, gap: 2 },
  eyebrow: { ...fontSize.sm, fontWeight: "600" },
  value: {
    ...fontSize["3xl"],
    fontWeight: "600",
    letterSpacing: -0.75,
    fontVariant: ["tabular-nums"],
  },
  caption: { ...fontSize.sm },
  period: { paddingHorizontal: 20 },
  content: { gap: 20 },
  chart: { height: 256 },
  row: { width: "100%", flexDirection: "row", alignItems: "center", gap: 8 },
  square: { width: 8, height: 8, flexShrink: 0, borderRadius: 2 },
  grow: { flexGrow: 1 },
  strong: { fontWeight: "600", fontVariant: ["tabular-nums"] },
  stats: { flexDirection: "row", gap: 12 },
  stat: { minWidth: 0, flex: 1, gap: 2 },
  statLabel: {
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dot: { width: 8, height: 8, flexShrink: 0, borderRadius: 9999 },
  shrink: { flexShrink: 1, ...fontSize.sm },
  statValue: {
    ...fontSize.base,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  section: {
    marginBottom: 4,
    ...fontSize.xs,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  app: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: 8,
  },
  appName: { width: 96, ...fontSize.base },
  track: {
    height: 6,
    flexGrow: 1,
    overflow: "hidden",
    borderRadius: 9999,
  },
  fill: { height: "100%", borderRadius: 9999 },
  time: {
    width: 72,
    textAlign: "right",
    ...fontSize.sm,
    fontVariant: ["tabular-nums"],
  },
})

const total = (day: Record<Category, number>) =>
  CATEGORIES.reduce((sum, category) => sum + day[category], 0)

const AVERAGE = WEEK.reduce((sum, day) => sum + total(day), 0) / WEEK.length

const DAILY_AVERAGE = Object.fromEntries(
  CATEGORIES.map((category) => [
    category,
    WEEK.reduce((sum, day) => sum + day[category], 0) / WEEK.length,
  ])
) as Record<Category, number>

function formatMinutes(minutes: number) {
  const rounded = Math.round(minutes)
  const hours = Math.floor(rounded / 60)
  return hours ? `${hours}h ${rounded % 60}m` : `${rounded}m`
}

function noise(seed: number) {
  const state = (seed * 16807) % 2147483647
  return (state - 1) / 2147483646
}

function hourly(day: number) {
  const profileTotal = PROFILE.reduce((sum, value) => sum + value, 0)
  const categories = WEEK[day]
  if (!categories) return []
  return PROFILE.map((weight, hour) => {
    const share =
      (weight / profileTotal) * (0.75 + noise(hour + 7 * (day + 1)) * 0.5)
    return {
      label: String(hour),
      index: hour,
      social: Math.round(categories.social * share),
      productivity: Math.round(
        categories.productivity * share * (hour > 8 && hour < 18 ? 1.6 : 0.4)
      ),
      entertainment: Math.round(
        categories.entertainment * share * (hour > 18 ? 1.8 : 0.5)
      ),
    }
  })
}

export function BarChartInteractive() {
  const { colors } = useTheme()
  const [view, setView] = React.useState<Period>("week")
  const [selected, setSelected] = React.useState<number | null>(null)

  const isWeek = view === "week"
  const selectedDay = selected === null ? undefined : WEEK[selected]
  const categories = selectedDay ?? DAILY_AVERAGE
  const headline = selectedDay ? total(selectedDay) : AVERAGE
  const data = isWeek
    ? WEEK.map((day, index) => ({
        ...day,
        label: DAYS[index]?.slice(0, 3) ?? "",
        index,
      }))
    : hourly(selected ?? 6)
  const apps = APPS.map((app) => ({
    ...app,
    minutes: categories[app.category] * app.share,
  }))
    .sort((a, b) => b.minutes - a.minutes)
    .slice(0, 5)
  const longest = Math.max(...apps.map((app) => app.minutes))
  const comparison =
    selected === null
      ? "8% less than last week"
      : `${Math.round(Math.abs(headline / AVERAGE - 1) * 100)}% ${headline > AVERAGE ? "above" : "below"} average`

  return (
    <Card variant="filled" size="sm">
      <CardHeader style={styles.header}>
        <View style={styles.heading} accessibilityLiveRegion="polite">
          <Text style={[styles.eyebrow, { color: colors.mutedForeground }]}>
            {selected === null ? "Daily average" : DAYS[selected]}
          </Text>
          <Text style={styles.value}>{formatMinutes(headline)}</Text>
          <Text style={[styles.caption, { color: colors.mutedForeground }]}>
            {comparison}
          </Text>
        </View>
        <ToggleGroup
          spacing={0}
          value={[view]}
          onValueChange={(value) => {
            const next = value[0] as Period | undefined
            if (!next) return
            setView(next)
            if (next === "day" && selected === null) setSelected(6)
          }}
          accessibilityLabel="Period"
        >
          <ToggleGroupItem value="week" size="sm" style={styles.period}>
            <Text>Week</Text>
          </ToggleGroupItem>
          <ToggleGroupItem value="day" size="sm" style={styles.period}>
            <Text>Day</Text>
          </ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent style={styles.content}>
        <ChartContainer
          config={chartConfig}
          accessibilityLabel="Screen time"
          style={styles.chart}
        >
          <BarChart
            key={view}
            data={data}
            margin={{ top: 10, right: 4, left: 12, bottom: 0 }}
            onActiveIndexChange={isWeek ? setSelected : undefined}
          >
            <CartesianGrid vertical={false} strokeDasharray="2 4" />
            <XAxis
              dataKey="label"
              tickMargin={8}
              interval={0}
              ticks={isWeek ? undefined : ["0", "6", "12", "18"]}
              tickFormatter={(value) => (isWeek ? `${value}` : `${value}:00`)}
            />
            <YAxis
              orientation="right"
              tickMargin={6}
              width="auto"
              ticks={isWeek ? [0, 120, 240, 360] : undefined}
              tickCount={isWeek ? undefined : 4}
              tickFormatter={(value) =>
                isWeek ? `${Number(value) / 60}h` : `${value}m`
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const label = String(payload[0]?.payload.label ?? "")
                    return isWeek
                      ? DAYS.find((day) => day.startsWith(label))
                      : `${label}:00 – ${Number(label) + 1}:00`
                  }}
                  formatter={(value, name) => (
                    <View style={styles.row}>
                      <View
                        style={[
                          styles.square,
                          {
                            backgroundColor: tone(
                              colors,
                              SWATCH[name as Category]
                            ),
                          },
                        ]}
                      />
                      <Text
                        style={[styles.grow, { color: colors.mutedForeground }]}
                      >
                        {chartConfig[name as Category].label}
                      </Text>
                      <Text style={styles.strong}>
                        {formatMinutes(Number(value))}
                      </Text>
                    </View>
                  )}
                />
              }
            />
            {isWeek ? (
              <ReferenceLine
                y={AVERAGE}
                stroke="green-500"
                strokeDasharray="3 3"
              />
            ) : null}
            {CATEGORIES.map((category, position) => (
              <Bar
                isAnimationActive={false}
                key={category}
                dataKey={category}
                stackId="a"
                fill={chartConfig[category].color}
                radius={position === CATEGORIES.length - 1 ? [5, 5, 0, 0] : 0}
                maxBarSize={isWeek ? 34 : 10}
              >
                {isWeek
                  ? data.map((item, index) => (
                      <Cell
                        key={item.label}
                        fillOpacity={
                          selected === null || selected === index ? 1 : 0.3
                        }
                      />
                    ))
                  : null}
              </Bar>
            ))}
          </BarChart>
        </ChartContainer>
        <View style={styles.stats}>
          {CATEGORIES.map((category) => (
            <View key={category} accessible style={styles.stat}>
              <View style={styles.statLabel}>
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: tone(colors, SWATCH[category]) },
                  ]}
                />
                <Text
                  numberOfLines={1}
                  style={[styles.shrink, { color: colors.mutedForeground }]}
                >
                  {chartConfig[category].label}
                </Text>
              </View>
              <Text style={styles.statValue}>
                {formatMinutes(categories[category])}
              </Text>
            </View>
          ))}
        </View>
        <View>
          <Text style={[styles.section, { color: colors.mutedForeground }]}>
            Most used
          </Text>
          {apps.map((app) => (
            <View
              key={app.name}
              accessible
              style={[styles.app, { borderTopColor: colors.border }]}
            >
              <Text numberOfLines={1} style={styles.appName}>
                {app.name}
              </Text>
              <View
                style={[styles.track, { backgroundColor: colors.secondary }]}
              >
                <View
                  style={[
                    styles.fill,
                    {
                      width: `${(app.minutes / longest) * 100}%`,
                      backgroundColor: tone(colors, SWATCH[app.category]),
                    },
                  ]}
                />
              </View>
              <Text style={[styles.time, { color: colors.mutedForeground }]}>
                {formatMinutes(app.minutes)}
              </Text>
            </View>
          ))}
        </View>
      </CardContent>
    </Card>
  )
}
