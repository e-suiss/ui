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

const chartData = [{ name: "value", value: 72, fill: "var(--color-value)" }]

const chartConfig = {
  value: { label: "Used", color: "var(--blue)" },
} satisfies ChartConfig

export function RadialChartText() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Value in the middle</CardTitle>
        <CardDescription>A single percentage</CardDescription>
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
              startAngle={90}
              endAngle={-270}
              barSize={16}
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
          <div className="pointer-events-none absolute inset-0 justify-center flex flex-col items-center text-center">
            <span className="text-3xl font-semibold tracking-tight tabular-nums">
              72%
            </span>
            <span className="text-xs text-label-secondary">
              cloud storage used
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
