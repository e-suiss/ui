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
  Pie,
  PieChart,
} from "@/components/ui/chart"

const chartData = [
  { device: "phone", users: 275 },
  { device: "laptop", users: 200 },
  { device: "tablet", users: 187 },
  { device: "watch", users: 173 },
  { device: "other", users: 90 },
]

const chartConfig = {
  users: { label: "Users" },
  phone: { label: "Phone", color: "chart-1" },
  laptop: { label: "Laptop", color: "chart-2" },
  tablet: { label: "Tablet", color: "chart-3" },
  watch: { label: "Watch", color: "chart-4" },
  other: { label: "Other", color: "chart-5" },
} satisfies ChartConfig

export function PieChartLegend() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>With a legend</CardTitle>
        <CardDescription>What each color means</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          accessibilityLabel="With a legend"
          className="h-60 w-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="device" />}
            />
            <ChartLegend content={<ChartLegendContent nameKey="device" />} />
            <Pie
              data={chartData}
              dataKey="users"
              nameKey="device"
              cy="45%"
              innerRadius="50%"
              outerRadius="78%"
              strokeWidth={0}
              paddingAngle={1}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
