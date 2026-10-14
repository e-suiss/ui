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
  thisMonth: { label: "This month", color: "green" },
  lastMonth: { label: "Last month", color: "gray" },
} satisfies ChartConfig

export function RadarChartMultiple() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Comparison</CardTitle>
        <CardDescription>This month and last month</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          accessibilityLabel="Comparison"
          className="h-56 w-full"
        >
          <RadarChart data={chartData} outerRadius="70%">
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <PolarGrid />
            <PolarAngleAxis dataKey="skill" />
            <Radar dataKey="lastMonth" fillOpacity={0.18} strokeWidth={2} />
            <Radar dataKey="thisMonth" fillOpacity={0.18} strokeWidth={2} />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
