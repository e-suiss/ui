import * as React from "react"
import { View } from "react-native"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Bar,
  BarChart,
  CartesianGrid,
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  XAxis,
  YAxis,
} from "@/components/ui/chart"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Text } from "@/components/ui/text"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

function formatTotal(value: number) {
  try {
    return new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 1,
    }).format(value)
  } catch {
    return String(Math.round(value * 10) / 10)
  }
}

type Indicator = "dot" | "line" | "dashed"

const revenueData = [
  ["Q1 25", 69.1, 9, 26.3],
  ["Q2 25", 46.8, 8, 26.6],
  ["Q3 25", 44.6, 8, 27.4],
  ["Q4 25", 46.2, 8.7, 28.8],
  ["Q1 26", 71, 9.5, 29.1],
  ["Q2 26", 49.4, 8.6, 29.4],
  ["Q3 26", 47.3, 8.9, 30.1],
  ["Q4 26", 49, 9.3, 31.2],
].map(([quarter, phones, laptops, services]) => ({
  quarter: quarter as string,
  phones: phones as number,
  laptops: laptops as number,
  services: services as number,
}))

const revenueConfig = {
  phones: { label: "Phones", color: "chart-1" },
  laptops: { label: "Laptops", color: "chart-2" },
  services: { label: "Services", color: "purple-500" },
} satisfies ChartConfig

export default function ChartTooltipInteractive() {
  const [indicator, setIndicator] = React.useState<Indicator>("dot")
  const [showTotal, setShowTotal] = React.useState(true)
  const [hideLabel, setHideLabel] = React.useState(false)
  const [hideIndicator, setHideIndicator] = React.useState(false)

  return (
    <Card variant="filled" size="sm">
      <CardHeader className="gap-0.5">
        <Text className="text-lg font-semibold">Tooltip settings</Text>
        <Text className="text-sm text-muted-foreground">
          Quarterly revenue · billions · sample data. Change the settings and
          touch the bars.
        </Text>
      </CardHeader>
      <CardContent className="gap-5">
        <View className="flex-row flex-wrap items-end gap-x-6 gap-y-3">
          <View className="gap-1.5">
            <Text className="text-xs font-semibold text-muted-foreground">
              Indicator
            </Text>
            <ToggleGroup
              spacing={0}
              value={[indicator]}
              onValueChange={(value) => {
                if (value[0]) setIndicator(value[0] as Indicator)
              }}
              accessibilityLabel="Indicator"
            >
              <ToggleGroupItem value="dot" size="sm">
                <Text>Dot</Text>
              </ToggleGroupItem>
              <ToggleGroupItem value="line" size="sm">
                <Text>Line</Text>
              </ToggleGroupItem>
              <ToggleGroupItem value="dashed" size="sm">
                <Text>Dashed</Text>
              </ToggleGroupItem>
            </ToggleGroup>
          </View>
          <View className="flex-row flex-wrap gap-x-5 gap-y-2.5 pb-1">
            <View className="flex-row items-center gap-2.5">
              <Switch
                size="sm"
                checked={showTotal}
                onCheckedChange={setShowTotal}
                accessibilityLabelledBy="tooltip-total"
              />
              <Label
                nativeID="tooltip-total"
                onPress={() => setShowTotal(!showTotal)}
              >
                <Text className="text-sm">Total in title</Text>
              </Label>
            </View>
            <View className="flex-row items-center gap-2.5">
              <Switch
                size="sm"
                checked={hideLabel}
                onCheckedChange={setHideLabel}
                accessibilityLabelledBy="tooltip-hide-title"
              />
              <Label
                nativeID="tooltip-hide-title"
                onPress={() => setHideLabel(!hideLabel)}
              >
                <Text className="text-sm">Hide title</Text>
              </Label>
            </View>
            <View className="flex-row items-center gap-2.5">
              <Switch
                size="sm"
                checked={hideIndicator}
                onCheckedChange={setHideIndicator}
                accessibilityLabelledBy="tooltip-hide-indicator"
              />
              <Label
                nativeID="tooltip-hide-indicator"
                onPress={() => setHideIndicator(!hideIndicator)}
              >
                <Text className="text-sm">Hide indicator</Text>
              </Label>
            </View>
          </View>
        </View>
        <ChartContainer
          config={revenueConfig}
          accessibilityLabel="Quarterly revenue"
          className="h-72 w-full"
        >
          <BarChart
            data={revenueData}
            margin={{ top: 10, right: 4, left: 12, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="2 4" />
            <XAxis dataKey="quarter" tickMargin={8} minTickGap={8} />
            <YAxis
              orientation="right"
              tickMargin={6}
              width="auto"
              tickFormatter={(value: number) => `${value}B`}
            />
            <ChartTooltip
              defaultIndex={4}
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator={indicator}
                  hideLabel={hideLabel}
                  hideIndicator={hideIndicator}
                  labelFormatter={
                    showTotal
                      ? (label, payload) => (
                          <View className="flex-row justify-between gap-4">
                            <Text>{label}</Text>
                            <Text className="tabular-nums">
                              {formatTotal(
                                payload.reduce(
                                  (sum, item) => sum + Number(item.value),
                                  0
                                )
                              )}
                              B
                            </Text>
                          </View>
                        )
                      : undefined
                  }
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="services"
              stackId="a"
              radius={[0, 0, 4, 4]}
              maxBarSize={44}
            />
            <Bar dataKey="laptops" stackId="a" maxBarSize={44} />
            <Bar
              dataKey="phones"
              stackId="a"
              radius={[4, 4, 0, 0]}
              maxBarSize={44}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
