import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Area,
  AreaChart,
  CartesianGrid,
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  XAxis,
} from "@/components/ui/chart"

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 173, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 264, mobile: 140 },
]

const chartConfig = {
  desktop: { label: "Desktop", color: "chart-1" },
  mobile: { label: "Mobile", color: "chart-2" },
} satisfies ChartConfig

export function AreaChartStacked() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Stacked</CardTitle>
        <CardDescription>Desktop and mobile combined</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          accessibilityLabel="Stacked"
          style={{ height: 192 }}
        >
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 12, left: 12, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="2 4" />
            <XAxis
              dataKey="month"
              tickMargin={8}
              interval={0}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Area
              dataKey="mobile"
              type="natural"
              stackId="a"
              strokeWidth={2}
              fillOpacity={0.2}
            />
            <Area
              dataKey="desktop"
              type="natural"
              stackId="a"
              strokeWidth={2}
              fillOpacity={0.2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
