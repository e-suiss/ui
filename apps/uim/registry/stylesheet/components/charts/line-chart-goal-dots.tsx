import { StyleSheet, View } from "react-native"
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
import { fontSize, useTheme } from "@/components/ui/theme"

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
  hours: { label: "Sleep", color: "indigo" },
} satisfies ChartConfig

const styles = StyleSheet.create({
  header: { gap: 2 },
  eyebrow: { ...fontSize.sm, fontWeight: "600" },
  reading: { flexDirection: "row", alignItems: "baseline", gap: 4 },
  value: {
    ...fontSize["3xl"],
    fontWeight: "600",
    letterSpacing: -0.75,
    fontVariant: ["tabular-nums"],
  },
  caption: { ...fontSize.sm },
  strong: { fontWeight: "600", fontVariant: ["tabular-nums"] },
  chart: { height: 160 },
})

function formatHours(hours: number) {
  const minutes = Math.round(hours * 60)
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`
}

export function LineChartGoalDots() {
  const { colors } = useTheme()
  return (
    <Card variant="filled" size="sm">
      <CardHeader style={styles.header}>
        <Text style={[styles.eyebrow, { color: colors.indigo }]}>Sleep</Text>
        <View style={styles.reading}>
          <Text style={styles.value}>7h 9m</Text>
        </View>
        <Text style={[styles.caption, { color: colors.labelSecondary }]}>
          Goal 7 hours · green nights met it
        </Text>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          accessibilityLabel="Sleep"
          style={styles.chart}
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
            <ReferenceLine y={GOAL} stroke="green" strokeDasharray="3 3" />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideIndicator
                  formatter={(value) => (
                    <Text style={styles.strong}>
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
                  (chartData[index]?.hours ?? 0) >= GOAL ? "green" : "orange",
                stroke: "surface-secondary",
                strokeWidth: 2,
              })}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
