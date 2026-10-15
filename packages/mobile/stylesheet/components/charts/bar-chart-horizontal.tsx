import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Bar,
  BarChart,
  Cell,
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  XAxis,
  YAxis,
} from "@/components/ui/chart"

const chartConfig = {
  users: { label: "Users" },
  phone: { label: "Phone", color: "chart-1" },
  laptop: { label: "Laptop", color: "chart-2" },
  tablet: { label: "Tablet", color: "chart-3" },
  watch: { label: "Watch", color: "chart-4" },
  other: { label: "Other", color: "chart-5" },
} satisfies ChartConfig

type Device = "phone" | "laptop" | "tablet" | "watch" | "other"

const chartData: { device: Device; users: number }[] = [
  { device: "phone", users: 275 },
  { device: "laptop", users: 200 },
  { device: "tablet", users: 187 },
  { device: "watch", users: 173 },
  { device: "other", users: 90 },
]

export function BarChartHorizontal() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Horizontal</CardTitle>
        <CardDescription>Room for long category names</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          accessibilityLabel="Horizontal"
          style={{ height: 192 }}
        >
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
          >
            <YAxis
              dataKey="device"
              type="category"
              width="auto"
              tickFormatter={(value) => chartConfig[value as Device].label}
            />
            <XAxis type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="device" />}
            />
            <Bar dataKey="users" radius={5} barSize={18}>
              {chartData.map((item) => (
                <Cell key={item.device} fill={chartConfig[item.device].color} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
