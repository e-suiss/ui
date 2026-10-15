import { View } from "react-native"
import Svg, { Circle, G } from "react-native-svg"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { type ChartColor, ChartPalette } from "@/components/ui/chart"

const rings: {
  key: string
  label: string
  value: number
  goal: number
  color: ChartColor
}[] = [
  { key: "move", label: "Move", value: 720, goal: 600, color: "red-500" },
  {
    key: "exercise",
    label: "Exercise",
    value: 62,
    goal: 30,
    color: "green-500",
  },
  { key: "stand", label: "Stand", value: 12, goal: 12, color: "cyan-500" },
]

const SIZE = 200
const BAR = 16

export function RadialChartRings() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Activity rings</CardTitle>
        <CardDescription>Move, exercise and stand</CardDescription>
      </CardHeader>
      <CardContent style={{ alignItems: "center" }}>
        <View
          accessible
          role="img"
          accessibilityLabel={rings
            .map((ring) => `${ring.label} ${ring.value} of ${ring.goal}`)
            .join(", ")}
        >
          <ChartPalette colors={rings.map((ring) => ring.color)}>
            {(palette) => (
              <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
                <G rotation={-90} origin={`${SIZE / 2}, ${SIZE / 2}`}>
                  {rings.map((ring, index) => {
                    const radius = SIZE / 2 - BAR / 2 - index * (BAR + 2)
                    const circumference = 2 * Math.PI * radius
                    const progress = Math.min(1, ring.value / ring.goal)
                    const color = palette[ring.color]
                    return (
                      <G key={ring.key}>
                        <Circle
                          cx={SIZE / 2}
                          cy={SIZE / 2}
                          r={radius}
                          fill="none"
                          strokeWidth={BAR}
                          stroke={color}
                          strokeOpacity={0.22}
                        />
                        <Circle
                          cx={SIZE / 2}
                          cy={SIZE / 2}
                          r={radius}
                          fill="none"
                          strokeWidth={BAR}
                          strokeLinecap="round"
                          stroke={color}
                          strokeDasharray={`${progress * circumference} ${circumference}`}
                        />
                      </G>
                    )
                  })}
                </G>
              </Svg>
            )}
          </ChartPalette>
        </View>
      </CardContent>
    </Card>
  )
}
