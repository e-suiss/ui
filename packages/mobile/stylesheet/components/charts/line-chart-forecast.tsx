import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  CartesianGrid,
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Line,
  LineChart,
  ReferenceArea,
  XAxis,
} from "@/components/ui/chart"

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

const actual = [12, 14, 13, 17, 19, 22, 24, 23, 26]
const forecast = [26, 28, 30, 33]

const chartData = MONTHS.map((month, index) => ({
  month,
  actual: actual[index] ?? null,
  forecast: index >= 8 ? (forecast[index - 8] ?? null) : null,
}))

const chartConfig = {
  actual: { label: "Actual", color: "blue" },
  forecast: { label: "Forecast", color: "blue" },
} satisfies ChartConfig

export function LineChartForecast() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Actual and forecast</CardTitle>
        <CardDescription>The dashed line is the forecast</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          accessibilityLabel="Actual and forecast"
          style={{ height: 192 }}
        >
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 12, left: 12, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="2 4" />
            <XAxis dataKey="month" tickMargin={8} interval={2} />
            <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
            <ReferenceArea x1="Sep" x2="Dec" fill="control" fillOpacity={0.6} />
            <Line dataKey="actual" type="monotone" strokeWidth={2.5} />
            <Line
              dataKey="forecast"
              type="monotone"
              strokeWidth={2.5}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
