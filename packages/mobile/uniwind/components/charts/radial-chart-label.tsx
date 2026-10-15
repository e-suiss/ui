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
  LabelList,
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

export function RadialChartLabel() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Labeled</CardTitle>
        <CardDescription>
          Each name sits at the start of its bar
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          accessibilityLabel="Labeled"
          className="h-52 w-full"
        >
          <RadialBarChart
            data={chartData}
            innerRadius="28%"
            outerRadius="100%"
            barSize={16}
            startAngle={90}
            endAngle={-200}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="device" />}
            />
            <RadialBar
              dataKey="users"
              cornerRadius={10}
              background={{ fill: "secondary" }}
            >
              {chartData.map((item) => (
                <Cell key={item.device} fill={chartConfig[item.device].color} />
              ))}
              <LabelList
                dataKey="device"
                position="insideStart"
                className="text-2xs font-semibold text-primary-foreground"
                formatter={(value) => chartConfig[value as Device]?.label}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
