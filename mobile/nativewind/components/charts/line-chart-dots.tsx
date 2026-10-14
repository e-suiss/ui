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
  XAxis,
  YAxis,
} from "@/components/ui/chart"
import { Text } from "@/components/ui/text"

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
]

const chartData = [
  82.4, 81.6, 81.9, 80.8, 80.1, 79.6, 79.8, 78.9, 78.4, 77.9,
].map((weight, index) => ({ month: MONTHS[index] ?? "", weight }))

const chartConfig = {
  weight: { label: "Weight", color: "purple" },
} satisfies ChartConfig

export function LineChartDots() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader className="gap-0.5">
        <Text className="text-sm font-semibold text-purple">Weight</Text>
        <View className="flex-row items-baseline gap-1">
          <Text className="text-3xl font-semibold tracking-tight tabular-nums">
            77.9
          </Text>
          <Text className="text-base font-semibold text-label-secondary">
            kg
          </Text>
        </View>
        <Text className="text-sm text-label-secondary">
          Down 4.5 kg since January
        </Text>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          accessibilityLabel="Weight"
          className="h-40 w-full"
        >
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 4, left: 12, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="2 4" />
            <XAxis dataKey="month" tickMargin={8} interval={2} />
            <YAxis
              orientation="right"
              tickMargin={6}
              width="auto"
              domain={[76, 84]}
              ticks={[76, 80, 84]}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideIndicator
                  formatter={(value) => (
                    <Text className="font-semibold tabular-nums">
                      {String(value)} kg
                    </Text>
                  )}
                />
              }
            />
            <Line
              dataKey="weight"
              type="linear"
              strokeWidth={2}
              dot={{ r: 3.5 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
