"use client"

import * as React from "react"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type Ring = "move" | "exercise" | "stand"

const RINGS: {
  key: Ring
  label: string
  unit: string
  goal: number
  color: string
}[] = [
  { key: "move", label: "Move", unit: "kcal", goal: 600, color: "var(--red)" },
  {
    key: "exercise",
    label: "Exercise",
    unit: "min",
    goal: 30,
    color: "var(--green)",
  },
  { key: "stand", label: "Stand", unit: "hr", goal: 12, color: "var(--cyan)" },
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

const FILL_DURATION = 750

const NO_ACTIVITY = RINGS.map(() => 0)

function useMorph(target: number[]) {
  const [values, setValues] = React.useState(() => target.map(() => 0))
  const valuesRef = React.useRef(values)
  valuesRef.current = values

  React.useEffect(() => {
    const from = valuesRef.current
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValues(target)
      return
    }
    const start = performance.now()
    let frame = 0
    const step = () => {
      const progress = Math.min(1, (performance.now() - start) / FILL_DURATION)
      const eased =
        progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2
      setValues(
        target.map((value, index) => {
          const origin = from[index] ?? value
          return origin + (value - origin) * eased
        })
      )
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [target])

  return values
}

function Rings({
  values,
  size,
  bar,
  className,
}: {
  values: number[]
  size: number
  bar: number
  className?: string
}) {
  return (
    <svg
      aria-hidden
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={{ rotate: "-90deg" }}
    >
      {RINGS.map((ring, index) => {
        const radius =
          size / 2 - bar / 2 - index * (bar + Math.max(1, bar * 0.12))
        const circumference = 2 * Math.PI * radius
        const progress = Math.max(
          0,
          Math.min(1, (values[index] ?? 0) / ring.goal)
        )
        return (
          <g key={ring.key}>
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              strokeWidth={bar}
              stroke={`color-mix(in oklab, ${ring.color} 22%, transparent)`}
            />
            {progress > 0.001 && (
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                strokeWidth={bar}
                strokeLinecap="round"
                stroke={ring.color}
                strokeDasharray={`${progress * circumference} ${circumference}`}
              />
            )}
          </g>
        )
      })}
    </svg>
  )
}

export function RadialChartInteractive() {
  const [selected, setSelected] = React.useState(6)
  const target = WEEK[selected]?.values ?? NO_ACTIVITY
  const values = useMorph(target)

  return (
    <Card variant="filled" size="sm" className="[--card-spacing:--spacing(5)]">
      <CardHeader className="gap-0.5">
        <p className="text-lg font-semibold">Activity</p>
        <p className="text-sm text-label-secondary">This week · pick a day</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <ToggleGroup
          spacing={1}
          value={[String(selected)]}
          onValueChange={(value: string[]) => {
            if (value[0] !== undefined) setSelected(Number(value[0]))
          }}
          aria-label="Day"
          className="grid w-full grid-cols-7"
        >
          {WEEK.map((entry, index) => (
            <ToggleGroupItem
              key={entry.day}
              value={String(index)}
              aria-label={entry.day}
              className="h-auto flex-col gap-1.5 rounded-xl px-0 py-2 text-xs font-semibold text-label-secondary aria-pressed:bg-surface aria-pressed:text-label aria-pressed:hover:bg-surface aria-pressed:hover:text-label"
            >
              {entry.day.slice(0, 3)}
              <Rings
                values={entry.values}
                size={40}
                bar={4}
                className="size-10"
              />
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <div className="flex flex-wrap items-center justify-center gap-8">
          <Rings
            values={values}
            size={260}
            bar={24}
            className="size-65 max-w-full"
          />
          <dl className="flex min-w-44 flex-col gap-4" aria-live="polite">
            {RINGS.map((ring, index) => {
              const percent = Math.round(
                ((target[index] ?? 0) / ring.goal) * 100
              )
              return (
                <div key={ring.key} className="flex flex-col gap-0.5">
                  <dt className="text-base font-semibold">{ring.label}</dt>
                  <dd
                    className="flex items-baseline gap-0.5 text-[color-mix(in_oklab,var(--ring),var(--label)_45%)] dark:text-(--ring)"
                    style={{ "--ring": ring.color } as React.CSSProperties}
                  >
                    <span className="text-3xl font-semibold tracking-tight tabular-nums">
                      {Math.round(values[index] ?? 0)}/{ring.goal}
                    </span>
                    <span className="text-base font-semibold uppercase">
                      {ring.unit}
                    </span>
                  </dd>
                  <dd className="text-xs text-label-secondary">
                    {percent}%{percent >= 100 ? " · goal met" : ""}
                  </dd>
                </div>
              )
            })}
          </dl>
        </div>
      </CardContent>
    </Card>
  )
}
