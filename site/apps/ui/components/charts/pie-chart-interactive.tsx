"use client"

import * as React from "react"
import { Pie, PieChart, Sector } from "recharts"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { type ChartConfig, ChartContainer } from "@/components/ui/chart"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type Device = "phone" | "cloud"

type Kind =
  | "apps"
  | "photos"
  | "system"
  | "backups"
  | "drive"
  | "messages"
  | "mail"
  | "other"
  | "free"

const KINDS: Kind[] = [
  "apps",
  "photos",
  "system",
  "backups",
  "drive",
  "messages",
  "mail",
  "other",
  "free",
]

const STORAGE: Record<
  Device,
  { label: string; total: number; used: Partial<Record<Kind, number>> }
> = {
  phone: {
    label: "Phone",
    total: 256,
    used: { apps: 62.4, photos: 48.1, system: 25.8, messages: 9.8, other: 6.3 },
  },
  cloud: {
    label: "Cloud",
    total: 200,
    used: {
      photos: 96.2,
      backups: 31.4,
      drive: 18.7,
      messages: 7.9,
      mail: 2.3,
    },
  },
}

const chartConfig = {
  apps: { label: "Apps", color: "var(--red)" },
  photos: { label: "Photos", color: "var(--orange)" },
  system: { label: "System", color: "var(--gray)" },
  backups: { label: "Backups", color: "var(--purple)" },
  drive: { label: "Drive", color: "var(--blue)" },
  messages: { label: "Messages", color: "var(--green)" },
  mail: { label: "Mail", color: "var(--cyan)" },
  other: { label: "Other", color: "var(--yellow)" },
  free: { label: "Free", color: "var(--control)" },
} satisfies ChartConfig

const MORPH_DURATION = 700
const LIFT_DURATION = 260
const LIFT = 7

const sizeFormat = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

function sizes(device: Device) {
  const { total, used } = STORAGE[device]
  const taken = Object.values(used).reduce((sum, value) => sum + value, 0)
  return KINDS.map((kind) =>
    kind === "free" ? total - taken : (used[kind] ?? 0)
  )
}

function useMorph(target: number[], duration: number) {
  const [values, setValues] = React.useState(target)
  const valuesRef = React.useRef(values)
  valuesRef.current = values

  React.useEffect(() => {
    const from = valuesRef.current
    if (target.every((value, index) => value === from[index])) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValues(target)
      return
    }
    const start = performance.now()
    let frame = 0
    const step = () => {
      const progress = Math.min(1, (performance.now() - start) / duration)
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
  }, [target, duration])

  return values
}

export function PieChartInteractive() {
  const [device, setDevice] = React.useState<Device>("phone")
  const [active, setActive] = React.useState<Kind | null>(null)
  const sourceRef = React.useRef<"pie" | "list" | null>(null)

  const point = (kind: Kind) => {
    sourceRef.current = "list"
    setActive(kind)
  }
  const release = () => {
    sourceRef.current = null
    setActive(null)
  }
  const target = React.useMemo(() => sizes(device), [device])
  const values = useMorph(target, MORPH_DURATION)
  const liftTarget = React.useMemo(
    () => KINDS.map((kind) => (kind === active ? 1 : 0)),
    [active]
  )
  const lift = useMorph(liftTarget, LIFT_DURATION)
  const sizeOf = (kind: Kind) => values[KINDS.indexOf(kind)] ?? 0
  const total = values.reduce((sum, value) => sum + value, 0)
  const used = total - sizeOf("free")
  const activeValue = active ? sizeOf(active) : used
  const data = React.useMemo(
    () =>
      KINDS.map((kind, index) => ({
        kind,
        size: Math.max(0, values[index] ?? 0),
        fill: `var(--color-${kind})`,
      })),
    [values]
  )

  return (
    <Card variant="filled" size="sm" className="[--card-spacing:--spacing(5)]">
      <CardHeader className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-48 flex-1 flex-col gap-0.5">
          <p className="text-lg font-semibold">
            {STORAGE[device].label} storage
          </p>
          <p className="text-sm text-label-secondary tabular-nums">
            {sizeFormat.format(used)} GB of {STORAGE[device].total} GB used
          </p>
        </div>
        <ToggleGroup
          spacing={0}
          value={[device]}
          onValueChange={(value: string[]) => {
            if (!value[0]) return
            setDevice(value[0] as Device)
            setActive(null)
          }}
          aria-label="Device"
        >
          {(Object.keys(STORAGE) as Device[]).map((key) => (
            <ToggleGroupItem key={key} value={key} size="sm" className="px-5">
              {STORAGE[key].label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div
          aria-hidden
          className="flex h-2.5 overflow-hidden rounded-full bg-control"
        >
          {KINDS.filter((kind) => kind !== "free").map((kind) => {
            const share = (Math.max(0, sizeOf(kind)) / total) * 100
            return (
              <span
                key={kind}
                onPointerEnter={() => point(kind)}
                onPointerLeave={release}
                data-dimmed={active && active !== kind ? "" : undefined}
                className="h-full bg-(--swatch) transition-opacity duration-200 data-dimmed:opacity-35"
                style={
                  {
                    width: `${share}%`,
                    marginInlineEnd: Math.min(2, share * 4),
                    "--swatch": chartConfig[kind].color,
                  } as React.CSSProperties
                }
              />
            )
          })}
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <div className="relative mx-auto size-70 max-w-full shrink-0">
            <ChartContainer
              config={chartConfig}
              className="aspect-square size-full"
            >
              <PieChart accessibilityLayer>
                <Pie
                  data={data}
                  dataKey="size"
                  nameKey="kind"
                  innerRadius="64%"
                  outerRadius="88%"
                  startAngle={90}
                  endAngle={-270}
                  stroke="var(--surface-secondary)"
                  strokeWidth={3}
                  cornerRadius={4}
                  isAnimationActive={false}
                  onMouseEnter={(_, index) => {
                    const kind = KINDS[index]
                    if (!kind) return
                    sourceRef.current = "pie"
                    setActive(kind)
                  }}
                  onMouseLeave={() => {
                    if (sourceRef.current === "pie") release()
                  }}
                  shape={(props, index) => (
                    <Sector
                      {...props}
                      outerRadius={
                        (props.outerRadius ?? 0) +
                        (typeof index === "number" ? (lift[index] ?? 0) : 0) *
                          LIFT
                      }
                    />
                  )}
                />
              </PieChart>
            </ChartContainer>
            <div
              aria-live="polite"
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center"
            >
              <span className="text-sm text-label-secondary">
                {active ? chartConfig[active].label : "Used"}
              </span>
              <span className="text-3xl font-semibold tracking-tight tabular-nums">
                {sizeFormat.format(activeValue)} GB
              </span>
              <span className="text-sm text-label-secondary tabular-nums">
                {Math.round((activeValue / total) * 100)}%
              </span>
            </div>
          </div>
          <ul className="flex min-w-0 flex-[1_1_15rem] flex-col">
            {KINDS.map((kind) => {
              const present = (target[KINDS.indexOf(kind)] ?? 0) > 0
              return (
                <li
                  key={kind}
                  data-present={present ? "" : undefined}
                  inert={!present}
                  className="grid grid-rows-[0fr] opacity-0 transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.45,0,0.2,1)] data-present:grid-rows-[1fr] data-present:opacity-100"
                >
                  <div className="min-h-0 overflow-hidden">
                    <div
                      onPointerEnter={() => point(kind)}
                      onPointerLeave={release}
                      data-active={active === kind ? "" : undefined}
                      className="flex items-center gap-2.5 rounded-lg px-2 py-2.25 transition-colors duration-150 data-active:bg-control"
                    >
                      <span
                        className="size-2.5 shrink-0 rounded-full bg-(--swatch) data-[kind=free]:ring-1 data-[kind=free]:ring-separator-strong data-[kind=free]:ring-inset"
                        data-kind={kind}
                        style={
                          {
                            "--swatch": chartConfig[kind].color,
                          } as React.CSSProperties
                        }
                      />
                      <span className="flex-1 text-base">
                        {chartConfig[kind].label}
                      </span>
                      <span className="text-base text-label-secondary tabular-nums">
                        {sizeFormat.format(Math.max(0, sizeOf(kind)))} GB
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
