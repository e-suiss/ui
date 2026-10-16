"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  useActiveTooltipDataPoints,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type Category = "social" | "productivity" | "entertainment"

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
  social: { label: "Social", color: "var(--chart-1)" },
  productivity: { label: "Productivity", color: "var(--color-cyan-500)" },
  entertainment: { label: "Entertainment", color: "var(--chart-4)" },
} satisfies ChartConfig

const total = (day: Record<Category, number>) =>
  CATEGORIES.reduce((sum, category) => sum + day[category], 0)

const TAP_SLOP = 10

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

function distribute(amount: number, weights: number[]) {
  const sum = weights.reduce((total, weight) => total + weight, 0)
  const exact = weights.map((weight) => (sum ? (amount * weight) / sum : 0))
  const parts = exact.map(Math.floor)
  let rest = amount - parts.reduce((total, part) => total + part, 0)
  const order = exact
    .map((value, index) => ({ index, remainder: value - Math.floor(value) }))
    .sort((a, b) => b.remainder - a.remainder)
  for (const { index } of order) {
    if (rest <= 0) break
    parts[index] = (parts[index] ?? 0) + 1
    rest -= 1
  }
  return parts
}

function hourly(day: number) {
  const categories = WEEK[day]
  if (!categories) return []
  const base = PROFILE.map(
    (weight, hour) => weight * (0.75 + noise(hour + 7 * (day + 1)) * 0.5)
  )
  const social = distribute(categories.social, base)
  const productivity = distribute(
    categories.productivity,
    base.map((weight, hour) => weight * (hour > 8 && hour < 18 ? 1.6 : 0.4))
  )
  const entertainment = distribute(
    categories.entertainment,
    base.map((weight, hour) => weight * (hour > 18 ? 1.8 : 0.5))
  )
  return PROFILE.map((_, hour) => ({
    label: String(hour),
    index: hour,
    social: social[hour] ?? 0,
    productivity: productivity[hour] ?? 0,
    entertainment: entertainment[hour] ?? 0,
  }))
}

function KeyboardPoint({
  onChange,
}: {
  onChange: (index: number | null) => void
}) {
  const points = useActiveTooltipDataPoints<{ index?: number }>()
  const index = points?.[0]?.index ?? null

  React.useEffect(() => {
    if (index !== null) onChange(index)
  }, [index, onChange])

  return null
}

export function BarChartInteractive() {
  const [view, setView] = React.useState<"week" | "day">("week")
  const [selected, setSelected] = React.useState<number | null>(null)
  const [highlighted, setHighlighted] = React.useState<number | null>(null)
  const [hoveredApp, setHoveredApp] = React.useState<string | null>(null)
  const touchRef = React.useRef<{ x: number; y: number } | null>(null)

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

  const select = (index: number) => {
    if (!isWeek) return
    setSelected((current) => (current === index ? null : index))
  }

  return (
    <Card variant="filled" size="sm" className="[--card-spacing:--spacing(5)]">
      <CardHeader className="flex flex-wrap items-start justify-between gap-4">
        <div
          className="flex min-w-52 flex-1 flex-col gap-0.5"
          aria-live="polite"
        >
          <p className="text-sm font-semibold text-muted-foreground">
            {selected === null ? "Daily average" : DAYS[selected]}
          </p>
          <p className="text-3xl font-semibold tracking-tight tabular-nums">
            {formatMinutes(headline)}
          </p>
          <p className="text-sm text-muted-foreground">{comparison}</p>
        </div>
        <ToggleGroup
          spacing={0}
          type="single"
          value={view}
          onValueChange={(value: string) => {
            const next = value as "week" | "day" | ""
            if (!next) return
            setView(next)
            if (next === "day" && selected === null) setSelected(6)
          }}
          aria-label="Period"
        >
          <ToggleGroupItem value="week" size="sm" className="px-5">
            Week
          </ToggleGroupItem>
          <ToggleGroupItem value="day" size="sm" className="px-5">
            Day
          </ToggleGroupItem>
        </ToggleGroup>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-64 w-full data-[view=week]:[&_.recharts-bar-rectangle]:cursor-pointer"
          data-view={view}
          onKeyDown={(event) => {
            if (
              (event.key === "Enter" || event.key === " ") &&
              highlighted !== null
            ) {
              event.preventDefault()
              select(highlighted)
            }
          }}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setHighlighted(null)
            }
          }}
        >
          <BarChart
            accessibilityLayer
            data={data}
            margin={{ top: 10, right: 4, left: 12, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="2 4" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
              ticks={isWeek ? undefined : ["0", "6", "12", "18"]}
              tickFormatter={(value: string) =>
                isWeek ? value : `${value}:00`
              }
            />
            <YAxis
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              width="auto"
              ticks={isWeek ? [0, 120, 240, 360] : undefined}
              tickCount={isWeek ? undefined : 4}
              tickFormatter={(value: number) =>
                isWeek ? `${value / 60}h` : `${value}m`
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(_, payload) => {
                    const label = payload[0]?.payload.label
                    return isWeek
                      ? DAYS[DAYS.findIndex((day) => day.startsWith(label))]
                      : `${label}:00 – ${Number(label) + 1}:00`
                  }}
                  formatter={(value, name) => (
                    <div className="flex w-full items-center gap-2">
                      <span
                        className="size-2 shrink-0 rounded-xs bg-(--swatch)"
                        style={
                          {
                            "--swatch": `var(--color-${name})`,
                          } as React.CSSProperties
                        }
                      />
                      <span className="flex-1 text-muted-foreground">
                        {chartConfig[name as Category].label}
                      </span>
                      <span className="font-semibold tabular-nums">
                        {formatMinutes(Number(value))}
                      </span>
                    </div>
                  )}
                />
              }
            />
            {isWeek && (
              <ReferenceLine
                y={AVERAGE}
                stroke="var(--color-green-500)"
                strokeDasharray="3 3"
              />
            )}
            {CATEGORIES.map((category, position) => (
              <Bar
                key={category}
                dataKey={category}
                stackId="a"
                fill={`var(--color-${category})`}
                radius={position === CATEGORIES.length - 1 ? [5, 5, 0, 0] : 0}
                maxBarSize={isWeek ? 34 : 10}
                isAnimationActive={false}
                onClick={(_, index) => select(index)}
                onTouchStart={(_, __, event) => {
                  const touch = event.touches[0]
                  if (!touch) return
                  touchRef.current = { x: touch.clientX, y: touch.clientY }
                }}
                onTouchEnd={(_, index, event) => {
                  const start = touchRef.current
                  const touch = event.changedTouches[0]
                  touchRef.current = null
                  if (
                    !start ||
                    !touch ||
                    Math.hypot(
                      touch.clientX - start.x,
                      touch.clientY - start.y
                    ) > TAP_SLOP
                  )
                    return
                  event.preventDefault()
                  select(index)
                }}
              >
                {isWeek &&
                  data.map((item, index) => (
                    <Cell
                      key={String(item.label)}
                      fillOpacity={
                        selected === null || selected === index ? 1 : 0.3
                      }
                      className="transition-[fill-opacity] duration-200"
                    />
                  ))}
              </Bar>
            ))}
            <KeyboardPoint onChange={setHighlighted} />
          </BarChart>
        </ChartContainer>
        <dl className="grid grid-cols-3 gap-3">
          {CATEGORIES.map((category) => (
            <div key={category} className="flex min-w-0 flex-col gap-0.5">
              <dt className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
                <span
                  className="size-2 shrink-0 rounded-full bg-(--swatch)"
                  style={
                    {
                      "--swatch": chartConfig[category].color,
                    } as React.CSSProperties
                  }
                />
                <span className="truncate">{chartConfig[category].label}</span>
              </dt>
              <dd className="text-base font-semibold tabular-nums">
                {formatMinutes(categories[category])}
              </dd>
            </div>
          ))}
        </dl>
        <div className="flex flex-col">
          <p className="mb-1 text-xs font-semibold text-muted-foreground uppercase">
            Most used
          </p>
          <ul>
            {apps.map((app) => (
              <li
                key={app.name}
                onPointerEnter={() => setHoveredApp(app.name)}
                onPointerLeave={() => setHoveredApp(null)}
                className="grid grid-cols-[6rem_1fr_4.5rem] items-center gap-3 border-t border-border py-2"
              >
                <span className="truncate text-base">{app.name}</span>
                <span className="h-1.5 overflow-hidden rounded-full bg-secondary">
                  <span
                    data-dimmed={
                      hoveredApp !== null && hoveredApp !== app.name
                        ? ""
                        : undefined
                    }
                    className="block h-full origin-left rounded-full rtl:origin-right bg-(--swatch) transition-[scale,opacity] duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] data-dimmed:opacity-40"
                    style={
                      {
                        "--swatch": chartConfig[app.category].color,
                        scale: `${app.minutes / longest} 1`,
                      } as React.CSSProperties
                    }
                  />
                </span>
                <span className="text-end text-sm text-muted-foreground tabular-nums">
                  {formatMinutes(app.minutes)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
