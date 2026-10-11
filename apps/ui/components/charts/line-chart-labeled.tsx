"use client"

import { LabelList, Line, LineChart, XAxis } from "recharts"

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
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 173, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 264, mobile: 140 },
]

const chartConfig = {
  desktop: { label: "Desktop", color: "var(--blue)" },
} satisfies ChartConfig

export function LineChartLabeled() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Labeled</CardTitle>
        <CardDescription>Every point shows its value</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-48 w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 24, right: 16, left: 16, bottom: 0 }}
          >
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Line
              dataKey="desktop"
              type="natural"
              stroke="var(--color-desktop)"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "var(--color-desktop)", strokeWidth: 0 }}
            >
              <LabelList
                position="top"
                offset={10}
                className="fill-label font-semibold"
                fontSize={12}
              />
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
