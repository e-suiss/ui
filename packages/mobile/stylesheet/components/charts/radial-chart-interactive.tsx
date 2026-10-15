import * as React from "react"
import { StyleSheet, View } from "react-native"
import Svg, { Circle, G } from "react-native-svg"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { type ChartColor, ChartPalette } from "@/components/ui/chart"
import { Text } from "@/components/ui/text"
import {
  fontSize,
  palette,
  type ThemeColors,
  useTheme,
} from "@/components/ui/theme"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type Tone = keyof ThemeColors | keyof typeof palette

function tone(colors: ThemeColors, key: Tone) {
  return { ...colors, ...palette }[key]
}

type Ring = "move" | "exercise" | "stand"

const RINGS: {
  key: Ring
  label: string
  unit: string
  goal: number
  color: ChartColor
  swatch: Tone
}[] = [
  {
    key: "move",
    label: "Move",
    unit: "kcal",
    goal: 600,
    color: "red-500",
    swatch: "red500",
  },
  {
    key: "exercise",
    label: "Exercise",
    unit: "min",
    goal: 30,
    color: "green-500",
    swatch: "green500",
  },
  {
    key: "stand",
    label: "Stand",
    unit: "hr",
    goal: 12,
    color: "cyan-500",
    swatch: "cyan500",
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

const styles = StyleSheet.create({
  header: { gap: 2 },
  title: { ...fontSize.lg, fontWeight: "600" },
  caption: { ...fontSize.sm },
  content: { gap: 24 },
  days: { width: "100%", alignSelf: "stretch" },
  day: {
    height: "auto",
    minWidth: 0,
    flex: 1,
    flexShrink: 1,
    flexDirection: "column",
    gap: 6,
    borderRadius: 12,
    paddingHorizontal: 0,
    paddingVertical: 8,
  },
  dayLabel: { ...fontSize.xs, fontWeight: "600" },
  summary: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
  },
  rings: { minWidth: 176, gap: 16 },
  ring: { gap: 2 },
  ringLabel: { ...fontSize.base, fontWeight: "600" },
  reading: { flexDirection: "row", alignItems: "baseline", gap: 2 },
  value: {
    ...fontSize["3xl"],
    fontWeight: "600",
    letterSpacing: -0.75,
    fontVariant: ["tabular-nums"],
  },
  unit: { ...fontSize.base, fontWeight: "600", textTransform: "uppercase" },
  percent: { ...fontSize.xs },
})

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
  const { colors } = useTheme()
  const [selected, setSelected] = React.useState(6)
  const values = WEEK[selected]?.values ?? NO_ACTIVITY

  return (
    <Card variant="filled" size="sm">
      <CardHeader style={styles.header}>
        <Text style={styles.title}>Activity</Text>
        <Text style={[styles.caption, { color: colors.mutedForeground }]}>
          This week · pick a day
        </Text>
      </CardHeader>
      <CardContent style={styles.content}>
        <ToggleGroup
          spacing={1}
          value={[String(selected)]}
          onValueChange={(value) => {
            if (value[0] !== undefined) setSelected(Number(value[0]))
          }}
          accessibilityLabel="Day"
          style={styles.days}
        >
          {WEEK.map((entry, index) => (
            <ToggleGroupItem
              key={entry.day}
              value={String(index)}
              accessibilityLabel={entry.day}
              style={(state) => [
                styles.day,
                state.pressed && { backgroundColor: colors.background },
              ]}
            >
              <Text
                style={[
                  styles.dayLabel,
                  {
                    color:
                      selected === index
                        ? colors.foreground
                        : colors.mutedForeground,
                  },
                ]}
              >
                {entry.day.slice(0, 3)}
              </Text>
              <Rings values={entry.values} size={40} bar={4} />
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <View style={styles.summary}>
          <Rings values={values} size={260} bar={24} />
          <View style={styles.rings} accessibilityLiveRegion="polite">
            {RINGS.map((ring, index) => {
              const percent = Math.round(
                ((values[index] ?? 0) / ring.goal) * 100
              )
              return (
                <View key={ring.key} accessible style={styles.ring}>
                  <Text style={styles.ringLabel}>{ring.label}</Text>
                  <View style={styles.reading}>
                    <Text
                      style={[
                        styles.value,
                        { color: tone(colors, ring.swatch) },
                      ]}
                    >
                      {`${Math.round(values[index] ?? 0)}/${ring.goal}`}
                    </Text>
                    <Text
                      style={[
                        styles.unit,
                        { color: tone(colors, ring.swatch) },
                      ]}
                    >
                      {ring.unit}
                    </Text>
                  </View>
                  <Text
                    style={[styles.percent, { color: colors.mutedForeground }]}
                  >
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
