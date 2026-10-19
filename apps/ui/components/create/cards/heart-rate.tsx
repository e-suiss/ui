"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  Card,
  CardAction,
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const chartData = [
  { time: "12 AM", bpm: 58 },
  { time: "2 AM", bpm: 54 },
  { time: "4 AM", bpm: 52 },
  { time: "6 AM", bpm: 61 },
  { time: "8 AM", bpm: 84 },
  { time: "10 AM", bpm: 76 },
  { time: "12 PM", bpm: 92 },
  { time: "2 PM", bpm: 78 },
  { time: "4 PM", bpm: 118 },
  { time: "6 PM", bpm: 96 },
  { time: "8 PM", bpm: 72 },
  { time: "10 PM", bpm: 64 },
]

const chartConfig = {
  bpm: { label: "BPM", color: "var(--chart-1)" },
} satisfies ChartConfig

export function HeartRate() {
  const id = React.useId()
  return (
    <Card>
      <CardHeader>
        <CardTitle>Heart rate</CardTitle>
        <CardDescription>Latest 68 BPM · 4 min ago</CardDescription>
        <CardAction>
          <ToggleGroup
            spacing={0}
            size="sm"
            multiple={false}
            defaultValue={["day"]}
            aria-label="Range"
          >
            <ToggleGroupItem value="day">D</ToggleGroupItem>
            <ToggleGroupItem value="week">W</ToggleGroupItem>
            <ToggleGroupItem value="month">M</ToggleGroupItem>
          </ToggleGroup>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <IconPlaceholder
              lucide="HeartIcon"
              tabler="IconHeart"
              hugeicons="FavouriteIcon"
              phosphor="HeartIcon"
              remixicon="RiHeartLine"
              className="size-4.5"
            />
          </div>
          <span className="cn-font-heading text-4xl font-semibold tracking-tight tabular-nums">
            74
          </span>
          <span className="text-sm text-muted-foreground">BPM average</span>
        </div>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-40 w-full"
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 8, right: 20, left: 20, bottom: 0 }}
          >
            <defs>
              <linearGradient id={`${id}-bpm`} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--color-bpm)"
                  stopOpacity={0.35}
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-bpm)"
                  stopOpacity={0.02}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="2 4" />
            <YAxis hide domain={[40, 130]} />
            <XAxis
              dataKey="time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              interval={3}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="bpm"
              type="monotone"
              stroke="var(--color-bpm)"
              strokeWidth={2}
              fill={`url(#${id}-bpm)`}
            />
          </AreaChart>
        </ChartContainer>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex flex-col gap-0.5 rounded-lg bg-muted px-3 py-2.5">
            <span className="text-xs text-muted-foreground">Min</span>
            <span className="text-lg font-semibold tabular-nums">52</span>
          </div>
          <div className="flex flex-col gap-0.5 rounded-lg bg-muted px-3 py-2.5">
            <span className="text-xs text-muted-foreground">Resting</span>
            <span className="text-lg font-semibold tabular-nums">58</span>
          </div>
          <div className="flex flex-col gap-0.5 rounded-lg bg-muted px-3 py-2.5">
            <span className="text-xs text-muted-foreground">Max</span>
            <span className="text-lg font-semibold tabular-nums">118</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
