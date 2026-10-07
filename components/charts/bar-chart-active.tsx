"use client"

import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  useActiveTooltipDataPoints,
  XAxis,
} from "recharts"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { type ChartConfig, ChartContainer } from "@/components/ui/chart"

const chartData = [
  { day: "Monday", steps: 8412 },
  { day: "Tuesday", steps: 10230 },
  { day: "Wednesday", steps: 6120 },
  { day: "Thursday", steps: 12480 },
  { day: "Friday", steps: 9050 },
  { day: "Saturday", steps: 14320 },
  { day: "Sunday", steps: 4870 },
].map((item, index) => ({ ...item, index }))

const chartConfig = {
  steps: { label: "Steps", color: "var(--orange)" },
} satisfies ChartConfig

const stepsFormat = new Intl.NumberFormat("en-US")

function KeyboardPoint({
  onChange,
}: {
  onChange: (index: number | null) => void
}) {
  const points = useActiveTooltipDataPoints<(typeof chartData)[number]>()
  const index = points?.[0]?.index ?? null

  React.useEffect(() => onChange(index), [index, onChange])

  return null
}

export function BarChartActive() {
  const [selected, setSelected] = React.useState(5)
  const [highlighted, setHighlighted] = React.useState<number | null>(null)
  const day = chartData[selected]
  if (!day) return null

  return (
    <Card variant="filled" size="sm">
      <CardHeader className="gap-0.5">
        <p className="text-sm font-semibold text-[color-mix(in_oklab,var(--orange),var(--label)_45%)] dark:text-orange">
          Steps
        </p>
        <p className="flex items-baseline gap-1" aria-live="polite">
          <span className="text-3xl font-semibold tracking-tight tabular-nums">
            {stepsFormat.format(day.steps)}
          </span>
          <span className="text-base font-semibold text-label-secondary">
            steps
          </span>
        </p>
        <p className="text-sm text-label-secondary">{day.day} · select a bar</p>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-40 w-full [&_.recharts-bar-rectangle]:cursor-pointer"
          onKeyDown={(event) => {
            if (
              (event.key === "Enter" || event.key === " ") &&
              highlighted !== null
            ) {
              event.preventDefault()
              setSelected(highlighted)
            }
          }}
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 10, right: 4, left: 4, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="2 4" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <Bar
              dataKey="steps"
              radius={5}
              maxBarSize={28}
              isAnimationActive={false}
              onClick={(_, index) => setSelected(index)}
            >
              {chartData.map((item) => (
                <Cell
                  key={item.day}
                  fill="var(--color-steps)"
                  fillOpacity={item.index === selected ? 1 : 0.3}
                  className="transition-[fill-opacity] duration-200"
                />
              ))}
            </Bar>
            <KeyboardPoint onChange={setHighlighted} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
