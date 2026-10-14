import { StyleSheet, View } from "react-native"
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
import { fontSize, useTheme } from "@/components/ui/theme"

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
  unit: { ...fontSize.base, fontWeight: "600" },
  caption: { ...fontSize.sm },
  chart: { height: 160 },
  row: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  strong: { fontWeight: "600", fontVariant: ["tabular-nums"] },
})

export function AreaChartRange() {
  const { colors } = useTheme()
  return (
    <Card variant="filled" size="sm">
      <CardHeader style={styles.header}>
        <Text style={[styles.eyebrow, { color: colors.danger }]}>
          Heart rate
        </Text>
        <View style={styles.reading}>
          <Text style={styles.value}>
            {low}–{high}
          </Text>
          <Text style={[styles.unit, { color: colors.labelSecondary }]}>
            BPM
          </Text>
        </View>
        <Text style={[styles.caption, { color: colors.labelSecondary }]}>
          Today
        </Text>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          accessibilityLabel="Heart rate"
          style={styles.chart}
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
                    <View style={styles.row}>
                      <Text style={{ color: colors.labelSecondary }}>
                        {chartConfig[name as keyof typeof chartConfig].label}
                      </Text>
                      <Text style={styles.strong}>
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
