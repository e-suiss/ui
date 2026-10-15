import { cn } from "cn"
import * as React from "react"
import { View } from "react-native"
import Svg, { Circle, G } from "react-native-svg"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { type ChartColor, ChartPalette } from "@/components/ui/chart"
import { Text } from "@/components/ui/text"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type Ring = "move" | "exercise" | "stand"

const RINGS: {
  key: Ring
  label: string
  unit: string
  goal: number
  color: ChartColor
  text: string
}[] = [
  {
    key: "move",
    label: "Move",
    unit: "kcal",
    goal: 600,
    color: "red-500",
    text: "text-red-500",
  },
  {
    key: "exercise",
    label: "Exercise",
    unit: "min",
    goal: 30,
    color: "green-500",
    text: "text-green-500",
  },
  {
    key: "stand",
    label: "Stand",
    unit: "hr",
    goal: 12,
    color: "cyan-500",
    text: "text-cyan-500",
  },
]

const WEEK = [
  { day: "Monday", values: [520, 34, 11] },
  { day: "Tuesday", values: [610, 42, 12] },
  { day: "Wednesday", values: [380, 18, 9] },
  { day: "Thursday", values: [640, 45, 12] },
  { day: "Friday", values: [470, 28, 10] },
  { day: "Saturday", values: [720, 62, 12] },
  { day: "Sunday", values: [486, 24, 10] },
]

const NO_ACTIVITY = RINGS.map(() => 0)

function Rings({
  values,
  size,
  bar,
}: {
  values: number[]
  size: number
  bar: number
}) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      <ChartPalette colors={RINGS.map((ring) => ring.color)}>
        {(palette) => (
          <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            <G rotation={-90} origin={`${size / 2}, ${size / 2}`}>
              {RINGS.map((ring, index) => {
                const radius =
                  size / 2 - bar / 2 - index * (bar + Math.max(1, bar * 0.12))
                const circumference = 2 * Math.PI * radius
                const progress = Math.max(
                  0,
                  Math.min(1, (values[index] ?? 0) / ring.goal)
                )
                const color = palette[ring.color]
                return (
                  <G key={ring.key}>
                    <Circle
                      cx={size / 2}
                      cy={size / 2}
                      r={radius}
                      fill="none"
                      strokeWidth={bar}
                      stroke={color}
                      strokeOpacity={0.22}
                    />
                    {progress > 0.001 ? (
                      <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        strokeWidth={bar}
                        strokeLinecap="round"
                        stroke={color}
                        strokeDasharray={`${progress * circumference} ${circumference}`}
                      />
                    ) : null}
                  </G>
                )
              })}
            </G>
          </Svg>
        )}
      </ChartPalette>
    </View>
  )
}

export function RadialChartInteractive() {
  const [selected, setSelected] = React.useState(6)
  const values = WEEK[selected]?.values ?? NO_ACTIVITY

  return (
    <Card variant="filled" size="sm">
      <CardHeader className="gap-0.5">
        <Text className="text-lg font-semibold">Activity</Text>
        <Text className="text-sm text-muted-foreground">
          This week · pick a day
        </Text>
      </CardHeader>
      <CardContent className="gap-6">
        <ToggleGroup
          spacing={1}
          value={[String(selected)]}
          onValueChange={(value) => {
            if (value[0] !== undefined) setSelected(Number(value[0]))
          }}
          accessibilityLabel="Day"
          className="w-full self-stretch"
        >
          {WEEK.map((entry, index) => (
            <ToggleGroupItem
              key={entry.day}
              value={String(index)}
              accessibilityLabel={entry.day}
              className={(state) =>
                cn(
                  "h-auto min-w-0 flex-1 shrink flex-col gap-1.5 rounded-xl px-0 py-2",
                  state.pressed && "bg-background active:opacity-80"
                )
              }
            >
              <Text
                className={cn(
                  "text-xs font-semibold",
                  selected === index
                    ? "text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {entry.day.slice(0, 3)}
              </Text>
              <Rings values={entry.values} size={40} bar={4} />
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <View className="flex-row flex-wrap items-center justify-center gap-8">
          <Rings values={values} size={260} bar={24} />
          <View className="min-w-44 gap-4" accessibilityLiveRegion="polite">
            {RINGS.map((ring, index) => {
              const percent = Math.round(
                ((values[index] ?? 0) / ring.goal) * 100
              )
              return (
                <View key={ring.key} accessible className="gap-0.5">
                  <Text className="text-base font-semibold">{ring.label}</Text>
                  <View className="flex-row items-baseline gap-0.5">
                    <Text
                      className={cn(
                        "text-3xl font-semibold tracking-tight tabular-nums",
                        ring.text
                      )}
                    >
                      {`${Math.round(values[index] ?? 0)}/${ring.goal}`}
                    </Text>
                    <Text
                      className={cn(
                        "text-base font-semibold uppercase",
                        ring.text
                      )}
                    >
                      {ring.unit}
                    </Text>
                  </View>
                  <Text className="text-xs text-muted-foreground">
                    {`${percent}%${percent >= 100 ? " · goal met" : ""}`}
                  </Text>
                </View>
              )
            })}
          </View>
        </View>
      </CardContent>
    </Card>
  )
}
