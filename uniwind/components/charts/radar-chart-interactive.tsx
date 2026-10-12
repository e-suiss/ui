import { cn } from "cn"
import * as React from "react"
import { View } from "react-native"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "@/components/ui/chart"
import { Text } from "@/components/ui/text"
import { Toggle } from "@/components/ui/toggle"

type Model = "pro" | "standard" | "air" | "lite"

const AXES = ["Camera", "Battery", "Performance", "Display", "Weight", "Price"]

const SCORES: Record<Model, number[]> = {
  pro: [98, 90, 98, 95, 58, 52],
  standard: [85, 82, 88, 90, 74, 80],
  air: [78, 68, 92, 90, 98, 64],
  lite: [70, 80, 76, 72, 80, 95],
}

const MODELS = Object.keys(SCORES) as Model[]

const MAX_SELECTED = 3

const chartConfig = {
  pro: { label: "Phone Pro", color: "orange" },
  standard: { label: "Phone", color: "blue" },
  air: { label: "Phone Air", color: "cyan" },
  lite: { label: "Phone Lite", color: "purple" },
} satisfies ChartConfig

const SWATCH: Record<Model, { dot: string; chip: string }> = {
  pro: { dot: "bg-orange", chip: "bg-orange/15 active:bg-orange/25" },
  standard: { dot: "bg-blue", chip: "bg-blue/15 active:bg-blue/25" },
  air: { dot: "bg-cyan", chip: "bg-cyan/15 active:bg-cyan/25" },
  lite: { dot: "bg-purple", chip: "bg-purple/15 active:bg-purple/25" },
}

const average = (model: Model) =>
  Math.round(SCORES[model].reduce((sum, score) => sum + score, 0) / AXES.length)

const data = AXES.map((name, index) => ({
  axis: name,
  ...Object.fromEntries(
    MODELS.map((model) => [model, SCORES[model][index] ?? 0])
  ),
}))

export function RadarChartInteractive() {
  const [selected, setSelected] = React.useState<Model[]>(["pro", "air"])
  const [axisIndex, setAxisIndex] = React.useState<number | null>(null)
  const axis = axisIndex === null ? undefined : AXES[axisIndex]

  const toggle = (model: Model, pressed: boolean) =>
    setSelected((current) => {
      if (!pressed)
        return current.length > 1
          ? current.filter((item) => item !== model)
          : current
      return current.length >= MAX_SELECTED
        ? [...current.slice(1), model]
        : [...current, model]
    })

  return (
    <Card variant="filled" size="sm">
      <CardHeader className="gap-0.5">
        <Text className="text-lg font-semibold">Compare phone models</Text>
        <Text className="text-sm text-label-secondary">
          Up to three models · scores out of 100, sample data
        </Text>
      </CardHeader>
      <CardContent className="gap-4">
        <View
          className="flex-row flex-wrap gap-2"
          role="group"
          accessibilityLabel="Models"
        >
          {MODELS.map((model) => (
            <Toggle
              key={model}
              size="sm"
              pressed={selected.includes(model)}
              onPressedChange={(pressed) => toggle(model, pressed)}
              className={(state) =>
                cn(
                  "gap-1.5",
                  state.pressed
                    ? SWATCH[model].chip
                    : "bg-control active:bg-control-pressed"
                )
              }
            >
              <View
                className={cn(
                  "size-2 rounded-full",
                  selected.includes(model)
                    ? SWATCH[model].dot
                    : "bg-label-quaternary"
                )}
              />
              <Text className="text-sm font-semibold text-label">
                {chartConfig[model].label}
              </Text>
            </Toggle>
          ))}
        </View>
        <ChartContainer
          config={chartConfig}
          accessibilityLabel="Compare phone models"
          className="h-72 w-full"
        >
          <RadarChart
            data={data}
            outerRadius="74%"
            margin={{ top: 8, right: 56, bottom: 8, left: 56 }}
            onActiveIndexChange={setAxisIndex}
          >
            <PolarGrid />
            <PolarAngleAxis
              dataKey="axis"
              tickClassName={(_, index) =>
                cn("text-sm", index === axisIndex && "font-semibold text-label")
              }
            />
            <PolarRadiusAxis domain={[0, 100]} tick={false} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="line"
                  formatter={(value, name) => (
                    <View className="w-full flex-row items-center gap-2">
                      <View
                        className={cn(
                          "h-3 w-0.75 shrink-0 rounded-full",
                          SWATCH[name as Model].dot
                        )}
                      />
                      <Text className="grow text-label-secondary">
                        {chartConfig[name as Model].label}
                      </Text>
                      <Text className="font-semibold tabular-nums">
                        {String(value)}
                      </Text>
                    </View>
                  )}
                />
              }
            />
            {MODELS.filter((model) => selected.includes(model)).map((model) => (
              <Radar
                isAnimationActive={false}
                key={model}
                dataKey={model}
                strokeWidth={2}
                fillOpacity={0.14}
                dot={{ r: 3 }}
              />
            ))}
          </RadarChart>
        </ChartContainer>
        <View className="gap-2.5" accessibilityLiveRegion="polite">
          {MODELS.filter((model) => selected.includes(model)).map((model) => (
            <View
              key={model}
              className="flex-row items-center gap-3 rounded-xl bg-surface px-3.5 py-3"
            >
              <View
                className={cn(
                  "size-2.5 shrink-0 rounded-full",
                  SWATCH[model].dot
                )}
              />
              <View className="grow gap-0.5">
                <Text className="text-base font-semibold">
                  {chartConfig[model].label}
                </Text>
                <Text className="text-xs text-label-secondary">
                  {axis ?? "Overall score"}
                </Text>
              </View>
              <Text className="text-2xl font-semibold tabular-nums">
                {axisIndex === null ? average(model) : SCORES[model][axisIndex]}
              </Text>
            </View>
          ))}
        </View>
      </CardContent>
    </Card>
  )
}
