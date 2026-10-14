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
  Pie,
  PieChart,
} from "@/components/ui/chart"
import { Text } from "@/components/ui/text"
import { fontSize, useTheme } from "@/components/ui/theme"

const chartData = [
  { device: "phone", share: 40 },
  { device: "laptop", share: 25 },
  { device: "tablet", share: 20 },
  { device: "watch", share: 15 },
]

const chartConfig = {
  share: { label: "Share" },
  phone: { label: "Phone", color: "blue" },
  laptop: { label: "Laptop", color: "teal" },
  tablet: { label: "Tablet", color: "indigo" },
  watch: { label: "Watch", color: "orange" },
} satisfies ChartConfig

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: "12%",
    alignItems: "center",
  },
  value: {
    ...fontSize["2xl"],
    fontWeight: "600",
    letterSpacing: -0.7,
    fontVariant: ["tabular-nums"],
  },
  caption: { ...fontSize.xs },
  strong: { fontWeight: "600", fontVariant: ["tabular-nums"] },
  chart: { height: 176 },
})

export function PieChartHalf() {
  const { colors } = useTheme()
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Half circle</CardTitle>
        <CardDescription>Battery use by device · last 24 hours</CardDescription>
      </CardHeader>
      <CardContent>
        <View>
          <View pointerEvents="none" style={styles.overlay}>
            <Text style={styles.value}>100%</Text>
            <Text style={[styles.caption, { color: colors.labelSecondary }]}>
              last 24 hours
            </Text>
          </View>
          <ChartContainer
            config={chartConfig}
            accessibilityLabel="Half circle"
            style={styles.chart}
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    nameKey="device"
                    formatter={(value, name) => (
                      <Text>
                        {`${chartConfig[name as keyof typeof chartConfig].label} · `}
                        <Text style={styles.strong}>{`${String(value)}%`}</Text>
                      </Text>
                    )}
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="share"
                nameKey="device"
                cy="88%"
                startAngle={180}
                endAngle={0}
                innerRadius="105%"
                outerRadius="150%"
                paddingAngle={1.5}
                cornerRadius={4}
                stroke="none"
              />
            </PieChart>
          </ChartContainer>
        </View>
      </CardContent>
    </Card>
  )
}
