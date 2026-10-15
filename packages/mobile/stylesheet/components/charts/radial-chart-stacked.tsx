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
  ChartTooltip,
  ChartTooltipContent,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
} from "@/components/ui/chart"
import { Text } from "@/components/ui/text"
import { fontSize, useTheme } from "@/components/ui/theme"

const visitors = { desktop: 1260, mobile: 570 }

const chartData = [visitors]

const chartConfig = {
  desktop: { label: "Desktop", color: "chart-1" },
  mobile: { label: "Mobile", color: "chart-2" },
} satisfies ChartConfig

const total = visitors.desktop + visitors.mobile

function formatTotal(value: number) {
  try {
    return new Intl.NumberFormat("en-US").format(value)
  } catch {
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: "14%",
    alignItems: "center",
  },
  value: {
    ...fontSize["2xl"],
    fontWeight: "600",
    letterSpacing: -0.7,
    fontVariant: ["tabular-nums"],
  },
  caption: { ...fontSize.xs },
  chart: { height: 176 },
})

export function RadialChartStacked() {
  const { colors } = useTheme()
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Half, stacked</CardTitle>
        <CardDescription>Two series on one arc</CardDescription>
      </CardHeader>
      <CardContent>
        <View>
          <View pointerEvents="none" style={styles.overlay}>
            <Text style={styles.value}>{formatTotal(total)}</Text>
            <Text style={[styles.caption, { color: colors.mutedForeground }]}>
              visitors
            </Text>
          </View>
          <ChartContainer
            config={chartConfig}
            accessibilityLabel="Half, stacked"
            style={styles.chart}
          >
            <RadialBarChart
              data={chartData}
              startAngle={180}
              endAngle={0}
              innerRadius="120%"
              outerRadius="170%"
              cy="86%"
            >
              <PolarAngleAxis domain={[0, total]} />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <RadialBar
                dataKey="desktop"
                stackId="a"
                cornerRadius={6}
                fill="chart-1"
                stroke="muted"
                strokeWidth={3}
              />
              <RadialBar
                dataKey="mobile"
                stackId="a"
                cornerRadius={6}
                fill="chart-2"
                stroke="muted"
                strokeWidth={3}
              />
            </RadialBarChart>
          </ChartContainer>
        </View>
      </CardContent>
    </Card>
  )
}
