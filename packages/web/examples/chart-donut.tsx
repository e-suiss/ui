import { Pie, PieChart } from "recharts"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const browsers = [
  { browser: "safari", visitors: 275, fill: "var(--color-safari)" },
  { browser: "chrome", visitors: 200, fill: "var(--color-chrome)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]

const browsersConfig = {
  visitors: { label: "Visitors" },
  safari: { label: "Safari", color: "var(--chart-1)" },
  chrome: { label: "Chrome", color: "var(--color-green-500)" },
  firefox: { label: "Firefox", color: "var(--chart-4)" },
  edge: { label: "Edge", color: "var(--color-purple-500)" },
  other: { label: "Other", color: "var(--color-red-500)" },
} satisfies ChartConfig

export default function ChartDonut() {
  return (
    <div className="w-[min(32rem,calc(100vw-2rem))]">
      <ChartContainer
        config={browsersConfig}
        className="mx-auto aspect-square w-full max-w-72"
      >
        {
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={browsers}
              dataKey="visitors"
              nameKey="browser"
              innerRadius={60}
              strokeWidth={4}
            />
            <ChartLegend content={<ChartLegendContent nameKey="browser" />} />
          </PieChart>
        }
      </ChartContainer>
    </div>
  )
}
