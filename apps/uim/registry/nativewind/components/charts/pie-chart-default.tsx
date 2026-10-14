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

export function PieChartDefault() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Pie chart</CardTitle>
        <CardDescription>Users by device · thousands</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          accessibilityLabel="Pie chart"
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
              outerRadius="85%"
              stroke="surface-secondary"
              strokeWidth={2}
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
