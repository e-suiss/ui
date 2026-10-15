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

const MAX = 320

const chartData = [
  { device: "phone", users: 275, fill: "var(--color-phone)" },
  { device: "laptop", users: 200, fill: "var(--color-laptop)" },
  { device: "tablet", users: 187, fill: "var(--color-tablet)" },
  { device: "watch", users: 173, fill: "var(--color-watch)" },
]

const tracks = chartData.map((item) => ({
  ...item,
  users: MAX,
  fill: `color-mix(in oklab, ${item.fill} 22%, transparent)`,
}))

const chartConfig = {
  users: { label: "Users" },
  phone: { label: "Phone", color: "var(--chart-1)" },
  laptop: { label: "Laptop", color: "var(--chart-2)" },
  tablet: { label: "Tablet", color: "var(--chart-3)" },
  watch: { label: "Watch", color: "var(--chart-4)" },
} satisfies ChartConfig

const shape = {
  innerRadius: "25%",
  outerRadius: "100%",
  barSize: 12,
} as const

export function RadialChartTinted() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Tinted track</CardTitle>
        <CardDescription>
          The unfilled part keeps a soft tint of its color
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-52">
          <ChartContainer
            config={chartConfig}
            aria-hidden
            className="absolute inset-0 aspect-auto"
          >
            <RadialBarChart accessibilityLayer={false} data={tracks} {...shape}>
              <PolarAngleAxis
                type="number"
                domain={[0, MAX]}
                tick={false}
                axisLine={false}
              />
              <RadialBar
                dataKey="users"
                cornerRadius={10}
                isAnimationActive={false}
              />
            </RadialBarChart>
          </ChartContainer>
          <ChartContainer
            config={chartConfig}
            className="absolute inset-0 aspect-auto"
          >
            <RadialBarChart accessibilityLayer data={chartData} {...shape}>
              <PolarAngleAxis
                type="number"
                domain={[0, MAX]}
                tick={false}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel nameKey="device" />}
              />
              <RadialBar dataKey="users" cornerRadius={10} />
            </RadialBarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
