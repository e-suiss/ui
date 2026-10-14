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
  phone: { label: "Phone", color: "blue" },
  laptop: { label: "Laptop", color: "teal" },
  tablet: { label: "Tablet", color: "indigo" },
  watch: { label: "Watch", color: "orange" },
  other: { label: "Other", color: "gray" },
} satisfies ChartConfig

export function PieChartDonut() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Donut</CardTitle>
        <CardDescription>A hole in the middle</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          accessibilityLabel="Donut"
          className="h-52 w-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="device" />}
            />
            <Pie
              data={chartData}
              dataKey="users"
              nameKey="device"
              innerRadius="58%"
              outerRadius="85%"
              strokeWidth={0}
              paddingAngle={1}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
