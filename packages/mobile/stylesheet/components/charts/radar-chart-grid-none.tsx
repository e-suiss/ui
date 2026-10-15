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

export function RadarChartGridNone() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>No grid</CardTitle>
        <CardDescription>Just the shape</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          accessibilityLabel="No grid"
          style={{ height: 224 }}
        >
          <RadarChart data={chartData} outerRadius="70%">
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <PolarAngleAxis dataKey="skill" />
            <Radar dataKey="thisMonth" fillOpacity={0.55} stroke="none" />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
