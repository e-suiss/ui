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
import { fontSize, useTheme } from "@/components/ui/theme"

const chartConfig = {
  users: { label: "Users" },
  phone: { label: "Phone", color: "blue" },
  laptop: { label: "Laptop", color: "teal" },
  tablet: { label: "Tablet", color: "indigo" },
  watch: { label: "Watch", color: "orange" },
} satisfies ChartConfig

type Device = "phone" | "laptop" | "tablet" | "watch"

const chartData: { device: Device; users: number }[] = [
  { device: "phone", users: 275 },
  { device: "laptop", users: 200 },
  { device: "tablet", users: 187 },
  { device: "watch", users: 173 },
]

export function RadialChartLabel() {
  const { colors } = useTheme()
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
          style={{ height: 208 }}
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
              background={{ fill: "control" }}
            >
              {chartData.map((item) => (
                <Cell key={item.device} fill={chartConfig[item.device].color} />
              ))}
              <LabelList
                dataKey="device"
                position="insideStart"
                style={{
                  ...fontSize["2xs"],
                  fontWeight: "600",
                  color: colors.onAccent,
                }}
                formatter={(value) => chartConfig[value as Device]?.label}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
