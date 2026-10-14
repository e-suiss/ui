"use client"

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

export function BarChartHorizontal() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Horizontal</CardTitle>
        <CardDescription>Room for long category names</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-48 w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
          >
            <YAxis
              dataKey="device"
              type="category"
              tickLine={false}
              axisLine={false}
              width="auto"
              tickFormatter={(value: keyof typeof chartConfig) =>
                String(chartConfig[value]?.label)
              }
            />
            <XAxis type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="device" />}
            />
            <Bar dataKey="users" radius={5} barSize={18} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
