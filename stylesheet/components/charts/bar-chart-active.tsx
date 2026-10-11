import * as React from "react"
import { StyleSheet, View } from "react-native"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  type ChartConfig,
  ChartContainer,
  XAxis,
} from "@/components/ui/chart"
import { Text } from "@/components/ui/text"
import { fontSize, useTheme } from "@/components/ui/theme"

const chartData = [
  { day: "Monday", steps: 8412 },
  { day: "Tuesday", steps: 10230 },
  { day: "Wednesday", steps: 6120 },
  { day: "Thursday", steps: 12480 },
  { day: "Friday", steps: 9050 },
  { day: "Saturday", steps: 14320 },
  { day: "Sunday", steps: 4870 },
].map((item, index) => ({ ...item, index }))

const chartConfig = {
  steps: { label: "Steps", color: "orange" },
} satisfies ChartConfig

function formatSteps(value: number) {
  try {
    return new Intl.NumberFormat("en-US").format(value)
  } catch {
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
}

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
})

export function BarChartActive() {
  const { colors } = useTheme()
  const [selected, setSelected] = React.useState(5)
  const day = chartData[selected]
  if (!day) return null

  return (
    <Card variant="filled" size="sm">
      <CardHeader style={styles.header}>
        <Text style={[styles.eyebrow, { color: colors.orange }]}>Steps</Text>
        <View style={styles.reading} accessibilityLiveRegion="polite">
          <Text style={styles.value}>{formatSteps(day.steps)}</Text>
          <Text style={[styles.unit, { color: colors.labelSecondary }]}>
            steps
          </Text>
        </View>
        <Text style={[styles.caption, { color: colors.labelSecondary }]}>
          {`${day.day} · select a bar`}
        </Text>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          accessibilityLabel="Steps"
          style={styles.chart}
        >
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 4, left: 4, bottom: 0 }}
            onActiveIndexChange={(index) => {
              if (index !== null) setSelected(index)
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="2 4" />
            <XAxis
              dataKey="day"
              tickMargin={8}
              interval={0}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <Bar dataKey="steps" radius={5} maxBarSize={28}>
              {chartData.map((item) => (
                <Cell
                  key={item.day}
                  fillOpacity={item.index === selected ? 1 : 0.3}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
