import { cn } from "cn"
import * as React from "react"
import { View } from "react-native"
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

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
  social: { label: "Social", color: "blue" },
  productivity: { label: "Productivity", color: "cyan" },
  entertainment: { label: "Entertainment", color: "orange" },
} satisfies ChartConfig

const SWATCH: Record<Category, string> = {
  social: "bg-blue",
  productivity: "bg-cyan",
  entertainment: "bg-orange",
}

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
      <CardHeader className="flex-row flex-wrap items-start justify-between gap-4">
        <View
          className="min-w-52 grow gap-0.5"
          accessibilityLiveRegion="polite"
        >
          <Text className="text-sm font-semibold text-label-secondary">
            {selected === null ? "Daily average" : DAYS[selected]}
          </Text>
          <Text className="text-3xl font-semibold tracking-tight tabular-nums">
            {formatMinutes(headline)}
          </Text>
          <Text className="text-sm text-label-secondary">{comparison}</Text>
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
          <ToggleGroupItem value="week" size="sm" className="px-5">
            <Text>Week</Text>
          </ToggleGroupItem>
          <ToggleGroupItem value="day" size="sm" className="px-5">
            <Text>Day</Text>
          </ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent className="gap-5">
        <ChartContainer
          config={chartConfig}
          accessibilityLabel="Screen time"
          className="h-64 w-full"
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
                    <View className="w-full flex-row items-center gap-2">
                      <View
                        className={cn(
                          "size-2 shrink-0 rounded-xs",
                          SWATCH[name as Category]
                        )}
                      />
                      <Text className="grow text-label-secondary">
                        {chartConfig[name as Category].label}
                      </Text>
                      <Text className="font-semibold tabular-nums">
                        {formatMinutes(Number(value))}
                      </Text>
                    </View>
                  )}
                />
              }
            />
            {isWeek ? (
              <ReferenceLine y={AVERAGE} stroke="green" strokeDasharray="3 3" />
            ) : null}
            {CATEGORIES.map((category, position) => (
              <Bar
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
        <View className="flex-row gap-3">
          {CATEGORIES.map((category) => (
            <View key={category} accessible className="min-w-0 flex-1 gap-0.5">
              <View className="min-w-0 flex-row items-center gap-1.5">
                <View
                  className={cn(
                    "size-2 shrink-0 rounded-full",
                    SWATCH[category]
                  )}
                />
                <Text
                  numberOfLines={1}
                  className="shrink text-sm text-label-secondary"
                >
                  {chartConfig[category].label}
                </Text>
              </View>
              <Text className="text-base font-semibold tabular-nums">
                {formatMinutes(categories[category])}
              </Text>
            </View>
          ))}
        </View>
        <View>
          <Text className="mb-1 text-xs font-semibold text-label-secondary uppercase">
            Most used
          </Text>
          {apps.map((app) => (
            <View
              key={app.name}
              accessible
              className="flex-row items-center gap-3 border-t border-separator py-2"
            >
              <Text numberOfLines={1} className="w-24 text-base">
                {app.name}
              </Text>
              <View className="h-1.5 grow overflow-hidden rounded-full bg-control">
                <View
                  style={{ width: `${(app.minutes / longest) * 100}%` }}
                  className={cn("h-full rounded-full", SWATCH[app.category])}
                />
              </View>
              <Text className="w-18 text-right text-sm text-label-secondary tabular-nums">
                {formatMinutes(app.minutes)}
              </Text>
            </View>
          ))}
        </View>
      </CardContent>
    </Card>
  )
}
