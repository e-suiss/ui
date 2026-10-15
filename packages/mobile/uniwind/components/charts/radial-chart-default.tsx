import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Cell,
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  RadialBar,
  RadialBarChart,
} from "@/components/ui/chart"

const chartConfig = {
  users: { label: "Users" },
  phone: { label: "Phone", color: "chart-1" },
  laptop: { label: "Laptop", color: "chart-2" },
  tablet: { label: "Tablet", color: "chart-3" },
  watch: { label: "Watch", color: "chart-4" },
} satisfies ChartConfig

type Device = "phone" | "laptop" | "tablet" | "watch"

const chartData: { device: Device; users: number }[] = [
  { device: "phone", users: 275 },
  { device: "laptop", users: 200 },
  { device: "tablet", users: 187 },
  { device: "watch", users: 173 },
]

export function RadialChartDefault() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Radial chart</CardTitle>
        <CardDescription>Users by device</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          accessibilityLabel="Radial chart"
          className="h-52 w-full"
        >
          <RadialBarChart
            data={chartData}
            innerRadius="25%"
            outerRadius="100%"
            barSize={12}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="device" />}
            />
            <RadialBar
              dataKey="users"
              background={{ fill: "secondary" }}
              cornerRadius={10}
            >
              {chartData.map((item) => (
                <Cell key={item.device} fill={chartConfig[item.device].color} />
              ))}
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
