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

const chartData = [{ name: "value", value: 38 }]

const chartConfig = {
  value: { label: "Air quality", color: "green-500" },
} satisfies ChartConfig

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: "44%",
    alignItems: "center",
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

export function RadialChartGauge() {
  const { colors } = useTheme()
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Gauge</CardTitle>
        <CardDescription>Air quality index</CardDescription>
      </CardHeader>
      <CardContent>
        <View>
          <View pointerEvents="none" style={styles.overlay}>
            <Text style={styles.value}>38</Text>
            <Text style={[styles.caption, { color: colors.mutedForeground }]}>
              Good
            </Text>
          </View>
          <ChartContainer
            config={chartConfig}
            accessibilityLabel="Gauge"
            style={styles.chart}
          >
            <RadialBarChart
              data={chartData}
              innerRadius="72%"
              outerRadius="100%"
              startAngle={210}
              endAngle={-30}
              barSize={14}
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
