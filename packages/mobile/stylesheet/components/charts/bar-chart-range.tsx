import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Bar,
  BarChart,
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  XAxis,
  YAxis,
} from "@/components/ui/chart"
import { Text } from "@/components/ui/text"
import { useTheme } from "@/components/ui/theme"

const chartData = [
  { day: "Today", low: 14, high: 22 },
  { day: "Wed", low: 13, high: 21 },
  { day: "Thu", low: 15, high: 24 },
  { day: "Fri", low: 16, high: 25 },
  { day: "Sat", low: 14, high: 20 },
  { day: "Sun", low: 11, high: 17 },
  { day: "Mon", low: 10, high: 16 },
  { day: "Tue", low: 12, high: 19 },
].map((item) => ({ ...item, range: [item.low, item.high] }))

const chartConfig = {
  range: { label: "Temperature" },
} satisfies ChartConfig

export function BarChartRange() {
  const { colors } = useTheme()
  const tickStyle = { color: colors.foreground, fontWeight: "600" } as const
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>8-day forecast</CardTitle>
        <CardDescription>Each bar spans the low and high</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          accessibilityLabel="8-day forecast"
          style={{ height: 240 }}
        >
          <BarChart
            data={chartData}
            layout="vertical"
            barCategoryGap={7}
            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
          >
            <YAxis
              dataKey="day"
              type="category"
              width="auto"
              tickStyle={tickStyle}
            />
            <YAxis
              dataKey="high"
              type="category"
              orientation="right"
              width="auto"
              tickStyle={tickStyle}
              tickFormatter={(value) => `${value}°`}
            />
            <XAxis type="number" hide domain={[8, 27]} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  hideIndicator
                  formatter={(value) => (
                    <Text
                      style={{
                        fontWeight: "600",
                        fontVariant: ["tabular-nums"],
                      }}
                    >
                      {typeof value === "number"
                        ? String(value)
                        : `${value[0]}° to ${value[1]}°`}
                    </Text>
                  )}
                />
              }
            />
            <Bar
              dataKey="range"
              fill={{
                direction: "horizontal",
                stops: [
                  { offset: 0, color: "chart-2" },
                  { offset: 0.55, color: "yellow-500" },
                  { offset: 1, color: "chart-4" },
                ],
              }}
              radius={99}
              background={{ fill: "secondary", radius: 99 }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
