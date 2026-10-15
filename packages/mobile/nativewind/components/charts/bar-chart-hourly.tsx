import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Bar,
  BarChart,
  CartesianGrid,
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ReferenceLine,
  XAxis,
  YAxis,
} from "@/components/ui/chart"
import { Text } from "@/components/ui/text"

const chartData = [
  4, 0, 0, 0, 0, 0, 6, 18, 27, 22, 19, 21, 30, 26, 23, 17, 22, 26, 31, 39, 42,
  47, 35, 18,
].map((minutes, hour) => ({ hour, minutes }))

const chartConfig = {
  minutes: { label: "Screen time", color: "chart-1" },
} satisfies ChartConfig

const total = chartData.reduce((sum, item) => sum + item.minutes, 0)
const average = total / chartData.length

export function BarChartHourly() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader className="gap-0.5">
        <Text className="text-sm font-semibold text-primary">Screen time</Text>
        <Text className="text-3xl font-semibold tracking-tight tabular-nums">
          {`${Math.floor(total / 60)}h ${total % 60}m`}
        </Text>
        <Text className="text-sm text-muted-foreground">
          Today · hour by hour
        </Text>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          accessibilityLabel="Screen time"
          className="h-40 w-full"
        >
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 4, left: 12, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="2 4" />
            <XAxis
              dataKey="hour"
              tickMargin={8}
              ticks={[0, 6, 12, 18]}
              interval={0}
              tickFormatter={(value) => `${value}:00`}
            />
            <YAxis
              orientation="right"
              tickMargin={6}
              width="auto"
              tickCount={3}
              tickFormatter={(value) => `${value} min`}
            />
            <ReferenceLine
              y={average}
              stroke="green-500"
              strokeDasharray="3 3"
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideIndicator
                  labelFormatter={(_, payload) =>
                    `${String(payload[0]?.payload.hour)}:00`
                  }
                  formatter={(value) => (
                    <Text className="font-semibold tabular-nums">
                      {`${String(value)} min`}
                    </Text>
                  )}
                />
              }
            />
            <Bar
              dataKey="minutes"
              fill="chart-1"
              radius={[3, 3, 0, 0]}
              maxBarSize={8}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
