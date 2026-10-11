import { StyleSheet, View } from "react-native"
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
import { fontSize, useTheme } from "@/components/ui/theme"

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

const styles = StyleSheet.create({
  sparkline: { height: 32, width: 72, flexShrink: 0 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 9,
  },
  name: { minWidth: 0, flex: 1 },
  symbol: { ...fontSize.base, fontWeight: "600" },
  company: { ...fontSize.xs },
  prices: { alignItems: "flex-end", gap: 3 },
  price: { ...fontSize.sm, fontWeight: "600", fontVariant: ["tabular-nums"] },
  badge: {
    minWidth: 52,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  change: {
    ...fontSize.xs,
    textAlign: "right",
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
})

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
      style={styles.sparkline}
    >
      <AreaChart
        data={series(seed, rising)}
        margin={{ top: 2, right: 0, left: 0, bottom: 2 }}
      >
        <YAxis hide domain={["dataMin", "dataMax"]} />
        <Area
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
  const { colors, isDark } = useTheme()
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
                style={[
                  styles.row,
                  index > 0 && {
                    borderTopWidth: 1,
                    borderColor: colors.separator,
                  },
                ]}
              >
                <View style={styles.name}>
                  <Text style={styles.symbol}>{stock.symbol}</Text>
                  <Text
                    numberOfLines={1}
                    style={[styles.company, { color: colors.labelSecondary }]}
                  >
                    {stock.name}
                  </Text>
                </View>
                <Sparkline seed={stock.seed} rising={rising} />
                <View style={styles.prices}>
                  <Text style={styles.price}>{formatPrice(stock.price)}</Text>
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor: rising
                          ? colors.success
                          : colors.danger,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.change,
                        { color: isDark ? colors.surface : colors.onAccent },
                      ]}
                    >
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
