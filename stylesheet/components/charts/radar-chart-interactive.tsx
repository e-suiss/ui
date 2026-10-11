import * as React from "react"
import { StyleSheet, View } from "react-native"
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
import {
  fontSize,
  radius,
  type ThemeColors,
  useTheme,
} from "@/components/ui/theme"
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

const SWATCH: Record<Model, keyof ThemeColors> = {
  pro: "orange",
  standard: "blue",
  air: "cyan",
  lite: "purple",
}

function withAlpha(color: string, alpha: number) {
  if (!color.startsWith("#") || color.length !== 7) return color
  const r = Number.parseInt(color.slice(1, 3), 16)
  const g = Number.parseInt(color.slice(3, 5), 16)
  const b = Number.parseInt(color.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const styles = StyleSheet.create({
  header: { gap: 2 },
  title: { ...fontSize.lg, fontWeight: "600" },
  caption: { ...fontSize.sm },
  content: { gap: 16 },
  models: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  model: { gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 9999 },
  modelLabel: { ...fontSize.sm, fontWeight: "600" },
  chart: { height: 288 },
  tick: { ...fontSize.sm },
  activeTick: { ...fontSize.sm, fontWeight: "600" },
  row: { width: "100%", flexDirection: "row", alignItems: "center", gap: 8 },
  bar: { height: 12, width: 3, flexShrink: 0, borderRadius: 9999 },
  grow: { flexGrow: 1 },
  strong: { fontWeight: "600", fontVariant: ["tabular-nums"] },
  scores: { gap: 10 },
  score: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: radius.xl,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  swatch: { width: 10, height: 10, flexShrink: 0, borderRadius: 9999 },
  scoreText: { flexGrow: 1, gap: 2 },
  scoreLabel: { ...fontSize.base, fontWeight: "600" },
  scoreCaption: { ...fontSize.xs },
  scoreValue: {
    ...fontSize["2xl"],
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
})

const average = (model: Model) =>
  Math.round(SCORES[model].reduce((sum, score) => sum + score, 0) / AXES.length)

const data = AXES.map((name, index) => ({
  axis: name,
  ...Object.fromEntries(
    MODELS.map((model) => [model, SCORES[model][index] ?? 0])
  ),
}))

export function RadarChartInteractive() {
  const { colors } = useTheme()
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
      <CardHeader style={styles.header}>
        <Text style={styles.title}>Compare phone models</Text>
        <Text style={[styles.caption, { color: colors.labelSecondary }]}>
          Up to three models · scores out of 100, sample data
        </Text>
      </CardHeader>
      <CardContent style={styles.content}>
        <View style={styles.models} role="group" accessibilityLabel="Models">
          {MODELS.map((model) => (
            <Toggle
              key={model}
              size="sm"
              pressed={selected.includes(model)}
              onPressedChange={(pressed) => toggle(model, pressed)}
              style={(state) => [
                styles.model,
                {
                  backgroundColor: state.pressed
                    ? withAlpha(colors[SWATCH[model]], 0.15)
                    : colors.control,
                },
              ]}
            >
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: selected.includes(model)
                      ? colors[SWATCH[model]]
                      : colors.labelQuaternary,
                  },
                ]}
              />
              <Text style={[styles.modelLabel, { color: colors.label }]}>
                {chartConfig[model].label}
              </Text>
            </Toggle>
          ))}
        </View>
        <ChartContainer
          config={chartConfig}
          accessibilityLabel="Compare phone models"
          style={styles.chart}
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
              tickStyle={(_, index) =>
                index === axisIndex
                  ? [styles.activeTick, { color: colors.label }]
                  : styles.tick
              }
            />
            <PolarRadiusAxis domain={[0, 100]} tick={false} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="line"
                  formatter={(value, name) => (
                    <View style={styles.row}>
                      <View
                        style={[
                          styles.bar,
                          { backgroundColor: colors[SWATCH[name as Model]] },
                        ]}
                      />
                      <Text
                        style={[styles.grow, { color: colors.labelSecondary }]}
                      >
                        {chartConfig[name as Model].label}
                      </Text>
                      <Text style={styles.strong}>{String(value)}</Text>
                    </View>
                  )}
                />
              }
            />
            {MODELS.filter((model) => selected.includes(model)).map((model) => (
              <Radar
                key={model}
                dataKey={model}
                strokeWidth={2}
                fillOpacity={0.14}
                dot={{ r: 3 }}
              />
            ))}
          </RadarChart>
        </ChartContainer>
        <View style={styles.scores} accessibilityLiveRegion="polite">
          {MODELS.filter((model) => selected.includes(model)).map((model) => (
            <View
              key={model}
              style={[styles.score, { backgroundColor: colors.surface }]}
            >
              <View
                style={[
                  styles.swatch,
                  { backgroundColor: colors[SWATCH[model]] },
                ]}
              />
              <View style={styles.scoreText}>
                <Text style={styles.scoreLabel}>
                  {chartConfig[model].label}
                </Text>
                <Text
                  style={[
                    styles.scoreCaption,
                    { color: colors.labelSecondary },
                  ]}
                >
                  {axis ?? "Overall score"}
                </Text>
              </View>
              <Text style={styles.scoreValue}>
                {axisIndex === null ? average(model) : SCORES[model][axisIndex]}
              </Text>
            </View>
          ))}
        </View>
      </CardContent>
    </Card>
  )
}
