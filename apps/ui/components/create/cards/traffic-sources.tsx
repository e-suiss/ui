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
import { Separator } from "@/components/ui/separator"

const chartData = [
  { source: "search", visits: 4820, fill: "var(--color-search)" },
  { source: "direct", visits: 3150, fill: "var(--color-direct)" },
  { source: "social", visits: 2240, fill: "var(--color-social)" },
  { source: "referral", visits: 1380, fill: "var(--color-referral)" },
  { source: "email", visits: 910, fill: "var(--color-email)" },
]

const chartConfig = {
  visits: { label: "Visits" },
  search: { label: "Search", color: "var(--chart-1)" },
  direct: { label: "Direct", color: "var(--chart-2)" },
  social: { label: "Social", color: "var(--chart-3)" },
  referral: { label: "Referral", color: "var(--chart-4)" },
  email: { label: "Email", color: "var(--chart-5)" },
} satisfies ChartConfig

export function TrafficSources() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Traffic sources</CardTitle>
        <CardDescription>Where visits came from this month</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="relative">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-48 w-full"
          >
            <PieChart accessibilityLayer>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel nameKey="source" />}
              />
              <Pie
                data={chartData}
                dataKey="visits"
                nameKey="source"
                innerRadius="64%"
                outerRadius="90%"
                strokeWidth={0}
                paddingAngle={2}
                cornerRadius={4}
              />
            </PieChart>
          </ChartContainer>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-semibold tracking-tight tabular-nums">
              12,500
            </span>
            <span className="text-xs text-muted-foreground">visits</span>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col gap-2.5 text-sm">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-(--chart-1)" />
            <span className="flex-1">Search</span>
            <span className="text-muted-foreground tabular-nums">4,820</span>
            <span className="w-10 text-end font-medium tabular-nums">39%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-(--chart-2)" />
            <span className="flex-1">Direct</span>
            <span className="text-muted-foreground tabular-nums">3,150</span>
            <span className="w-10 text-end font-medium tabular-nums">25%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-(--chart-3)" />
            <span className="flex-1">Social</span>
            <span className="text-muted-foreground tabular-nums">2,240</span>
            <span className="w-10 text-end font-medium tabular-nums">18%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-(--chart-4)" />
            <span className="flex-1">Referral</span>
            <span className="text-muted-foreground tabular-nums">1,380</span>
            <span className="w-10 text-end font-medium tabular-nums">11%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-(--chart-5)" />
            <span className="flex-1">Email</span>
            <span className="text-muted-foreground tabular-nums">910</span>
            <span className="w-10 text-end font-medium tabular-nums">7%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
