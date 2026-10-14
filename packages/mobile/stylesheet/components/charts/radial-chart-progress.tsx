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

const chartData = [{ name: "value", value: 64 }]

const chartConfig = {
  value: { label: "Reading", color: "orange" },
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

export function RadialChartProgress() {
  const { colors } = useTheme()
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Goal progress</CardTitle>
        <CardDescription>A three-quarter arc</CardDescription>
      </CardHeader>
      <CardContent>
        <View>
          <View pointerEvents="none" style={styles.overlay}>
            <Text style={styles.value}>16 / 25</Text>
            <Text style={[styles.caption, { color: colors.labelSecondary }]}>
              books · 2026
            </Text>
          </View>
          <ChartContainer
            config={chartConfig}
            accessibilityLabel="Goal progress"
            style={styles.chart}
          >
            <RadialBarChart
              data={chartData}
              innerRadius="72%"
              outerRadius="100%"
              startAngle={225}
              endAngle={-45}
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
