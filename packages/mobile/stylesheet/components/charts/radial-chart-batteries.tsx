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

const devices = [
  { name: "Phone", level: 82 },
  { name: "Earbuds", level: 46 },
  { name: "Watch", level: 18 },
  { name: "Case", level: 100 },
]

const LOW = 20

const styles = StyleSheet.create({
  battery: { alignItems: "center", gap: 8 },
  ring: { width: 64, height: 64 },
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },
  initial: { ...fontSize.xs, fontWeight: "600" },
  chart: { width: "100%", height: "100%", aspectRatio: 1 },
  level: { ...fontSize.base, fontWeight: "600", fontVariant: ["tabular-nums"] },
  name: { ...fontSize.xs },
  list: { flexDirection: "row", gap: 8, paddingVertical: 16 },
  item: { flex: 1 },
})

function Battery({ name, level }: { name: string; level: number }) {
  const { colors } = useTheme()
  const chartConfig = {
    level: { label: name, color: level <= LOW ? "red-500" : "green-500" },
  } satisfies ChartConfig

  return (
    <View
      accessible
      accessibilityLabel={`${name}, ${level}%`}
      style={styles.battery}
    >
      <View style={styles.ring}>
        <View pointerEvents="none" style={styles.overlay}>
          <Text style={[styles.initial, { color: colors.mutedForeground }]}>
            {name[0]}
          </Text>
        </View>
        <ChartContainer config={chartConfig} style={styles.chart}>
          <RadialBarChart
            data={[{ level }]}
            innerRadius="78%"
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
            barSize={6}
          >
            <PolarAngleAxis domain={[0, 100]} />
            <RadialBar
              isAnimationActive={false}
              dataKey="level"
              cornerRadius={6}
              background={{ fillOpacity: 0.22 }}
            />
          </RadialBarChart>
        </ChartContainer>
      </View>
      <Text style={styles.level}>{`${level}%`}</Text>
      <Text style={[styles.name, { color: colors.mutedForeground }]}>
        {name}
      </Text>
    </View>
  )
}

export function RadialChartBatteries() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Batteries</CardTitle>
        <CardDescription>Charge left on each device</CardDescription>
      </CardHeader>
      <CardContent>
        <View style={styles.list}>
          {devices.map((device) => (
            <View key={device.name} style={styles.item}>
              <Battery {...device} />
            </View>
          ))}
        </View>
      </CardContent>
    </Card>
  )
}
