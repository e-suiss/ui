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
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
} from "@/components/ui/chart"

const chartData = [
  { skill: "Cardio", thisMonth: 86, lastMonth: 72 },
  { skill: "Strength", thisMonth: 62, lastMonth: 58 },
  { skill: "Flexibility", thisMonth: 48, lastMonth: 55 },
  { skill: "Balance", thisMonth: 70, lastMonth: 60 },
  { skill: "Endurance", thisMonth: 80, lastMonth: 66 },
  { skill: "Speed", thisMonth: 74, lastMonth: 70 },
]

const chartConfig = {
  thisMonth: { label: "This month", color: "green-500" },
  lastMonth: { label: "Last month", color: "chart-5" },
} satisfies ChartConfig

export function RadarChartGridFilled() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Filled grid</CardTitle>
        <CardDescription>Shaded rings</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          accessibilityLabel="Filled grid"
          className="h-56 w-full"
        >
          <RadarChart data={chartData} outerRadius="70%">
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <PolarGrid
              gridType="circle"
              fill="secondary"
              fillOpacity={0.5}
              stroke="muted"
              strokeWidth={2}
            />
            <PolarAngleAxis dataKey="skill" />
            <Radar dataKey="thisMonth" fillOpacity={0.45} strokeWidth={0} />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
