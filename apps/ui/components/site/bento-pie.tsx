"use client"

import { Pie, PieChart } from "recharts"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export function BentoPie({
  config,
  pieces,
}: {
  config: ChartConfig
  pieces: { kind: string; count: number; fill: string }[]
}) {
  return (
    <ChartContainer
      config={config}
      className="aspect-square w-full max-w-90 justify-self-center [&_.recharts-pie-sector]:origin-center [&_.recharts-pie-sector]:cursor-pointer [&_.recharts-pie-sector]:transition-[scale] [&_.recharts-pie-sector]:duration-500 [&_.recharts-pie-sector]:ease-[cubic-bezier(0.32,0.08,0.24,1)] [&_.recharts-pie-sector]:[transform-box:view-box] [&_.recharts-pie-sector:hover]:scale-[1.06] [&_svg]:overflow-visible"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          isAnimationActive={false}
          content={<ChartTooltipContent hideLabel nameKey="kind" />}
        />
        <Pie
          data={pieces}
          dataKey="count"
          nameKey="kind"
          innerRadius="56%"
          outerRadius="94%"
          strokeWidth={0}
          paddingAngle={1.5}
          cornerRadius={6}
        />
      </PieChart>
    </ChartContainer>
  )
}
