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
  ChartLegend,
  ChartLegendContent,
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

export function RadarChartLegend() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>With a legend</CardTitle>
        <CardDescription>Series listed below</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          accessibilityLabel="With a legend"
          style={{ height: 240 }}
        >
          <RadarChart data={chartData} cy="45%" outerRadius="62%">
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <ChartLegend content={<ChartLegendContent />} />
            <PolarGrid />
            <PolarAngleAxis dataKey="skill" />
            <Radar dataKey="lastMonth" fillOpacity={0.2} strokeWidth={2} />
            <Radar dataKey="thisMonth" fillOpacity={0.2} strokeWidth={2} />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
