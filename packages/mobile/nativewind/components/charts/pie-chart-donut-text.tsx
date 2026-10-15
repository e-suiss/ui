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
  { device: "phone", users: 275 },
  { device: "laptop", users: 200 },
  { device: "tablet", users: 187 },
  { device: "watch", users: 173 },
  { device: "other", users: 90 },
]

const chartConfig = {
  users: { label: "Users" },
  phone: { label: "Phone", color: "chart-1" },
  laptop: { label: "Laptop", color: "chart-2" },
  tablet: { label: "Tablet", color: "chart-3" },
  watch: { label: "Watch", color: "chart-4" },
  other: { label: "Other", color: "chart-5" },
} satisfies ChartConfig

const total = chartData.reduce((sum, item) => sum + item.users, 0)

function formatTotal(value: number) {
  try {
    return new Intl.NumberFormat("en-US").format(value)
  } catch {
    return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }
}

export function PieChartDonutText() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Total in the middle</CardTitle>
        <CardDescription>A summary inside the ring</CardDescription>
      </CardHeader>
      <CardContent>
        <View>
          <View
            pointerEvents="none"
            className="absolute inset-0 items-center justify-center"
          >
            <Text className="text-2xl font-semibold tracking-tight tabular-nums">
              {formatTotal(total)}
            </Text>
            <Text className="text-xs text-muted-foreground">users</Text>
          </View>
          <ChartContainer
            config={chartConfig}
            accessibilityLabel="Total in the middle"
            className="h-52 w-full"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel nameKey="device" />}
              />
              <Pie
                data={chartData}
                dataKey="users"
                nameKey="device"
                innerRadius="62%"
                outerRadius="88%"
                strokeWidth={0}
                paddingAngle={1}
                cornerRadius={3}
              />
            </PieChart>
          </ChartContainer>
        </View>
      </CardContent>
    </Card>
  )
}
