"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Badge } from "@/components/ui/badge"
import {
  Card,
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
  { date: "Sep 20", visits: 1820 },
  { date: "Sep 21", visits: 1940 },
  { date: "Sep 22", visits: 1710 },
  { date: "Sep 23", visits: 2050 },
  { date: "Sep 24", visits: 2210 },
  { date: "Sep 25", visits: 2140 },
  { date: "Sep 26", visits: 1880 },
  { date: "Sep 27", visits: 1760 },
  { date: "Sep 28", visits: 2090 },
  { date: "Sep 29", visits: 2320 },
  { date: "Sep 30", visits: 2410 },
  { date: "Oct 1", visits: 2280 },
  { date: "Oct 2", visits: 2190 },
  { date: "Oct 3", visits: 1980 },
  { date: "Oct 4", visits: 2160 },
  { date: "Oct 5", visits: 2440 },
  { date: "Oct 6", visits: 2610 },
  { date: "Oct 7", visits: 2530 },
  { date: "Oct 8", visits: 2380 },
  { date: "Oct 9", visits: 2290 },
  { date: "Oct 10", visits: 2470 },
  { date: "Oct 11", visits: 2720 },
  { date: "Oct 12", visits: 2860 },
  { date: "Oct 13", visits: 2690 },
  { date: "Oct 14", visits: 2580 },
  { date: "Oct 15", visits: 2740 },
  { date: "Oct 16", visits: 2950 },
  { date: "Oct 17", visits: 3080 },
  { date: "Oct 18", visits: 2970 },
  { date: "Oct 19", visits: 3140 },
]

const chartConfig = {
  visits: { label: "Visits", color: "var(--chart-1)" },
} satisfies ChartConfig

export function ProjectOverview() {
  const id = React.useId()
  return (
    <Card>
      <CardHeader>
        <CardDescription>Project overview</CardDescription>
        <CardTitle className="flex items-center gap-2 text-3xl tabular-nums">
          72,418
          <Badge variant="secondary">
            <IconPlaceholder
              phosphor="ArrowUpRightIcon"
              lucide="ArrowUpRightIcon"
              tabler="IconArrowUpRight"
              hugeicons="ArrowUpRight01Icon"
              remixicon="RiArrowRightUpLine"
              data-icon="inline-start"
            />
            12.4%
          </Badge>
        </CardTitle>
        <CardDescription>Total visits in the last 30 days</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-40 w-full"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 8, right: 16, left: 16, bottom: 0 }}
          >
            <defs>
              <linearGradient id={`${id}-visits`} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-visits)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-visits)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="2 4" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              ticks={["Sep 23", "Oct 3", "Oct 13"]}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="visits"
              type="natural"
              stroke="var(--color-visits)"
              strokeWidth={2}
              fill={`url(#${id}-visits)`}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-3">
        <Separator />
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">Visitors</span>
            <span className="font-medium tabular-nums">18,204</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">Sign-ups</span>
            <span className="font-medium tabular-nums">1,326</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">Conversion</span>
            <span className="font-medium tabular-nums">7.3%</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
