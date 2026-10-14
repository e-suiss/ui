import * as React from "react"
import { StyleSheet, View } from "react-native"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
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
import { fontSize, type ThemeColors, useTheme } from "@/components/ui/theme"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type City = "istanbul" | "ankara" | "izmir" | "antalya" | "erzurum"

type Mode = "average" | "high" | "low"

const CITIES: Record<City, { average: number[]; spread: [number, number] }> = {
  istanbul: {
    average: [6, 6, 8, 12, 17, 22, 24, 24, 21, 16, 12, 8],
    spread: [6, 0.6],
  },
  ankara: {
    average: [0, 2, 6, 11, 16, 20, 24, 24, 19, 13, 7, 2],
    spread: [11, 1.6],
  },
  izmir: {
    average: [9, 10, 12, 16, 21, 26, 28, 28, 24, 19, 14, 10],
    spread: [9, 1],
  },
  antalya: {
    average: [10, 11, 13, 16, 21, 26, 29, 29, 25, 20, 15, 11],
    spread: [9, 0.9],
  },
  erzurum: {
    average: [-9, -8, -2, 6, 11, 15, 20, 20, 15, 8, 1, -6],
    spread: [12, 1.8],
  },
}

const CITY_KEYS = Object.keys(CITIES) as City[]

const MODES: Record<Mode, string> = {
  average: "Average",
  high: "High",
  low: "Low",
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

const chartConfig = {
  istanbul: { label: "Istanbul", color: "blue" },
  ankara: { label: "Ankara", color: "purple" },
  izmir: { label: "Izmir", color: "teal" },
  antalya: { label: "Antalya", color: "orange" },
  erzurum: { label: "Erzurum", color: "indigo" },
} satisfies ChartConfig

const SWATCH: Record<City, keyof ThemeColors> = {
  istanbul: "blue",
  ankara: "purple",
  izmir: "teal",
  antalya: "orange",
  erzurum: "indigo",
}

function withAlpha(color: string, alpha: number) {
  if (!color.startsWith("#") || color.length !== 7) return color
  const r = Number.parseInt(color.slice(1, 3), 16)
  const g = Number.parseInt(color.slice(3, 5), 16)
  const b = Number.parseInt(color.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },
  heading: { minWidth: 176, flexGrow: 1, gap: 2 },
  title: { ...fontSize.lg, fontWeight: "600" },
  caption: { ...fontSize.sm },
  content: { gap: 16 },
  cities: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  city: { gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 9999 },
  cityLabel: { ...fontSize.sm, fontWeight: "600" },
  chart: { height: 288 },
  row: { width: "100%", flexDirection: "row", alignItems: "center", gap: 8 },
  bar: { height: 12, width: 3, flexShrink: 0, borderRadius: 9999 },
  grow: { flexGrow: 1 },
  strong: { fontWeight: "600", fontVariant: ["tabular-nums"] },
  stats: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  stat: { minWidth: 136, flexGrow: 1, flexBasis: 0, gap: 2 },
  statLabel: { flexDirection: "row", alignItems: "center", gap: 6 },
  statValue: {
    ...fontSize.base,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
})

function temperature(city: City, month: number, mode: Mode) {
  const { average, spread } = CITIES[city]
  const mean = average[month]
  if (mean === undefined) return Number.NaN
  if (mode === "average") return mean
  const season = Math.sin(((month - 0.5) / 12) * Math.PI)
  const range = spread[0] + spread[1] * 6 * season * season
  return mean + (mode === "high" ? range / 2 : -range / 2)
}

export function LineChartInteractive() {
  const { colors } = useTheme()
  const [visible, setVisible] = React.useState<City[]>([
    "istanbul",
    "ankara",
    "antalya",
  ])
  const [mode, setMode] = React.useState<Mode>("average")
  const [month, setMonth] = React.useState<number | null>(null)
  const data = React.useMemo(
    () =>
      MONTHS.map((name, index) => ({
        index,
        month: name.slice(0, 3),
        ...Object.fromEntries(
          CITY_KEYS.map((city) => [
            city,
            Math.round(temperature(city, index, mode) * 10) / 10,
          ])
        ),
      })) as ({ index: number; month: string } & Record<City, number>)[],
    [mode]
  )
  const shown = CITY_KEYS.filter((city) => visible.includes(city))

  const toggle = (city: City, pressed: boolean) =>
    setVisible((current) => {
      if (pressed) return [...current, city]
      return current.length > 1
        ? current.filter((item) => item !== city)
        : current
    })

  return (
    <Card variant="filled" size="sm">
      <CardHeader style={styles.header}>
        <View style={styles.heading}>
          <Text style={styles.title}>Monthly temperature</Text>
          <Text style={[styles.caption, { color: colors.labelSecondary }]}>
            {MODES[mode]} · °C · long-term
          </Text>
        </View>
        <ToggleGroup
          spacing={0}
          value={[mode]}
          onValueChange={(value) => {
            if (value[0]) setMode(value[0] as Mode)
          }}
          accessibilityLabel="Temperature"
        >
          {(Object.keys(MODES) as Mode[]).map((key) => (
            <ToggleGroupItem key={key} value={key} size="sm">
              <Text>{MODES[key]}</Text>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </CardHeader>
      <CardContent style={styles.content}>
        <View style={styles.cities} role="group" accessibilityLabel="Cities">
          {CITY_KEYS.map((city) => (
            <Toggle
              key={city}
              size="sm"
              pressed={visible.includes(city)}
              onPressedChange={(pressed) => toggle(city, pressed)}
              style={(state) => [
                styles.city,
                {
                  backgroundColor: state.pressed
                    ? withAlpha(colors[SWATCH[city]], 0.15)
                    : colors.control,
                },
              ]}
            >
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: visible.includes(city)
                      ? colors[SWATCH[city]]
                      : colors.labelQuaternary,
                  },
                ]}
              />
              <Text style={[styles.cityLabel, { color: colors.label }]}>
                {chartConfig[city].label}
              </Text>
            </Toggle>
          ))}
        </View>
        <ChartContainer
          config={chartConfig}
          accessibilityLabel="Monthly temperature"
          style={styles.chart}
        >
          <LineChart
            data={data}
            margin={{ top: 10, right: 4, left: 12, bottom: 0 }}
            onActiveIndexChange={setMonth}
          >
            <CartesianGrid vertical={false} strokeDasharray="2 4" />
            <XAxis dataKey="month" tickMargin={8} minTickGap={8} />
            <YAxis
              orientation="right"
              tickMargin={6}
              width="auto"
              domain={[-20, 40]}
              ticks={[-20, -10, 0, 10, 20, 30, 40]}
              tickFormatter={(value: number) => `${value}°`}
            />
            <ReferenceLine y={0} stroke="separator-strong" />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(_, items) =>
                    MONTHS[Number(items[0]?.payload.index ?? 0)]
                  }
                  formatter={(value, name) => (
                    <View style={styles.row}>
                      <View
                        style={[
                          styles.bar,
                          { backgroundColor: colors[SWATCH[name as City]] },
                        ]}
                      />
                      <Text
                        style={[styles.grow, { color: colors.labelSecondary }]}
                      >
                        {chartConfig[name as City].label}
                      </Text>
                      <Text style={styles.strong}>{String(value)}°</Text>
                    </View>
                  )}
                />
              }
            />
            {shown.map((city) => (
              <Line
                animationDuration={650}
                animationEasing="ease-in-out"
                key={city}
                dataKey={city}
                type="monotone"
                strokeWidth={2.5}
                activeDot={{
                  r: 5,
                  strokeWidth: 2,
                  stroke: "surface-secondary",
                }}
              />
            ))}
          </LineChart>
        </ChartContainer>
        <View style={styles.stats}>
          {shown.map((city) => {
            const temperatures = data.map((item) => item[city])
            const highlighted = month === null ? undefined : temperatures[month]
            return (
              <View key={city} style={styles.stat}>
                <View style={styles.statLabel}>
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: colors[SWATCH[city]] },
                    ]}
                  />
                  <Text
                    style={[styles.caption, { color: colors.labelSecondary }]}
                  >
                    {chartConfig[city].label}
                  </Text>
                </View>
                <Text style={styles.statValue}>
                  {month === null || highlighted === undefined
                    ? `${Math.round(Math.min(...temperatures))}° / ${Math.round(Math.max(...temperatures))}°`
                    : `${Math.round(highlighted)}° · ${MONTHS[month]}`}
                </Text>
              </View>
            )
          })}
        </View>
      </CardContent>
    </Card>
  )
}
