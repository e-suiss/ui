import * as React from "react"
import { View } from "react-native"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  type ChartConfig,
  ChartContainer,
  XAxis,
} from "@/components/ui/chart"
import { Text } from "@/components/ui/text"

const chartData = [
  { day: "Monday", steps: 8412 },
  { day: "Tuesday", steps: 10230 },
  { day: "Wednesday", steps: 6120 },
  { day: "Thursday", steps: 12480 },
  { day: "Friday", steps: 9050 },
  { day: "Saturday", steps: 14320 },
  { day: "Sunday", steps: 4870 },
].map((item, index) => ({ ...item, index }))

const chartConfig = {
  steps: { label: "Steps", color: "chart-4" },
} satisfies ChartConfig

function formatSteps(value: number) {
  try {
    return new Intl.NumberFormat("en-US").format(value)
  } catch {
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
}

export function BarChartActive() {
  const [selected, setSelected] = React.useState(5)
  const day = chartData[selected]
  if (!day) return null

  return (
    <Card variant="filled" size="sm">
      <CardHeader className="gap-0.5">
        <Text className="text-sm font-semibold text-orange-500">Steps</Text>
        <View
          className="flex-row items-baseline gap-1"
          accessibilityLiveRegion="polite"
        >
          <Text className="text-3xl font-semibold tracking-tight tabular-nums">
            {formatSteps(day.steps)}
          </Text>
          <Text className="text-base font-semibold text-muted-foreground">
            steps
          </Text>
        </View>
        <Text className="text-sm text-muted-foreground">
          {`${day.day} · select a bar`}
        </Text>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          accessibilityLabel="Steps"
          className="h-40 w-full"
        >
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 4, left: 4, bottom: 0 }}
            onActiveIndexChange={(index) => {
              if (index !== null) setSelected(index)
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="2 4" />
            <XAxis
              dataKey="day"
              tickMargin={8}
              interval={0}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <Bar
              dataKey="steps"
              radius={5}
              maxBarSize={28}
              isAnimationActive={false}
            >
              {chartData.map((item) => (
                <Cell
                  key={item.day}
                  fillOpacity={item.index === selected ? 1 : 0.3}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
