"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
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

const chartData = [
  4, 0, 0, 0, 0, 0, 6, 18, 27, 22, 19, 21, 30, 26, 23, 17, 22, 26, 31, 39, 42,
  47, 35, 18,
].map((minutes, hour) => ({ hour, minutes }))

const chartConfig = {
  minutes: { label: "Screen time", color: "var(--blue)" },
} satisfies ChartConfig

const total = chartData.reduce((sum, item) => sum + item.minutes, 0)
const average = total / chartData.length

export function BarChartHourly() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader className="gap-0.5">
        <p className="text-sm font-semibold text-link">Screen time</p>
        <p className="text-3xl font-semibold tracking-tight tabular-nums">
          {Math.floor(total / 60)}h {total % 60}m
        </p>
        <p className="text-sm text-label-secondary">Today · hour by hour</p>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-40 w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 10, right: 4, left: 12, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="2 4" />
            <XAxis
              dataKey="hour"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              ticks={[0, 6, 12, 18]}
              interval={0}
              tickFormatter={(value: number) => `${value}:00`}
            />
            <YAxis
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              width="auto"
              tickCount={3}
              tickFormatter={(value: number) => `${value} min`}
            />
            <ReferenceLine
              y={average}
              stroke="var(--green)"
              strokeDasharray="3 3"
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideIndicator
                  labelFormatter={(_, payload) =>
                    `${payload[0]?.payload.hour}:00`
                  }
                  formatter={(value) => (
                    <span className="font-semibold tabular-nums">
                      {value} min
                    </span>
                  )}
                />
              }
            />
            <Bar
              dataKey="minutes"
              fill="var(--color-minutes)"
              radius={[3, 3, 0, 0]}
              maxBarSize={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
