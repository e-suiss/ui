"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 173, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 264, mobile: 140 },
]

const chartConfig = {
  desktop: { label: "Desktop", color: "var(--blue)" },
  mobile: { label: "Mobile", color: "var(--teal)" },
} satisfies ChartConfig

export function AreaChartGradient() {
  const id = React.useId()
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Gradient</CardTitle>
        <CardDescription>The fill fades out toward the bottom</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-48 w-full"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 10, right: 12, left: 12, bottom: 0 }}
          >
            <defs>
              <linearGradient id={`${id}-desktop`} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.38}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.02}
                />
              </linearGradient>
              <linearGradient id={`${id}-mobile`} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.38}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="2 4" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="mobile"
              type="natural"
              stroke="var(--color-mobile)"
              strokeWidth={2}
              fill={`url(#${id}-mobile)`}
            />
            <Area
              dataKey="desktop"
              type="natural"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              fill={`url(#${id}-desktop)`}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
