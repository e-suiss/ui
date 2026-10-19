"use client"

import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { type ChartConfig, ChartContainer } from "@/components/ui/chart"

const chartData = [
  { ring: "stand", value: 83, fill: "var(--color-stand)" },
  { ring: "exercise", value: 70, fill: "var(--color-exercise)" },
  { ring: "move", value: 87, fill: "var(--color-move)" },
]

const chartConfig = {
  value: { label: "Progress" },
  move: { label: "Move", color: "var(--chart-1)" },
  exercise: { label: "Exercise", color: "var(--chart-2)" },
  stand: { label: "Stand", color: "var(--chart-3)" },
} satisfies ChartConfig

export function ActivityRings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity</CardTitle>
        <CardDescription>Today, 6:40 PM</CardDescription>
        <CardAction>
          <Badge variant="secondary">
            <IconPlaceholder
              lucide="FlameIcon"
              tabler="IconFlame"
              hugeicons="FireIcon"
              phosphor="FlameIcon"
              remixicon="RiFireLine"
            />
            12 day streak
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square h-48"
        >
          <RadialBarChart
            data={chartData}
            startAngle={90}
            endAngle={-270}
            innerRadius="38%"
            outerRadius="100%"
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
              background={{ fill: "var(--muted)" }}
              cornerRadius={10}
            />
          </RadialBarChart>
        </ChartContainer>
        <div className="grid grid-cols-3 divide-x rounded-xl border">
          <div className="flex flex-col gap-1 px-3 py-2.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-2 rounded-full bg-chart-1" />
              Move
            </div>
            <span className="text-lg font-semibold tabular-nums">520</span>
            <span className="text-xs text-muted-foreground tabular-nums">
              of 600 kcal
            </span>
          </div>
          <div className="flex flex-col gap-1 px-3 py-2.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-2 rounded-full bg-chart-2" />
              Exercise
            </div>
            <span className="text-lg font-semibold tabular-nums">21</span>
            <span className="text-xs text-muted-foreground tabular-nums">
              of 30 min
            </span>
          </div>
          <div className="flex flex-col gap-1 px-3 py-2.5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="size-2 rounded-full bg-chart-3" />
              Stand
            </div>
            <span className="text-lg font-semibold tabular-nums">10</span>
            <span className="text-xs text-muted-foreground tabular-nums">
              of 12 hr
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
