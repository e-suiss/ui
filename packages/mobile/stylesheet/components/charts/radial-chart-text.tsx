import { StyleSheet, View } from "react-native"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
} from "@/components/ui/chart"
import { Text } from "@/components/ui/text"
import { fontSize, useTheme } from "@/components/ui/theme"

const chartData = [{ name: "value", value: 72 }]

const chartConfig = {
  value: { label: "Used", color: "chart-1" },
} satisfies ChartConfig

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    ...fontSize["3xl"],
    fontWeight: "600",
    letterSpacing: -0.75,
    fontVariant: ["tabular-nums"],
  },
  caption: { ...fontSize.xs },
  chart: { height: 208 },
})

export function RadialChartText() {
  const { colors } = useTheme()
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Value in the middle</CardTitle>
        <CardDescription>A single percentage</CardDescription>
      </CardHeader>
      <CardContent>
        <View>
          <View pointerEvents="none" style={styles.overlay}>
            <Text style={styles.value}>72%</Text>
            <Text style={[styles.caption, { color: colors.mutedForeground }]}>
              cloud storage used
            </Text>
          </View>
          <ChartContainer
            config={chartConfig}
            accessibilityLabel="Value in the middle"
            style={styles.chart}
          >
            <RadialBarChart
              data={chartData}
              innerRadius="72%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
              barSize={16}
            >
              <PolarAngleAxis domain={[0, 100]} />
              <RadialBar
                dataKey="value"
                cornerRadius={20}
                background={{ fillOpacity: 0.22 }}
              />
            </RadialBarChart>
          </ChartContainer>
        </View>
      </CardContent>
    </Card>
  )
}
