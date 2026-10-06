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
  { device: "phone", share: 40, fill: "var(--color-phone)" },
  { device: "laptop", share: 25, fill: "var(--color-laptop)" },
  { device: "tablet", share: 20, fill: "var(--color-tablet)" },
  { device: "watch", share: 15, fill: "var(--color-watch)" },
]

const chartConfig = {
  share: { label: "Share" },
  phone: { label: "Phone", color: "var(--blue)" },
  laptop: { label: "Laptop", color: "var(--teal)" },
  tablet: { label: "Tablet", color: "var(--indigo)" },
  watch: { label: "Watch", color: "var(--orange)" },
} satisfies ChartConfig

export function PieChartHalf() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Half circle</CardTitle>
        <CardDescription>Battery use by device · last 24 hours</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-44 w-full"
          >
            <PieChart accessibilityLayer>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    nameKey="device"
                    formatter={(value, name) => (
                      <span>
                        {chartConfig[name as keyof typeof chartConfig].label} ·{" "}
                        <span className="font-semibold tabular-nums">
                          {value}%
                        </span>
                      </span>
                    )}
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="share"
                nameKey="device"
                cy="88%"
                startAngle={180}
                endAngle={0}
                innerRadius="105%"
                outerRadius="150%"
                paddingAngle={1.5}
                cornerRadius={4}
                stroke="none"
              />
            </PieChart>
          </ChartContainer>
          <div className="pointer-events-none absolute inset-x-0 bottom-[12%] flex flex-col items-center text-center">
            <span className="text-2xl font-semibold tracking-tight tabular-nums">
              100%
            </span>
            <span className="text-xs text-label-secondary">last 24 hours</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
