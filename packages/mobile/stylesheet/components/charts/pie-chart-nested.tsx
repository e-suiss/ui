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
  phone: { label: "Phone", color: "chart-1" },
  laptop: { label: "Laptop", color: "chart-2" },
  tablet: { label: "Tablet", color: "chart-3" },
  watch: { label: "Watch", color: "chart-4" },
  other: { label: "Other", color: "chart-5" },
} satisfies ChartConfig

const groups = [
  { device: "phone", users: 475 },
  { device: "watch", users: 450 },
]

export function PieChartNested() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Nested</CardTitle>
        <CardDescription>Groups inside, details outside</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          accessibilityLabel="Nested"
          style={{ height: 208 }}
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="device" />}
            />
            <Pie
              data={groups}
              dataKey="users"
              nameKey="device"
              outerRadius="52%"
              stroke="muted"
              strokeWidth={2}
              fillOpacity={0.55}
            />
            <Pie
              data={chartData}
              dataKey="users"
              nameKey="device"
              innerRadius="60%"
              outerRadius="86%"
              stroke="muted"
              strokeWidth={2}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
