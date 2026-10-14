"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const rings = [
  { key: "move", label: "Move", value: 720, goal: 600, color: "var(--red)" },
  {
    key: "exercise",
    label: "Exercise",
    value: 62,
    goal: 30,
    color: "var(--green)",
  },
  { key: "stand", label: "Stand", value: 12, goal: 12, color: "var(--cyan)" },
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
      <CardContent className="flex justify-center">
        <svg
          role="img"
          aria-label={rings
            .map((ring) => `${ring.label} ${ring.value} of ${ring.goal}`)
            .join(", ")}
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="size-50 -rotate-90"
        >
          {rings.map((ring, index) => {
            const radius = SIZE / 2 - BAR / 2 - index * (BAR + 2)
            const circumference = 2 * Math.PI * radius
            const progress = Math.min(1, ring.value / ring.goal)
            return (
              <g key={ring.key}>
                <circle
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={radius}
                  fill="none"
                  strokeWidth={BAR}
                  stroke={`color-mix(in oklab, ${ring.color} 22%, transparent)`}
                />
                <circle
                  cx={SIZE / 2}
                  cy={SIZE / 2}
                  r={radius}
                  fill="none"
                  strokeWidth={BAR}
                  strokeLinecap="round"
                  stroke={ring.color}
                  strokeDasharray={`${progress * circumference} ${circumference}`}
                />
              </g>
            )
          })}
        </svg>
      </CardContent>
    </Card>
  )
}
