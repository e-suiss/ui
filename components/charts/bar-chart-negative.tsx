"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  XAxis,
} from "recharts"

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
  { month: "January", flow: 42 },
  { month: "February", flow: -18 },
  { month: "March", flow: 26 },
  { month: "April", flow: 55 },
  { month: "May", flow: -31 },
  { month: "June", flow: 12 },
  { month: "July", flow: 38 },
  { month: "August", flow: -9 },
  { month: "September", flow: 47 },
  { month: "October", flow: 21 },
  { month: "November", flow: -14 },
  { month: "December", flow: 60 },
]

const chartConfig = {
  flow: { label: "Cash flow" },
} satisfies ChartConfig

export function BarChartNegative() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Positive and negative</CardTitle>
        <CardDescription>Monthly cash flow · thousands</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-48 w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 10, right: 4, left: 4, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="2 4" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={1}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <ReferenceLine y={0} stroke="var(--separator-strong)" />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideIndicator />}
            />
            <Bar dataKey="flow" radius={4} maxBarSize={18}>
              {chartData.map((item) => (
                <Cell
                  key={item.month}
                  fill={item.flow >= 0 ? "var(--green)" : "var(--red)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
