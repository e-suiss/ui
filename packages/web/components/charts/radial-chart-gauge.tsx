"use client"

import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { type ChartConfig, ChartContainer } from "@/components/ui/chart"

const chartData = [{ name: "value", value: 38, fill: "var(--color-value)" }]

const chartConfig = {
  value: { label: "Air quality", color: "var(--green)" },
} satisfies ChartConfig

export function RadialChartGauge() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Gauge</CardTitle>
        <CardDescription>Air quality index</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-52 w-full"
          >
            <RadialBarChart
              accessibilityLayer
              data={chartData}
              innerRadius="72%"
              outerRadius="100%"
              startAngle={210}
              endAngle={-30}
              barSize={14}
            >
              <PolarAngleAxis
                type="number"
                domain={[0, 100]}
                tick={false}
                axisLine={false}
              />
              <RadialBar
                dataKey="value"
                cornerRadius={20}
                background={{
                  fill: "color-mix(in oklab, var(--color-value) 22%, transparent)",
                }}
              />
            </RadialBarChart>
          </ChartContainer>
          <div className="pointer-events-none absolute inset-x-0 top-[44%] justify-center flex flex-col items-center text-center">
            <span className="text-3xl font-semibold tracking-tight tabular-nums">
              38
            </span>
            <span className="text-xs text-label-secondary">Good</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
