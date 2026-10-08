"use client"

import * as React from "react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { day: "Today", low: 14, high: 22 },
  { day: "Wed", low: 13, high: 21 },
  { day: "Thu", low: 15, high: 24 },
  { day: "Fri", low: 16, high: 25 },
  { day: "Sat", low: 14, high: 20 },
  { day: "Sun", low: 11, high: 17 },
  { day: "Mon", low: 10, high: 16 },
  { day: "Tue", low: 12, high: 19 },
].map((item) => ({ ...item, range: [item.low, item.high] }))

const chartConfig = {
  range: { label: "Temperature" },
} satisfies ChartConfig

export function BarChartRange() {
  const id = React.useId()

  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>8-day forecast</CardTitle>
        <CardDescription>Each bar spans the low and high</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-60 w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            barCategoryGap={7}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="var(--teal)" />
                <stop offset="55%" stopColor="var(--yellow)" />
                <stop offset="100%" stopColor="var(--orange)" />
              </linearGradient>
            </defs>
            <YAxis
              dataKey="day"
              type="category"
              tickLine={false}
              axisLine={false}
              width="auto"
              tick={{ className: "fill-label font-semibold" }}
            />
            <YAxis
              yAxisId="high"
              dataKey="high"
              type="category"
              orientation="right"
              tickLine={false}
              axisLine={false}
              width="auto"
              tick={{ className: "fill-label font-semibold" }}
              tickFormatter={(value: number) => `${value}°`}
            />
            <XAxis type="number" hide domain={[8, 27]} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideIndicator
                  formatter={(value) => (
                    <span className="font-semibold tabular-nums">
                      {Array.isArray(value)
                        ? `${value[0]}° to ${value[1]}°`
                        : value}
                    </span>
                  )}
                />
              }
            />
            <Bar
              dataKey="range"
              fill={`url(#${id})`}
              radius={99}
              background={{ fill: "var(--control)", radius: 99 }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
