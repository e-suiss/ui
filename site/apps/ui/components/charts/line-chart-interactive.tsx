"use client"

import * as React from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
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
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type City = "istanbul" | "ankara" | "izmir" | "antalya" | "erzurum"

type Mode = "average" | "high" | "low"

const CITIES: Record<City, { average: number[]; spread: [number, number] }> = {
  istanbul: {
    average: [6, 6, 8, 12, 17, 22, 24, 24, 21, 16, 12, 8],
    spread: [6, 0.6],
  },
  ankara: {
    average: [0, 2, 6, 11, 16, 20, 24, 24, 19, 13, 7, 2],
    spread: [11, 1.6],
  },
  izmir: {
    average: [9, 10, 12, 16, 21, 26, 28, 28, 24, 19, 14, 10],
    spread: [9, 1],
  },
  antalya: {
    average: [10, 11, 13, 16, 21, 26, 29, 29, 25, 20, 15, 11],
    spread: [9, 0.9],
  },
  erzurum: {
    average: [-9, -8, -2, 6, 11, 15, 20, 20, 15, 8, 1, -6],
    spread: [12, 1.8],
  },
}

const CITY_KEYS = Object.keys(CITIES) as City[]

const MODES: Record<Mode, string> = {
  average: "Average",
  high: "High",
  low: "Low",
}

const MONTHS = Array.from(
  { length: 12 },
  (_, index) => new Date(2026, index, 1)
)
const shortMonth = new Intl.DateTimeFormat("en-US", { month: "short" })
const longMonth = new Intl.DateTimeFormat("en-US", { month: "long" })

const chartConfig = {
  istanbul: { label: "Istanbul", color: "var(--blue)" },
  ankara: { label: "Ankara", color: "var(--purple)" },
  izmir: { label: "Izmir", color: "var(--teal)" },
  antalya: { label: "Antalya", color: "var(--orange)" },
  erzurum: { label: "Erzurum", color: "var(--indigo)" },
} satisfies ChartConfig

const TRANSITION = 650

function temperature(city: City, month: number, mode: Mode) {
  const { average, spread } = CITIES[city]
  const mean = average[month]
  if (mean === undefined) return Number.NaN
  if (mode === "average") return mean
  const season = Math.sin(((month - 0.5) / 12) * Math.PI)
  const range = spread[0] + spread[1] * 6 * season * season
  return mean + (mode === "high" ? range / 2 : -range / 2)
}

function ActiveMonth({
  onChange,
}: {
  onChange: (month: number | null) => void
}) {
  const points = useActiveTooltipDataPoints<{ index: number }>()
  const month = points?.[0]?.index ?? null

  React.useEffect(() => onChange(month), [month, onChange])

  return null
}

export function LineChartInteractive() {
  const [visible, setVisible] = React.useState<City[]>([
    "istanbul",
    "ankara",
    "antalya",
  ])
  const [mode, setMode] = React.useState<Mode>("average")
  const [month, setMonth] = React.useState<number | null>(null)
  const data = React.useMemo(
    () =>
      MONTHS.map((date, index) => ({
        index,
        month: shortMonth.format(date),
        ...Object.fromEntries(
          CITY_KEYS.map((city) => [
            city,
            Math.round(temperature(city, index, mode) * 10) / 10,
          ])
        ),
      })) as ({ index: number; month: string } & Record<City, number>)[],
    [mode]
  )
  const shown = CITY_KEYS.filter((city) => visible.includes(city))

  const toggle = (city: City, pressed: boolean) =>
    setVisible((current) => {
      if (pressed) return [...current, city]
      return current.length > 1
        ? current.filter((item) => item !== city)
        : current
    })

  return (
    <Card variant="filled" size="sm" className="[--card-spacing:--spacing(5)]">
      <CardHeader className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-44 flex-1 flex-col gap-0.5">
          <p className="text-lg font-semibold">Monthly temperature</p>
          <p className="text-sm text-label-secondary">
            {MODES[mode]} · °C · long-term
          </p>
        </div>
        <ToggleGroup
          spacing={0}
          value={[mode]}
          onValueChange={(value: string[]) => {
            if (value[0]) setMode(value[0] as Mode)
          }}
          aria-label="Temperature"
        >
          {(Object.keys(MODES) as Mode[]).map((key) => (
            <ToggleGroupItem key={key} value={key} size="sm">
              {MODES[key]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Cities">
          {CITY_KEYS.map((city) => (
            <Toggle
              key={city}
              size="sm"
              pressed={visible.includes(city)}
              onPressedChange={(pressed) => toggle(city, pressed)}
              style={
                { "--chip": chartConfig[city].color } as React.CSSProperties
              }
              className="gap-1.5 bg-control font-semibold text-label aria-pressed:bg-[color-mix(in_oklab,var(--chip)_16%,transparent)] aria-pressed:text-label aria-pressed:hover:bg-[color-mix(in_oklab,var(--chip)_22%,transparent)] aria-pressed:hover:text-label aria-pressed:active:bg-[color-mix(in_oklab,var(--chip)_28%,transparent)]"
            >
              <span
                aria-hidden
                className="size-2 rounded-full bg-label-quaternary transition-colors in-aria-pressed:bg-(--chip)"
              />
              {chartConfig[city].label}
            </Toggle>
          ))}
        </div>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-72 w-full"
        >
          <LineChart
            accessibilityLayer
            data={data}
            margin={{ top: 10, right: 4, left: 12, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="2 4" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={8}
            />
            <YAxis
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              width="auto"
              domain={[-20, 40]}
              ticks={[-20, -10, 0, 10, 20, 30, 40]}
              allowDataOverflow
              tickFormatter={(value: number) => `${value}°`}
            />
            <ReferenceLine y={0} stroke="var(--separator-strong)" />
            <ChartTooltip
              content={({ active, label, payload }) => (
                <ChartTooltipContent
                  active={active}
                  label={label}
                  payload={payload}
                  indicator="line"
                  labelFormatter={(_, items) =>
                    longMonth.format(MONTHS[items[0]?.payload.index ?? 0])
                  }
                  formatter={(value, name) => (
                    <div className="flex w-full items-center gap-2">
                      <span
                        className="h-3 w-0.75 shrink-0 rounded-full bg-(--swatch)"
                        style={
                          {
                            "--swatch": chartConfig[name as City].color,
                          } as React.CSSProperties
                        }
                      />
                      <span className="flex-1 text-label-secondary">
                        {chartConfig[name as City].label}
                      </span>
                      <span className="font-semibold tabular-nums">
                        {value}°
                      </span>
                    </div>
                  )}
                />
              )}
            />
            {shown.map((city) => (
              <Line
                key={city}
                dataKey={city}
                type="monotone"
                stroke={`var(--color-${city})`}
                strokeWidth={2.5}
                dot={false}
                activeDot={{
                  r: 5,
                  strokeWidth: 2,
                  stroke: "var(--surface-secondary)",
                }}
                animationDuration={TRANSITION}
                animationEasing="ease-in-out"
                pathLength={1}
                className="[&_.recharts-line-curve]:[stroke-dasharray:1] [&_.recharts-line-curve]:transition-[stroke-dashoffset] [&_.recharts-line-curve]:duration-750 [&_.recharts-line-curve]:ease-[cubic-bezier(0.45,0,0.2,1)] [&_.recharts-line-curve]:starting:[stroke-dashoffset:1] motion-reduce:[&_.recharts-line-curve]:transition-none"
              />
            ))}
            <ActiveMonth onChange={setMonth} />
          </LineChart>
        </ChartContainer>
        <dl className="grid grid-cols-[repeat(auto-fit,minmax(8.5rem,1fr))] gap-3">
          {shown.map((city) => {
            const temperatures = data.map((item) => item[city])
            const highlighted = month === null ? undefined : temperatures[month]
            return (
              <div key={city} className="flex flex-col gap-0.5">
                <dt className="flex items-center gap-1.5 text-sm text-label-secondary">
                  <span
                    className="size-2 shrink-0 rounded-full bg-(--swatch)"
                    style={
                      {
                        "--swatch": chartConfig[city].color,
                      } as React.CSSProperties
                    }
                  />
                  {chartConfig[city].label}
                </dt>
                <dd className="text-base font-semibold tabular-nums">
                  {month === null || highlighted === undefined
                    ? `${Math.round(Math.min(...temperatures))}° / ${Math.round(Math.max(...temperatures))}°`
                    : `${Math.round(highlighted)}° · ${longMonth.format(MONTHS[month])}`}
                </dd>
              </div>
            )
          })}
        </dl>
      </CardContent>
    </Card>
  )
}
