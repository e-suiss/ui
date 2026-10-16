"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
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

const GOAL = 7

const chartData = [
  { day: "Mon", hours: 6.8 },
  { day: "Tue", hours: 7.4 },
  { day: "Wed", hours: 5.9 },
  { day: "Thu", hours: 7.9 },
  { day: "Fri", hours: 6.4 },
  { day: "Sat", hours: 8.6 },
  { day: "Sun", hours: 7.2 },
]

const AVERAGE =
  chartData.reduce((sum, item) => sum + item.hours, 0) / chartData.length

const chartConfig = {
  hours: { label: "Sleep", color: "var(--chart-3)" },
} satisfies ChartConfig

function formatHours(hours: number) {
  const minutes = Math.round(hours * 60)
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
}

export function LineChartGoalDots() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader className="gap-0.5">
        <p className="text-sm font-semibold text-[color-mix(in_oklab,var(--color-indigo-500),var(--foreground)_10%)] dark:text-[color-mix(in_oklab,var(--color-indigo-500),var(--foreground)_35%)]">
          Sleep
        </p>
        <p className="flex items-baseline gap-1">
          <span className="text-3xl font-semibold tracking-tight tabular-nums">
            {formatHours(AVERAGE)}
          </span>
        </p>
        <p className="text-sm text-muted-foreground">
          Goal 7 hours · green nights met it
        </p>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-40 w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 10, right: 4, left: 16, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="2 4" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
            />
            <YAxis
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              width="auto"
              domain={[5, 9]}
              ticks={[5, 7, 9]}
              tickFormatter={(value: number) => `${value}h`}
            />
            <ReferenceLine
              y={GOAL}
              stroke="var(--color-green-500)"
              strokeDasharray="3 3"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideIndicator
                  formatter={(value) => (
                    <span className="font-semibold tabular-nums">
                      {formatHours(Number(value))}
                    </span>
                  )}
                />
              }
            />
            <Line
              dataKey="hours"
              type="monotone"
              stroke="var(--color-hours)"
              strokeWidth={2}
              dot={({ cx, cy, index, payload }) => (
                <circle
                  key={index}
                  cx={cx}
                  cy={cy}
                  r={4.5}
                  fill={
                    payload.hours >= GOAL
                      ? "var(--color-green-500)"
                      : "var(--color-orange-500)"
                  }
                  stroke="var(--muted)"
                  strokeWidth={2}
                />
              )}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
