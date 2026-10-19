"use client"

import { Bar, BarChart, CartesianGrid, ReferenceLine, XAxis } from "recharts"
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
import { Separator } from "@/components/ui/separator"

const chartData = [
  { day: "Mon", hours: 6.8 },
  { day: "Tue", hours: 7.4 },
  { day: "Wed", hours: 6.2 },
  { day: "Thu", hours: 7.9 },
  { day: "Fri", hours: 6.5 },
  { day: "Sat", hours: 8.6 },
  { day: "Sun", hours: 7.7 },
]

const chartConfig = {
  hours: { label: "Hours", color: "var(--chart-3)" },
} satisfies ChartConfig

export function SleepReport() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sleep</CardTitle>
        <CardDescription>Oct 13 – Oct 19</CardDescription>
        <CardAction>
          <Badge variant="secondary">
            <IconPlaceholder
              lucide="ArrowUpIcon"
              tabler="IconArrowUp"
              hugeicons="ArrowUp02Icon"
              phosphor="ArrowUpIcon"
              remixicon="RiArrowUpLine"
            />
            24 min
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-baseline gap-1.5">
          <span className="cn-font-heading text-4xl font-semibold tracking-tight tabular-nums">
            7h 18m
          </span>
          <span className="text-sm text-muted-foreground">avg per night</span>
        </div>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-40 w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="2 4" />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={0}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <ReferenceLine
              y={8}
              stroke="var(--muted-foreground)"
              strokeDasharray="3 3"
            />
            <Bar
              dataKey="hours"
              fill="var(--color-hours)"
              radius={6}
              maxBarSize={28}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-3">
        <Separator />
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">Bedtime</span>
            <span className="font-medium tabular-nums">11:12 PM</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">Wake up</span>
            <span className="font-medium tabular-nums">6:34 AM</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-xs text-muted-foreground">Goal</span>
            <span className="font-medium tabular-nums">8h</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
