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

export function PieChartLabel() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Labeled</CardTitle>
        <CardDescription>Each name sits outside its slice</CardDescription>
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
              outerRadius="68%"
              stroke="var(--surface-secondary)"
              strokeWidth={2}
              labelLine={{ stroke: "var(--separator-strong)" }}
              label={({ x, y, cx, name }) => (
                <text
                  x={x}
                  y={y}
                  textAnchor={x > cx ? "start" : "end"}
                  dominantBaseline="central"
                  className="fill-label text-xs font-semibold"
                >
                  {chartConfig[name as keyof typeof chartConfig].label}
                </text>
              )}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
