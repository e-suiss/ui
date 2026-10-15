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
  XAxis,
  YAxis,
} from "@/components/ui/chart"
import { Text } from "@/components/ui/text"
import { fontSize, palette, useTheme } from "@/components/ui/theme"

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
  weight: { label: "Weight", color: "purple-500" },
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
  unit: { ...fontSize.base, fontWeight: "600" },
  caption: { ...fontSize.sm },
  strong: { fontWeight: "600", fontVariant: ["tabular-nums"] },
  chart: { height: 160 },
})

export function LineChartDots() {
  const { colors } = useTheme()
  return (
    <Card variant="filled" size="sm">
      <CardHeader style={styles.header}>
        <Text style={[styles.eyebrow, { color: palette.purple500 }]}>
          Weight
        </Text>
        <View style={styles.reading}>
          <Text style={styles.value}>77.9</Text>
          <Text style={[styles.unit, { color: colors.mutedForeground }]}>
            kg
          </Text>
        </View>
        <Text style={[styles.caption, { color: colors.mutedForeground }]}>
          Down 4.5 kg since January
        </Text>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          accessibilityLabel="Weight"
          style={styles.chart}
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
                    <Text style={styles.strong}>{String(value)} kg</Text>
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
