import * as React from "react"
import { StyleSheet, View } from "react-native"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Area,
  AreaChart,
  CartesianGrid,
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ReferenceLine,
  XAxis,
  YAxis,
} from "@/components/ui/chart"
import { Text } from "@/components/ui/text"
import { fontSize, palette, useTheme } from "@/components/ui/theme"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type Range = "1D" | "1W" | "1M" | "3M" | "1Y" | "5Y"

type Point = { index: number; price: number; label: string; tick: string }

const RANGES: Record<
  Range,
  {
    points: number
    seed: number
    volatility: number
    drift: number
    caption: string
  }
> = {
  "1D": {
    points: 78,
    seed: 11,
    volatility: 0.0025,
    drift: 0.46,
    caption: "Today",
  },
  "1W": {
    points: 35,
    seed: 23,
    volatility: 0.004,
    drift: 0.46,
    caption: "Past week",
  },
  "1M": {
    points: 22,
    seed: 37,
    volatility: 0.012,
    drift: 0.53,
    caption: "Past month",
  },
  "3M": {
    points: 64,
    seed: 41,
    volatility: 0.014,
    drift: 0.46,
    caption: "Past 3 months",
  },
  "1Y": {
    points: 52,
    seed: 59,
    volatility: 0.03,
    drift: 0.46,
    caption: "Past year",
  },
  "5Y": {
    points: 60,
    seed: 73,
    volatility: 0.045,
    drift: 0.46,
    caption: "Past 5 years",
  },
}

const LAST_PRICE = 254.32
const END = new Date(2026, 9, 6)
const SAMPLES = 80

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

function shortMonth(date: Date) {
  return (MONTHS[date.getMonth()] ?? "").slice(0, 3)
}

function shortDay(date: Date) {
  return `${shortMonth(date)} ${date.getDate()}`
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },
  heading: { minWidth: 224, flexGrow: 1, gap: 2 },
  ticker: { flexDirection: "row", alignItems: "baseline", gap: 8 },
  symbol: { ...fontSize["2xl"], fontWeight: "600", letterSpacing: -0.6 },
  company: { ...fontSize.base },
  quote: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "baseline",
    gap: 10,
  },
  price: {
    ...fontSize["3xl"],
    fontWeight: "600",
    letterSpacing: -0.75,
    fontVariant: ["tabular-nums"],
  },
  change: {
    ...fontSize.base,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  caption: { ...fontSize.sm, minHeight: 20 },
  content: { gap: 16 },
  chart: { height: 288 },
  stats: { flexDirection: "row", flexWrap: "wrap", columnGap: 24 },
  stat: {
    minWidth: 144,
    flexGrow: 1,
    flexBasis: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderBottomWidth: 1,
    paddingVertical: 7,
  },
  term: { ...fontSize.sm, flexGrow: 1 },
  amount: { ...fontSize.sm, fontWeight: "600", fontVariant: ["tabular-nums"] },
})

function formatPrice(value: number, signed = false) {
  const sign = signed && value >= 0 ? "+" : ""
  try {
    return `${sign}${new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)}`
  } catch {
    const [whole = "0", fraction = "00"] = value.toFixed(2).split(".")
    return `${sign}${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${fraction}`
  }
}

function businessDays(count: number) {
  const days: Date[] = []
  const day = new Date(END)
  while (days.length < count) {
    if (day.getDay() % 6) days.unshift(new Date(day))
    day.setDate(day.getDate() - 1)
  }
  return days
}

function generate(range: Range): Point[] {
  const { points, seed, volatility, drift } = RANGES[range]
  let state = seed
  let value = 100
  const values = Array.from({ length: points }, () => {
    state = (state * 16807) % 2147483647
    value *= 1 + ((state - 1) / 2147483646 - drift) * volatility
    return value
  })
  const last = values.at(-1)
  if (last === undefined) return []
  const scale = LAST_PRICE / last
  const days = businessDays(points)
  const week = businessDays(5)

  return values.map((raw, index) => {
    const price = Number((raw * scale).toFixed(2))
    if (range === "1D") {
      const minutes = 570 + index * 5
      const hour = Math.floor(minutes / 60)
      const minute = minutes % 60
      const time = `${hour}:${String(minute).padStart(2, "0")}`
      return {
        index,
        price,
        label: time,
        tick: minute === 0 ? `${hour}:00` : "",
      }
    }
    if (range === "1W") {
      const day = week[Math.floor(index / 7)] ?? END
      const weekday = WEEKDAYS[day.getDay()] ?? ""
      return {
        index,
        price,
        label: `${weekday} ${10 + (index % 7)}:00`,
        tick: index % 7 === 0 ? weekday : "",
      }
    }
    if (range === "1M" || range === "3M") {
      const label = shortDay(days[index] ?? END)
      return { index, price, label, tick: label }
    }
    if (range === "1Y") {
      const day = new Date(END)
      day.setDate(day.getDate() - (points - 1 - index) * 7)
      return {
        index,
        price,
        label: `${shortDay(day)}, ${day.getFullYear()}`,
        tick: shortMonth(day),
      }
    }
    const month = new Date(
      END.getFullYear(),
      END.getMonth() - (points - 1 - index),
      1
    )
    return {
      index,
      price,
      label: `${MONTHS[month.getMonth()]} ${month.getFullYear()}`,
      tick: String(month.getFullYear()),
    }
  })
}

function resample(source: Point[]) {
  const samples: Point[] = []
  let previous = -1
  for (let index = 0; index < SAMPLES; index++) {
    const position = (index * (source.length - 1)) / (SAMPLES - 1)
    const from = Math.floor(position)
    const to = Math.min(source.length - 1, from + 1)
    const nearest = Math.round(position)
    const start = source[from]
    const end = source[to]
    const closest = source[nearest]
    if (!start || !end || !closest) return samples
    const price = start.price + (end.price - start.price) * (position - from)
    samples.push({
      index,
      price: Number(price.toFixed(2)),
      label: closest.label,
      tick: nearest !== previous ? closest.tick : "",
    })
    previous = nearest
  }
  return samples
}

function tickIndexes(points: Point[], max: number) {
  const ticks = points
    .filter(
      (point, index) => point.tick && point.tick !== points[index - 1]?.tick
    )
    .map((point) => point.index)
  if (ticks.length <= max) return ticks
  const step = Math.ceil(ticks.length / max)
  return ticks.filter((_, index) => index % step === 0)
}

export function AreaChartInteractive() {
  const { colors, isDark } = useTheme()
  const success = isDark ? palette.green400 : palette.green600
  const [range, setRange] = React.useState<Range>("1M")
  const [active, setActive] = React.useState<number | null>(null)
  const points = React.useMemo(() => resample(generate(range)), [range])

  const opening = points[0]
  const current = points[active ?? points.length - 1]
  if (!opening || !current) return null

  const first = opening.price
  const change = current.price - first
  const rising = change >= 0
  const prices = points.map((point) => point.price)
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const padding = (max - min) * 0.12
  const color = rising ? "green-500" : "destructive"
  const chartConfig = {
    price: { label: "Price", color },
  } satisfies ChartConfig

  const stats = [
    ["Open", formatPrice(first)],
    ["High", formatPrice(max)],
    ["Low", formatPrice(min)],
    ["Volume", range === "1D" ? "41.2M" : "1.24B"],
  ]

  return (
    <Card variant="filled" size="sm">
      <CardHeader style={styles.header}>
        <View style={styles.heading}>
          <View style={styles.ticker}>
            <Text style={styles.symbol}>ACME</Text>
            <Text style={[styles.company, { color: colors.mutedForeground }]}>
              Acme Corp.
            </Text>
          </View>
          <View style={styles.quote}>
            <Text style={styles.price}>${formatPrice(current.price)}</Text>
            <Text
              style={[
                styles.change,
                {
                  color: rising ? success : colors.destructive,
                },
              ]}
            >
              {formatPrice(change, true)} (
              {formatPrice(Math.abs((change / first) * 100))}%)
            </Text>
          </View>
          <Text style={[styles.caption, { color: colors.mutedForeground }]}>
            {active === null ? RANGES[range].caption : current.label}
          </Text>
        </View>
        <ToggleGroup
          spacing={0}
          value={[range]}
          onValueChange={(value) => {
            if (value[0]) setRange(value[0] as Range)
          }}
          accessibilityLabel="Time range"
        >
          {(Object.keys(RANGES) as Range[]).map((key) => (
            <ToggleGroupItem key={key} value={key} size="sm">
              <Text>{key}</Text>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </CardHeader>
      <CardContent style={styles.content}>
        <ChartContainer
          config={chartConfig}
          accessibilityLabel="ACME price"
          style={styles.chart}
        >
          <AreaChart
            data={points}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
            onActiveIndexChange={setActive}
          >
            <CartesianGrid vertical={false} strokeDasharray="2 4" />
            <XAxis
              dataKey="index"
              type="number"
              domain={["dataMin", "dataMax"]}
              ticks={tickIndexes(points, 6)}
              tickFormatter={(index: number) => points[index]?.tick ?? ""}
              tickMargin={8}
              minTickGap={4}
            />
            <YAxis
              orientation="right"
              domain={[min - padding, max + padding]}
              tickFormatter={(value: number) => Math.round(value).toString()}
              tickMargin={6}
              tickCount={5}
              width={40}
            />
            <ReferenceLine
              y={first}
              stroke="muted-foreground"
              strokeDasharray="2 3"
            />
            <ChartTooltip
              content={() => null}
              cursor={{ stroke: "muted-foreground", strokeWidth: 1 }}
            />
            <Area
              isAnimationActive={false}
              dataKey="price"
              type="linear"
              strokeWidth={2}
              fill={{
                stops: [
                  { offset: 0, opacity: 0.3 },
                  { offset: 1, opacity: 0.02 },
                ],
              }}
              activeDot={{
                r: 5,
                fill: color,
                stroke: "muted",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ChartContainer>
        <View style={styles.stats}>
          {stats.map(([term, value]) => (
            <View
              key={term}
              style={[styles.stat, { borderColor: colors.border }]}
            >
              <Text style={[styles.term, { color: colors.mutedForeground }]}>
                {term}
              </Text>
              <Text style={styles.amount}>{value}</Text>
            </View>
          ))}
        </View>
      </CardContent>
    </Card>
  )
}
