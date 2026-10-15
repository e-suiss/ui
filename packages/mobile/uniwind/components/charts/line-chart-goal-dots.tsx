import { View } from "react-native"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  CartesianGrid,
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "@/components/ui/chart"
import { Text } from "@/components/ui/text"

const GOAL = 7

const chartData = [
  { day: "Mon", hours: 6.8 },
  { day: "Tue", hours: 7.4 },
  { day: "Wed", hours: 5.9 },
  { day: "Thu", hours: 7.9 },
  { day: "Fri", hours: 6.4 },
  { day: "Sat", hours: 8.6 },
  { day: "Sun", hours: 7.2 },
]

const chartConfig = {
  hours: { label: "Sleep", color: "chart-3" },
} satisfies ChartConfig

function formatHours(hours: number) {
  const minutes = Math.round(hours * 60)
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
}

export function LineChartGoalDots() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader className="gap-0.5">
        <Text className="text-sm font-semibold text-indigo-500">Sleep</Text>
        <View className="flex-row items-baseline gap-1">
          <Text className="text-3xl font-semibold tracking-tight tabular-nums">
            7h 9m
          </Text>
        </View>
        <Text className="text-sm text-muted-foreground">
          Goal 7 hours · green nights met it
        </Text>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          accessibilityLabel="Sleep"
          className="h-40 w-full"
        >
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 4, left: 16, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="2 4" />
            <XAxis dataKey="day" tickMargin={8} interval={0} />
            <YAxis
              orientation="right"
              tickMargin={6}
              width="auto"
              domain={[5, 9]}
              ticks={[5, 7, 9]}
              tickFormatter={(value: number) => `${value}h`}
            />
            <ReferenceLine y={GOAL} stroke="green-500" strokeDasharray="3 3" />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideIndicator
                  formatter={(value) => (
                    <Text className="font-semibold tabular-nums">
                      {formatHours(Number(value))}
                    </Text>
                  )}
                />
              }
            />
            <Line
              dataKey="hours"
              type="monotone"
              strokeWidth={2}
              dot={({ index }) => ({
                r: 4.5,
                fill:
                  (chartData[index]?.hours ?? 0) >= GOAL
                    ? "green-500"
                    : "chart-4",
                stroke: "muted",
                strokeWidth: 2,
              })}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
