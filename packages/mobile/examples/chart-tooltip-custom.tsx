import { View } from "react-native"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Bar,
  BarChart,
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  XAxis,
} from "@/components/ui/chart"
import { Text } from "@/components/ui/text"

function formatNumber(value: number, digits = 0) {
  try {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value)
  } catch {
    const [whole = "0", fraction] = value.toFixed(digits).split(".")
    const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return fraction ? `${grouped}.${fraction}` : grouped
  }
}

const stepsData = [
  { day: "Monday", steps: 8412 },
  { day: "Tuesday", steps: 10230 },
  { day: "Wednesday", steps: 6120 },
  { day: "Thursday", steps: 12480 },
  { day: "Friday", steps: 9050 },
  { day: "Saturday", steps: 14320 },
  { day: "Sunday", steps: 4870 },
]

const stepsConfig = {
  steps: { label: "Steps", color: "chart-4" },
} satisfies ChartConfig

export default function ChartTooltipCustom() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Custom content</CardTitle>
        <CardDescription>A tooltip built from scratch</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={stepsConfig}
          accessibilityLabel="Custom content"
          className="h-52 w-full"
        >
          <BarChart
            data={stepsData}
            margin={{ top: 70, right: 4, left: 4, bottom: 0 }}
          >
            <XAxis
              dataKey="day"
              tickMargin={8}
              interval={0}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <ChartTooltip
              defaultIndex={5}
              cursor={false}
              content={({ active, payload, label }) => {
                const entry = payload[0]
                if (!active || !entry) return null
                return (
                  <View className="min-w-28 rounded-xl border border-foreground/5 bg-popover px-3 py-2 shadow-lg dark:border-foreground/10">
                    <Text className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                      Total
                    </Text>
                    <View className="flex-row items-baseline gap-1">
                      <Text className="text-2xl font-semibold tabular-nums">
                        {formatNumber(Number(entry.value))}
                      </Text>
                      <Text className="text-xs font-semibold text-muted-foreground">
                        steps
                      </Text>
                    </View>
                    <Text className="text-xs text-muted-foreground">
                      {label}
                    </Text>
                  </View>
                )
              }}
            />
            <Bar dataKey="steps" radius={4} maxBarSize={26} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
