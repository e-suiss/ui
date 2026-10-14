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

const devices = [
  { name: "Phone", level: 82 },
  { name: "Earbuds", level: 46 },
  { name: "Watch", level: 18 },
  { name: "Case", level: 100 },
]

const LOW = 20

function Battery({ name, level }: { name: string; level: number }) {
  const chartConfig = {
    level: { label: name, color: level <= LOW ? "var(--red)" : "var(--green)" },
  } satisfies ChartConfig

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative size-16">
        <ChartContainer
          config={chartConfig}
          aria-hidden
          className="aspect-square size-full"
        >
          <RadialBarChart
            accessibilityLayer={false}
            data={[{ level, fill: "var(--color-level)" }]}
            innerRadius="78%"
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
            barSize={6}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar
              dataKey="level"
              cornerRadius={6}
              isAnimationActive={false}
              background={{
                fill: "color-mix(in oklab, var(--color-level) 22%, transparent)",
              }}
            />
          </RadialBarChart>
        </ChartContainer>
        <span
          aria-hidden
          className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-label-secondary"
        >
          {name[0]}
        </span>
      </div>
      <span className="text-base font-semibold tabular-nums">{level}%</span>
      <span className="text-xs text-label-secondary">{name}</span>
    </div>
  )
}

export function RadialChartBatteries() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Batteries</CardTitle>
        <CardDescription>Charge left on each device</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="grid grid-cols-4 gap-2 py-4">
          {devices.map((device) => (
            <li key={device.name}>
              <Battery {...device} />
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
