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

export function RadarChartDots() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>With dots</CardTitle>
        <CardDescription>A reading on every axis</CardDescription>
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
            <PolarGrid stroke="var(--separator)" />
            <PolarAngleAxis dataKey="skill" />
            <Radar
              dataKey="thisMonth"
              stroke="var(--color-thisMonth)"
              fill="var(--color-thisMonth)"
              fillOpacity={0.2}
              strokeWidth={2}
              dot={{ r: 4, fillOpacity: 1 }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
