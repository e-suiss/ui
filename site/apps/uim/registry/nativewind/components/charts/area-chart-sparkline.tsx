import { cn } from "cn"
import { View } from "react-native"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Area,
  AreaChart,
  type ChartConfig,
  ChartContainer,
  YAxis,
} from "@/components/ui/chart"
import { Text } from "@/components/ui/text"

const stocks = [
  { symbol: "ACME", name: "Acme Corp.", price: 254.32, change: 1.28, seed: 41 },
  { symbol: "GLBX", name: "Globex", price: 512.08, change: -0.64, seed: 52 },
  { symbol: "INIT", name: "Initech", price: 186.4, change: 2.91, seed: 63 },
  { symbol: "UMBR", name: "Umbrella", price: 438.15, change: -1.87, seed: 74 },
]

const chartConfig = {
  up: { label: "Rising", color: "success" },
  down: { label: "Falling", color: "danger" },
} satisfies ChartConfig

function formatPrice(value: number, signed = false) {
  const sign = signed && value >= 0 ? "+" : ""
  try {
    return `${sign}${new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value)}`
  } catch {
    const [whole = "0", fraction = "00"] = value.toFixed(2).split(".")
    return `${sign}${whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${fraction}`
  }
}

function series(seed: number, rising: boolean) {
  let state = seed
  let value = 100
  return Array.from({ length: 30 }, (_, index) => {
    state = (state * 16807) % 2147483647
    value *= 1 + ((state - 1) / 2147483646 - (rising ? 0.44 : 0.56)) * 0.02
    return { index, value }
  })
}

function Sparkline({ seed, rising }: { seed: number; rising: boolean }) {
  const color = chartConfig[rising ? "up" : "down"].color

  return (
    <ChartContainer
      config={chartConfig}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className="h-8 w-[4.5rem] shrink-0"
    >
      <AreaChart
        data={series(seed, rising)}
        margin={{ top: 2, right: 0, left: 0, bottom: 2 }}
      >
        <YAxis hide domain={["dataMin", "dataMax"]} />
        <Area
          isAnimationActive={false}
          dataKey="value"
          type="linear"
          stroke={color}
          strokeWidth={1.5}
          fill={{
            stops: [
              { offset: 0, color, opacity: 0.25 },
              { offset: 1, color, opacity: 0.02 },
            ],
          }}
        />
      </AreaChart>
    </ChartContainer>
  )
}

export function AreaChartSparkline() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Watchlist</CardTitle>
        <CardDescription>Small area charts next to each price</CardDescription>
      </CardHeader>
      <CardContent>
        <View>
          {stocks.map((stock, index) => {
            const rising = stock.change >= 0

            return (
              <View
                key={stock.symbol}
                className={cn(
                  "flex-row items-center gap-3 border-separator py-[0.5625rem]",
                  index > 0 && "border-t"
                )}
              >
                <View className="min-w-0 flex-1">
                  <Text className="text-base font-semibold">
                    {stock.symbol}
                  </Text>
                  <Text
                    numberOfLines={1}
                    className="text-xs text-label-secondary"
                  >
                    {stock.name}
                  </Text>
                </View>
                <Sparkline seed={stock.seed} rising={rising} />
                <View className="items-end gap-[0.1875rem]">
                  <Text className="text-sm font-semibold tabular-nums">
                    {formatPrice(stock.price)}
                  </Text>
                  <View
                    className={cn(
                      "min-w-[3.25rem] rounded-md px-1.5 py-0.5",
                      rising ? "bg-success" : "bg-danger"
                    )}
                  >
                    <Text className="text-right text-xs font-semibold text-on-accent tabular-nums dark:text-surface">
                      {formatPrice(stock.change, true)}%
                    </Text>
                  </View>
                </View>
              </View>
            )
          })}
        </View>
      </CardContent>
    </Card>
  )
}
