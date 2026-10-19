"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
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
  { month: "May", revenue: 18400 },
  { month: "Jun", revenue: 21200 },
  { month: "Jul", revenue: 19800 },
  { month: "Aug", revenue: 24600 },
  { month: "Sep", revenue: 27300 },
  { month: "Oct", revenue: 31900 },
]

const chartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-2)" },
} satisfies ChartConfig

export function Revenue() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Revenue</CardTitle>
        <CardDescription>May – October</CardDescription>
        <CardAction>
          <Badge variant="outline">
            <IconPlaceholder
              phosphor="ArrowUpIcon"
              lucide="ArrowUpIcon"
              tabler="IconArrowUp"
              hugeicons="ArrowUp02Icon"
              remixicon="RiArrowUpLine"
              data-icon="inline-start"
            />
            16.8%
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold tracking-tight tabular-nums">
            $143,200
          </span>
          <span className="text-sm text-muted-foreground">total</span>
        </div>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-44 w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="2 4" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={6} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-sm">
        <div className="font-medium">Up $4,600 from September</div>
        <div className="text-muted-foreground">
          Sixth month of steady growth in a row
        </div>
      </CardFooter>
    </Card>
  )
}
