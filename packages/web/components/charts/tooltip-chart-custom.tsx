"use client"

import { Bar, BarChart, XAxis } from "recharts"

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
} from "@/components/ui/chart"

const chartData = [
  { day: "Monday", steps: 8412 },
  { day: "Tuesday", steps: 10230 },
  { day: "Wednesday", steps: 6120 },
  { day: "Thursday", steps: 12480 },
  { day: "Friday", steps: 9050 },
  { day: "Saturday", steps: 14320 },
  { day: "Sunday", steps: 4870 },
]

const chartConfig = {
  steps: { label: "Steps", color: "var(--orange)" },
} satisfies ChartConfig

export function TooltipChartCustom() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Custom content</CardTitle>
        <CardDescription>A tooltip built from scratch</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-52 w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 70, right: 4, left: 4, bottom: 0 }}
          >
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <ChartTooltip
              defaultIndex={5}
              cursor={false}
              content={({ active, payload, label }) => {
                const entry = payload?.[0]
                if (!active || !entry) return null
                return (
                  <div className="min-w-28 rounded-xl bg-surface-raised px-3 py-2 shadow-lg ring-1 ring-label/5 dark:ring-label/10">
                    <p className="text-2xs font-semibold tracking-wide text-label-secondary uppercase">
                      Total
                    </p>
                    <p className="flex items-baseline gap-1">
                      <span className="text-2xl font-semibold tabular-nums">
                        {Number(entry.value).toLocaleString("en-US")}
                      </span>
                      <span className="text-xs font-semibold text-label-secondary">
                        steps
                      </span>
                    </p>
                    <p className="text-xs text-label-secondary">{label}</p>
                  </div>
                )
              }}
            />
            <Bar
              dataKey="steps"
              fill="var(--color-steps)"
              radius={4}
              maxBarSize={26}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
