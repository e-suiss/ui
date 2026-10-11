"use client"

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

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

const GOAL = 10000

const chartData = [
  { day: "Mon", steps: 8412 },
  { day: "Tue", steps: 10230 },
  { day: "Wed", steps: 6120 },
  { day: "Thu", steps: 12480 },
  { day: "Fri", steps: 9050 },
  { day: "Sat", steps: 14320 },
  { day: "Sun", steps: 4870 },
]

const chartConfig = {
  steps: { label: "Steps", color: "var(--orange)" },
} satisfies ChartConfig

const stepsFormat = new Intl.NumberFormat("en-US")

export function LineChartGoal() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Goal line</CardTitle>
        <CardDescription>A daily goal of 10,000 steps</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-48 w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 10, right: 4, left: 12, bottom: 0 }}
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
              tickFormatter={(value: number) => `${value / 1000}k`}
            />
            <ReferenceLine
              y={GOAL}
              stroke="var(--green)"
              strokeDasharray="4 4"
              label={{
                value: "Goal",
                position: "insideTopLeft",
                className: "fill-label-secondary text-xs font-semibold",
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideIndicator
                  formatter={(value) => (
                    <span className="font-semibold tabular-nums">
                      {stepsFormat.format(Number(value))} steps
                    </span>
                  )}
                />
              }
            />
            <Line
              dataKey="steps"
              type="monotone"
              stroke="var(--color-steps)"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: "var(--color-steps)", strokeWidth: 0 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
