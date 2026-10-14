"use client"

import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts"

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

const visitors = { desktop: 1260, mobile: 570 }

const chartData = [visitors]

const chartConfig = {
  desktop: { label: "Desktop", color: "var(--blue)" },
  mobile: { label: "Mobile", color: "var(--teal)" },
} satisfies ChartConfig

const total = visitors.desktop + visitors.mobile

export function RadialChartStacked() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Half, stacked</CardTitle>
        <CardDescription>Two series on one arc</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-44 w-full"
          >
            <RadialBarChart
              accessibilityLayer
              data={chartData}
              startAngle={180}
              endAngle={0}
              innerRadius="120%"
              outerRadius="170%"
              cy="86%"
            >
              <PolarAngleAxis
                type="number"
                domain={[0, total]}
                tick={false}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <RadialBar
                dataKey="desktop"
                stackId="a"
                cornerRadius={6}
                fill="var(--color-desktop)"
                stroke="var(--surface-secondary)"
                strokeWidth={3}
              />
              <RadialBar
                dataKey="mobile"
                stackId="a"
                cornerRadius={6}
                fill="var(--color-mobile)"
                stroke="var(--surface-secondary)"
                strokeWidth={3}
              />
            </RadialBarChart>
          </ChartContainer>
          <div className="pointer-events-none absolute inset-x-0 bottom-[14%] flex flex-col items-center text-center">
            <span className="text-2xl font-semibold tracking-tight tabular-nums">
              {total.toLocaleString("en-US")}
            </span>
            <span className="text-xs text-label-secondary">visitors</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
