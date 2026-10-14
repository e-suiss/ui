"use client"

import * as React from "react"
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  useActiveTooltipLabel,
} from "recharts"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
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
const GROW_DURATION = 600

const chartConfig = {
  pro: { label: "Phone Pro", color: "var(--orange)" },
  standard: { label: "Phone", color: "var(--blue)" },
  air: { label: "Phone Air", color: "var(--cyan)" },
  lite: { label: "Phone Lite", color: "var(--purple)" },
} satisfies ChartConfig

const average = (model: Model) =>
  Math.round(SCORES[model].reduce((sum, score) => sum + score, 0) / AXES.length)

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
      const progress = Math.min(1, (performance.now() - start) / GROW_DURATION)
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

function ActiveAxis({ onChange }: { onChange: (axis: string | null) => void }) {
  const label = useActiveTooltipLabel()
  const axis = typeof label === "string" ? label : null

  React.useEffect(() => onChange(axis), [axis, onChange])

  return null
}

export function RadarChartInteractive() {
  const [selected, setSelected] = React.useState<Model[]>(["pro", "air"])
  const [axis, setAxis] = React.useState<string | null>(null)
  const target = React.useMemo(
    () => MODELS.map((model) => (selected.includes(model) ? 1 : 0)),
    [selected]
  )
  const scale = useMorph(target)
  const axisIndex = axis === null ? -1 : AXES.indexOf(axis)
  const data = AXES.map((name, index) => ({
    axis: name,
    ...Object.fromEntries(
      MODELS.map((model, position) => [
        model,
        (SCORES[model][index] ?? 0) * (scale[position] ?? 0),
      ])
    ),
    ...Object.fromEntries(
      MODELS.map((model) => [`${model}Score`, SCORES[model][index]])
    ),
  }))

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
    <Card variant="filled" size="sm" className="[--card-spacing:--spacing(5)]">
      <CardHeader className="gap-0.5">
        <p className="text-lg font-semibold">Compare phone models</p>
        <p className="text-sm text-label-secondary">
          Up to three models · scores out of 100, sample data
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Models">
          {MODELS.map((model) => (
            <Toggle
              key={model}
              size="sm"
              pressed={selected.includes(model)}
              onPressedChange={(pressed) => toggle(model, pressed)}
              style={
                { "--chip": chartConfig[model].color } as React.CSSProperties
              }
              className="gap-1.5 bg-control font-semibold text-label aria-pressed:bg-[color-mix(in_oklab,var(--chip)_16%,transparent)] aria-pressed:text-label aria-pressed:hover:bg-[color-mix(in_oklab,var(--chip)_22%,transparent)] aria-pressed:hover:text-label aria-pressed:active:bg-[color-mix(in_oklab,var(--chip)_28%,transparent)]"
            >
              <span
                aria-hidden
                className="size-2 rounded-full bg-label-quaternary transition-colors in-aria-pressed:bg-(--chip)"
              />
              {chartConfig[model].label}
            </Toggle>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-86 min-w-0 flex-[1_1_20rem]"
          >
            <RadarChart
              accessibilityLayer
              data={data}
              outerRadius="74%"
              margin={{ top: 8, right: 56, bottom: 8, left: 56 }}
            >
              <PolarGrid stroke="var(--separator)" />
              <PolarAngleAxis
                dataKey="axis"
                tick={({ x, y, textAnchor, payload }) => (
                  <text
                    x={x}
                    y={y}
                    textAnchor={textAnchor}
                    dominantBaseline="central"
                    data-active={payload.value === axis ? "" : undefined}
                    className="fill-label-secondary text-sm data-active:fill-label data-active:font-semibold"
                  >
                    {payload.value}
                  </text>
                )}
              />
              <PolarRadiusAxis
                domain={[0, 100]}
                tick={false}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={({ active, label, payload }) => (
                  <ChartTooltipContent
                    active={active}
                    label={label}
                    payload={payload?.filter((item) =>
                      selected.includes(item.dataKey as Model)
                    )}
                    indicator="line"
                    formatter={(_, name, item) => (
                      <div className="flex w-full items-center gap-2">
                        <span
                          className="h-3 w-0.75 shrink-0 rounded-full bg-(--swatch)"
                          style={
                            {
                              "--swatch": chartConfig[name as Model].color,
                            } as React.CSSProperties
                          }
                        />
                        <span className="flex-1 text-label-secondary">
                          {chartConfig[name as Model].label}
                        </span>
                        <span className="font-semibold tabular-nums">
                          {item.payload[`${name}Score`]}
                        </span>
                      </div>
                    )}
                  />
                )}
              />
              {MODELS.map((model, position) => {
                const visibility = scale[position]
                if (visibility === undefined || visibility < 0.005) return null
                return (
                  <Radar
                    key={model}
                    dataKey={model}
                    stroke={`var(--color-${model})`}
                    strokeWidth={2}
                    strokeOpacity={Math.min(1, visibility * 1.5)}
                    fill={`var(--color-${model})`}
                    fillOpacity={0.14 * visibility}
                    dot={{
                      r: 3 * Math.min(1, visibility * 1.3),
                      fillOpacity: 1,
                      fill: `var(--color-${model})`,
                    }}
                    isAnimationActive={false}
                  />
                )
              })}
              <ActiveAxis onChange={setAxis} />
            </RadarChart>
          </ChartContainer>
          <ul
            className="flex min-w-56 flex-[1_1_16rem] flex-col sm:flex-[0_1_16rem]"
            aria-live="polite"
          >
            {MODELS.map((model) => {
              const shown = selected.includes(model)
              return (
                <li
                  key={model}
                  data-shown={shown ? "" : undefined}
                  inert={!shown}
                  className="grid scale-96 grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity,scale] duration-500 ease-[cubic-bezier(0.45,0,0.2,1)] data-shown:scale-100 data-shown:grid-rows-[1fr] data-shown:opacity-100"
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="mb-2.5 flex items-center gap-3 rounded-xl bg-surface px-3.5 py-3">
                      <span
                        className="size-2.5 shrink-0 rounded-full bg-(--swatch)"
                        style={
                          {
                            "--swatch": chartConfig[model].color,
                          } as React.CSSProperties
                        }
                      />
                      <span className="flex flex-1 flex-col gap-0.5">
                        <span className="text-base font-semibold">
                          {chartConfig[model].label}
                        </span>
                        <span className="text-xs text-label-secondary">
                          {axisIndex >= 0 ? axis : "Overall score"}
                        </span>
                      </span>
                      <span className="text-2xl font-semibold tabular-nums">
                        {axisIndex >= 0
                          ? SCORES[model][axisIndex]
                          : average(model)}
                      </span>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
