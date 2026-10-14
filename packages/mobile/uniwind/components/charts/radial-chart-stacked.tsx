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
  ChartTooltip,
  ChartTooltipContent,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
} from "@/components/ui/chart"
import { Text } from "@/components/ui/text"

const visitors = { desktop: 1260, mobile: 570 }

const chartData = [visitors]

const chartConfig = {
  desktop: { label: "Desktop", color: "blue" },
  mobile: { label: "Mobile", color: "teal" },
} satisfies ChartConfig

const total = visitors.desktop + visitors.mobile

function formatTotal(value: number) {
  try {
    return new Intl.NumberFormat("en-US").format(value)
  } catch {
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
}

export function RadialChartStacked() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Half, stacked</CardTitle>
        <CardDescription>Two series on one arc</CardDescription>
      </CardHeader>
      <CardContent>
        <View>
          <View
            pointerEvents="none"
            className="absolute inset-x-0 bottom-[14%] items-center"
          >
            <Text className="text-2xl font-semibold tracking-tight tabular-nums">
              {formatTotal(total)}
            </Text>
            <Text className="text-xs text-label-secondary">visitors</Text>
          </View>
          <ChartContainer
            config={chartConfig}
            accessibilityLabel="Half, stacked"
            className="h-44 w-full"
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
                fill="blue"
                stroke="surface-secondary"
                strokeWidth={3}
              />
              <RadialBar
                dataKey="mobile"
                stackId="a"
                cornerRadius={6}
                fill="teal"
                stroke="surface-secondary"
                strokeWidth={3}
              />
            </RadialBarChart>
          </ChartContainer>
        </View>
      </CardContent>
    </Card>
  )
}
