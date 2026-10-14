import { StyleSheet } from "react-native"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  CartesianGrid,
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from "@/components/ui/chart"
import { Text } from "@/components/ui/text"

const GOAL = 10000

const chartData = [
  { day: "Mon", steps: 8412 },
  { day: "Tue", steps: 10230 },
  { day: "Wed", steps: 6120 },
  { day: "Thu", steps: 12480 },
  { day: "Fri", steps: 9050 },
  { day: "Sat", steps: 14320 },
  { day: "Sun", steps: 4870 },
]

const chartConfig = {
  steps: { label: "Steps", color: "orange" },
} satisfies ChartConfig

const styles = StyleSheet.create({
  strong: { fontWeight: "600", fontVariant: ["tabular-nums"] },
})

function formatSteps(value: number) {
  try {
    return new Intl.NumberFormat("en-US").format(value)
  } catch {
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
}

export function LineChartGoal() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Goal line</CardTitle>
        <CardDescription>A daily goal of 10,000 steps</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          accessibilityLabel="Goal line"
          style={{ height: 192 }}
        >
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 4, left: 12, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="2 4" />
            <XAxis dataKey="day" tickMargin={8} interval={0} />
            <YAxis
              orientation="right"
              tickMargin={6}
              width="auto"
              tickFormatter={(value: number) => `${value / 1000}k`}
            />
            <ReferenceLine
              y={GOAL}
              stroke="green"
              strokeDasharray="4 4"
              label="Goal"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideIndicator
                  formatter={(value) => (
                    <Text style={styles.strong}>
                      {formatSteps(Number(value))} steps
                    </Text>
                  )}
                />
              }
            />
            <Line
              dataKey="steps"
              type="monotone"
              strokeWidth={2.5}
              dot={{ r: 3.5 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
