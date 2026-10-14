import { cn } from "cn"
import * as React from "react"
import { View } from "react-native"
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

const SWATCH: Record<City, { dot: string; chip: string }> = {
  istanbul: { dot: "bg-blue", chip: "bg-blue/15 active:bg-blue/25" },
  ankara: { dot: "bg-purple", chip: "bg-purple/15 active:bg-purple/25" },
  izmir: { dot: "bg-teal", chip: "bg-teal/15 active:bg-teal/25" },
  antalya: { dot: "bg-orange", chip: "bg-orange/15 active:bg-orange/25" },
  erzurum: { dot: "bg-indigo", chip: "bg-indigo/15 active:bg-indigo/25" },
}

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
      <CardHeader className="flex-row flex-wrap items-start justify-between gap-4">
        <View className="min-w-44 grow gap-0.5">
          <Text className="text-lg font-semibold">Monthly temperature</Text>
          <Text className="text-sm text-label-secondary">
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
      <CardContent className="gap-4">
        <View
          className="flex-row flex-wrap gap-2"
          role="group"
          accessibilityLabel="Cities"
        >
          {CITY_KEYS.map((city) => (
            <Toggle
              key={city}
              size="sm"
              pressed={visible.includes(city)}
              onPressedChange={(pressed) => toggle(city, pressed)}
              className={(state) =>
                cn(
                  "gap-1.5",
                  state.pressed
                    ? SWATCH[city].chip
                    : "bg-control active:bg-control-pressed"
                )
              }
            >
              <View
                className={cn(
                  "size-2 rounded-full",
                  visible.includes(city)
                    ? SWATCH[city].dot
                    : "bg-label-quaternary"
                )}
              />
              <Text className="text-sm font-semibold text-label">
                {chartConfig[city].label}
              </Text>
            </Toggle>
          ))}
        </View>
        <ChartContainer
          config={chartConfig}
          accessibilityLabel="Monthly temperature"
          className="h-72 w-full"
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
                    <View className="w-full flex-row items-center gap-2">
                      <View
                        className={cn(
                          "h-3 w-0.75 shrink-0 rounded-full",
                          SWATCH[name as City].dot
                        )}
                      />
                      <Text className="grow text-label-secondary">
                        {chartConfig[name as City].label}
                      </Text>
                      <Text className="font-semibold tabular-nums">
                        {String(value)}°
                      </Text>
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
        <View className="flex-row flex-wrap gap-3">
          {shown.map((city) => {
            const temperatures = data.map((item) => item[city])
            const highlighted = month === null ? undefined : temperatures[month]
            return (
              <View key={city} className="min-w-34 grow basis-0 gap-0.5">
                <View className="flex-row items-center gap-1.5">
                  <View
                    className={cn(
                      "size-2 shrink-0 rounded-full",
                      SWATCH[city].dot
                    )}
                  />
                  <Text className="text-sm text-label-secondary">
                    {chartConfig[city].label}
                  </Text>
                </View>
                <Text className="text-base font-semibold tabular-nums">
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
