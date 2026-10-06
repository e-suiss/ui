"use client"

import { CartesianGrid, Line, LineChart, ReferenceArea, XAxis } from "recharts"

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

const actual = [12, 14, 13, 17, 19, 22, 24, 23, 26]
const forecast = [26, 28, 30, 33]

const chartData = Array.from({ length: 12 }, (_, index) => ({
  month: new Intl.DateTimeFormat("en-US", { month: "short" }).format(
    new Date(2026, index, 1)
  ),
  actual: actual[index] ?? null,
  forecast: index >= 8 ? forecast[index - 8] : null,
}))

const chartConfig = {
  actual: { label: "Actual", color: "var(--blue)" },
  forecast: { label: "Forecast", color: "var(--blue)" },
} satisfies ChartConfig

export function LineChartForecast() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Actual and forecast</CardTitle>
        <CardDescription>The dashed line is the forecast</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-48 w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 10, right: 12, left: 12, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="2 4" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={2}
            />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <ReferenceArea
              x1="Sep"
              x2="Dec"
              fill="var(--control)"
              fillOpacity={0.6}
            />
            <Line
              dataKey="actual"
              type="monotone"
              stroke="var(--color-actual)"
              strokeWidth={2.5}
              dot={false}
            />
            <Line
              dataKey="forecast"
              type="monotone"
              stroke="var(--color-forecast)"
              strokeWidth={2.5}
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
