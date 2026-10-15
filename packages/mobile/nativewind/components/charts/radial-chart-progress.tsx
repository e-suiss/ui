import { View } from "react-native"
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

const chartData = [{ name: "value", value: 64 }]

const chartConfig = {
  value: { label: "Reading", color: "chart-4" },
} satisfies ChartConfig

export function RadialChartProgress() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Goal progress</CardTitle>
        <CardDescription>A three-quarter arc</CardDescription>
      </CardHeader>
      <CardContent>
        <View>
          <View
            pointerEvents="none"
            className="absolute inset-0 items-center justify-center"
          >
            <Text className="text-3xl font-semibold tracking-tight tabular-nums">
              16 / 25
            </Text>
            <Text className="text-xs text-muted-foreground">books · 2026</Text>
          </View>
          <ChartContainer
            config={chartConfig}
            accessibilityLabel="Goal progress"
            className="h-52 w-full"
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
