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
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
} from "@/components/ui/chart"

const MAX = 320

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

export function RadialChartTinted() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Tinted track</CardTitle>
        <CardDescription>
          The unfilled part keeps a soft tint of its color
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          accessibilityLabel="Tinted track"
          style={{ height: 208 }}
        >
          <RadialBarChart
            data={chartData}
            innerRadius="25%"
            outerRadius="100%"
            barSize={12}
          >
            <PolarAngleAxis domain={[0, MAX]} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="device" />}
            />
            <RadialBar
              isAnimationActive={false}
              dataKey="users"
              cornerRadius={10}
              background={{ fillOpacity: 0.22 }}
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
