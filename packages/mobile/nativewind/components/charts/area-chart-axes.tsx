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
  desktop: { label: "Desktop", color: "chart-1" },
} satisfies ChartConfig

export function AreaChartAxes() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>With axes</CardTitle>
        <CardDescription>A value axis on the right</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          accessibilityLabel="With axes"
          className="h-48 w-full"
        >
          <AreaChart
            data={chartData}
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
              tickCount={4}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              dataKey="desktop"
              type="monotone"
              strokeWidth={2}
              fill={{
                stops: [
                  { offset: 0, opacity: 0.38 },
                  { offset: 1, opacity: 0.02 },
                ],
              }}
              dot={{ r: 3 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
