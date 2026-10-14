"use client"

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
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

const chartData = [
  { skill: "Cardio", thisMonth: 86, lastMonth: 72 },
  { skill: "Strength", thisMonth: 62, lastMonth: 58 },
  { skill: "Flexibility", thisMonth: 48, lastMonth: 55 },
  { skill: "Balance", thisMonth: 70, lastMonth: 60 },
  { skill: "Endurance", thisMonth: 80, lastMonth: 66 },
  { skill: "Speed", thisMonth: 74, lastMonth: 70 },
]

const chartConfig = {
  thisMonth: { label: "This month", color: "var(--green)" },
  lastMonth: { label: "Last month", color: "var(--gray)" },
} satisfies ChartConfig

export function RadarChartRadiusAxis() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Value axis</CardTitle>
        <CardDescription>The 0 to 100 scale is visible</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-56 w-full"
        >
          <RadarChart accessibilityLayer data={chartData} outerRadius="70%">
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 100]}
              tickCount={5}
              axisLine={false}
              tick={{ className: "fill-label-tertiary text-2xs" }}
            />
            <PolarGrid stroke="var(--separator)" />
            <PolarAngleAxis dataKey="skill" />
            <Radar
              dataKey="thisMonth"
              stroke="var(--color-thisMonth)"
              fill="var(--color-thisMonth)"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
