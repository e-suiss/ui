"use client"

import { Line, LineChart, YAxis } from "recharts"

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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const chartData = [
  { time: "Nov", price: 142.1 },
  { time: "Dec", price: 148.6 },
  { time: "Jan", price: 145.2 },
  { time: "Feb", price: 151.8 },
  { time: "Mar", price: 158.4 },
  { time: "Apr", price: 154.9 },
  { time: "May", price: 161.3 },
  { time: "Jun", price: 167.7 },
  { time: "Jul", price: 163.2 },
  { time: "Aug", price: 170.5 },
  { time: "Sep", price: 176.1 },
  { time: "Oct", price: 182.4 },
]

const chartConfig = {
  price: { label: "Price", color: "var(--chart-1)" },
} satisfies ChartConfig

export function StockPerformance() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>NWND</CardTitle>
        <CardDescription>Northwind Holdings</CardDescription>
        <CardAction>
          <Badge variant="secondary">
            <IconPlaceholder
              phosphor="ArrowUpRightIcon"
              lucide="ArrowUpRightIcon"
              tabler="IconArrowUpRight"
              hugeicons="ArrowUpRight01Icon"
              remixicon="RiArrowRightUpLine"
              data-icon="inline-start"
            />
            28.4%
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold tracking-tight tabular-nums">
            $182.40
          </span>
          <span className="text-sm text-muted-foreground tabular-nums">
            +$40.30 past year
          </span>
        </div>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-32 w-full"
        >
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 4, right: 4, left: 4, bottom: 4 }}
          >
            <YAxis hide domain={["dataMin - 4", "dataMax + 4"]} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Line
              dataKey="price"
              type="monotone"
              stroke="var(--color-price)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
        <ToggleGroup
          spacing={0}
          multiple={false}
          defaultValue={["1y"]}
          aria-label="Range"
          className="w-full *:flex-1"
        >
          <ToggleGroupItem value="1d">1D</ToggleGroupItem>
          <ToggleGroupItem value="1w">1W</ToggleGroupItem>
          <ToggleGroupItem value="1m">1M</ToggleGroupItem>
          <ToggleGroupItem value="1y">1Y</ToggleGroupItem>
        </ToggleGroup>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-3">
        <Separator />
        <div className="grid grid-cols-3 gap-2 text-sm">
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">Open</span>
            <span className="font-medium tabular-nums">$180.95</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">Day high</span>
            <span className="font-medium tabular-nums">$183.12</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-muted-foreground">Volume</span>
            <span className="font-medium tabular-nums">4.2M</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
