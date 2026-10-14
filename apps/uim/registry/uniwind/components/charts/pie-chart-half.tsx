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
  Pie,
  PieChart,
} from "@/components/ui/chart"
import { Text } from "@/components/ui/text"

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

export function PieChartHalf() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Half circle</CardTitle>
        <CardDescription>Battery use by device · last 24 hours</CardDescription>
      </CardHeader>
      <CardContent>
        <View>
          <View
            pointerEvents="none"
            className="absolute inset-x-0 bottom-[12%] items-center"
          >
            <Text className="text-2xl font-semibold tracking-tight tabular-nums">
              100%
            </Text>
            <Text className="text-xs text-label-secondary">last 24 hours</Text>
          </View>
          <ChartContainer
            config={chartConfig}
            accessibilityLabel="Half circle"
            className="h-44 w-full"
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
                        <Text className="font-semibold tabular-nums">
                          {`${String(value)}%`}
                        </Text>
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
