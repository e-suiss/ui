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

const chartData = [{ name: "value", value: 38 }]

const chartConfig = {
  value: { label: "Air quality", color: "green" },
} satisfies ChartConfig

export function RadialChartGauge() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Gauge</CardTitle>
        <CardDescription>Air quality index</CardDescription>
      </CardHeader>
      <CardContent>
        <View>
          <View
            pointerEvents="none"
            className="absolute inset-x-0 top-[44%] items-center"
          >
            <Text className="text-3xl font-semibold tracking-tight tabular-nums">
              38
            </Text>
            <Text className="text-xs text-label-secondary">Good</Text>
          </View>
          <ChartContainer
            config={chartConfig}
            accessibilityLabel="Gauge"
            className="h-52 w-full"
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
