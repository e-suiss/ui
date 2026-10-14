"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

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
  ChartLegend,
  ChartLegendContent,
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

export function RadarChartLegend() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>With a legend</CardTitle>
        <CardDescription>Series listed below</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-60 w-full"
        >
          <RadarChart
            accessibilityLayer
            data={chartData}
            cy="45%"
            outerRadius="62%"
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <ChartLegend
              verticalAlign="bottom"
              content={<ChartLegendContent />}
            />
            <PolarGrid stroke="var(--separator)" />
            <PolarAngleAxis dataKey="skill" />
            <Radar
              dataKey="lastMonth"
              stroke="var(--color-lastMonth)"
              fill="var(--color-lastMonth)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Radar
              dataKey="thisMonth"
              stroke="var(--color-thisMonth)"
              fill="var(--color-thisMonth)"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
