"use client"

import { Pie, PieChart } from "recharts"

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
  { device: "phone", users: 275, fill: "var(--color-phone)" },
  { device: "laptop", users: 200, fill: "var(--color-laptop)" },
  { device: "tablet", users: 187, fill: "var(--color-tablet)" },
  { device: "watch", users: 173, fill: "var(--color-watch)" },
  { device: "other", users: 90, fill: "var(--color-other)" },
]

const chartConfig = {
  users: { label: "Users" },
  phone: { label: "Phone", color: "var(--blue)" },
  laptop: { label: "Laptop", color: "var(--teal)" },
  tablet: { label: "Tablet", color: "var(--indigo)" },
  watch: { label: "Watch", color: "var(--orange)" },
  other: { label: "Other", color: "var(--gray)" },
} satisfies ChartConfig

export function PieChartSeparated() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Separated slices</CardTitle>
        <CardDescription>Gaps and rounded corners</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-52 w-full"
        >
          <PieChart accessibilityLayer>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="device" />}
            />
            <Pie
              data={chartData}
              dataKey="users"
              nameKey="device"
              innerRadius="55%"
              outerRadius="85%"
              paddingAngle={5}
              cornerRadius={8}
              strokeWidth={0}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
