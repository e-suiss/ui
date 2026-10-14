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
  ChartTooltip,
  ChartTooltipContent,
  XAxis,
  YAxis,
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
  desktop: { label: "Desktop", color: "blue" },
  mobile: { label: "Mobile", color: "teal" },
} satisfies ChartConfig

export function AreaChartStackedExpand() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Stacked to 100%</CardTitle>
        <CardDescription>Each month adds up to 100%</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          accessibilityLabel="Stacked to 100%"
          style={{ height: 192 }}
        >
          <AreaChart
            data={chartData}
            stackOffset="expand"
            margin={{ top: 10, right: 4, left: 12, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="2 4" />
            <XAxis
              dataKey="month"
              tickMargin={8}
              interval={0}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <YAxis
              orientation="right"
              tickMargin={6}
              width="auto"
              ticks={[0, 0.5, 1]}
              tickFormatter={(value: number) => `${Math.round(value * 100)}%`}
            />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <Area
              dataKey="mobile"
              type="natural"
              stackId="a"
              fillOpacity={0.35}
            />
            <Area
              dataKey="desktop"
              type="natural"
              stackId="a"
              fillOpacity={0.35}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
