import { View } from "react-native"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Area,
  CartesianGrid,
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ComposedChart,
  Line,
  XAxis,
  YAxis,
} from "@/components/ui/chart"
import { Text } from "@/components/ui/text"

const readings: [low: number, high: number, average: number][] = [
  [48, 62, 54],
  [46, 60, 52],
  [47, 64, 54],
  [45, 61, 52],
  [48, 63, 55],
  [46, 66, 54],
  [56, 78, 64],
  [58, 82, 66],
  [64, 88, 74],
  [66, 90, 76],
  [64, 92, 74],
  [66, 89, 75],
  [65, 94, 76],
  [66, 90, 75],
  [64, 88, 74],
  [65, 91, 76],
  [66, 92, 75],
  [68, 96, 78],
  [104, 158, 126],
  [102, 150, 122],
  [70, 94, 78],
  [66, 90, 74],
  [60, 82, 68],
  [52, 70, 58],
]

const chartData = readings.map(([low, high, average], hour) => ({
  hour: `${hour}:00`,
  range: [low, high] as const,
  average,
}))

const chartConfig = {
  range: { label: "Range", color: "red" },
  average: { label: "Average", color: "red" },
} satisfies ChartConfig

const low = Math.min(...chartData.map((point) => point.range[0]))
const high = Math.max(...chartData.map((point) => point.range[1]))

export function AreaChartRange() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader className="gap-0.5">
        <Text className="text-sm font-semibold text-danger">Heart rate</Text>
        <View className="flex-row items-baseline gap-1">
          <Text className="text-3xl font-semibold tracking-tight tabular-nums">
            {low}–{high}
          </Text>
          <Text className="text-base font-semibold text-label-secondary">
            BPM
          </Text>
        </View>
        <Text className="text-sm text-label-secondary">Today</Text>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          accessibilityLabel="Heart rate"
          className="h-40 w-full"
        >
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 4, left: 16, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="2 4" />
            <XAxis dataKey="hour" tickMargin={8} interval={5} />
            <YAxis
              orientation="right"
              tickMargin={6}
              width="auto"
              domain={[40, 170]}
              ticks={[50, 100, 150]}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="line"
                  formatter={(value, name) => (
                    <View className="w-full flex-row justify-between gap-3">
                      <Text className="text-label-secondary">
                        {chartConfig[name as keyof typeof chartConfig].label}
                      </Text>
                      <Text className="font-semibold tabular-nums">
                        {typeof value === "number" ? value : value.join("–")}{" "}
                        BPM
                      </Text>
                    </View>
                  )}
                />
              }
            />
            <Area
              dataKey="range"
              type="monotone"
              stroke="none"
              fillOpacity={0.22}
            />
            <Line dataKey="average" type="monotone" strokeWidth={2} />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
