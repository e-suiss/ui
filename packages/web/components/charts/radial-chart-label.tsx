"use client"

import { LabelList, RadialBar, RadialBarChart } from "recharts"

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
]

const chartConfig = {
  users: { label: "Users" },
  phone: { label: "Phone", color: "var(--chart-1)" },
  laptop: { label: "Laptop", color: "var(--chart-2)" },
  tablet: { label: "Tablet", color: "var(--chart-3)" },
  watch: { label: "Watch", color: "var(--chart-4)" },
} satisfies ChartConfig

export function RadialChartLabel() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Labeled</CardTitle>
        <CardDescription>
          Each name sits at the start of its bar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-52 w-full"
        >
          <RadialBarChart
            accessibilityLayer
            data={chartData}
            innerRadius="28%"
            outerRadius="100%"
            barSize={16}
            startAngle={90}
            endAngle={-200}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="device" />}
            />
            <RadialBar
              dataKey="users"
              cornerRadius={10}
              background={{ fill: "var(--secondary)" }}
            >
              <LabelList
                dataKey="device"
                position="insideStart"
                className="fill-primary-foreground text-xs font-semibold"
                formatter={(value) =>
                  chartConfig[String(value) as keyof typeof chartConfig]?.label
                }
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
