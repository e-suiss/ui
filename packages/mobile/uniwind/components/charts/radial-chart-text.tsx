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

const chartData = [{ name: "value", value: 72 }]

const chartConfig = {
  value: { label: "Used", color: "chart-1" },
} satisfies ChartConfig

export function RadialChartText() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Value in the middle</CardTitle>
        <CardDescription>A single percentage</CardDescription>
      </CardHeader>
      <CardContent>
        <View>
          <View
            pointerEvents="none"
            className="absolute inset-0 items-center justify-center"
          >
            <Text className="text-3xl font-semibold tracking-tight tabular-nums">
              72%
            </Text>
            <Text className="text-xs text-muted-foreground">
              cloud storage used
            </Text>
          </View>
          <ChartContainer
            config={chartConfig}
            accessibilityLabel="Value in the middle"
            className="h-52 w-full"
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
