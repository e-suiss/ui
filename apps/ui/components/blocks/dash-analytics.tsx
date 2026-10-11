"use client"

import {
  ChartBarIcon,
  FlameIcon,
  NotePencilIcon,
  StarIcon,
  TagIcon,
} from "@phosphor-icons/react"
import * as React from "react"
import {
  Area,
  AreaChart,
  CartesianGrid,
  useActiveTooltipDataPoints,
  XAxis,
} from "recharts"

import {
  AppShell,
  type AppShellItem,
  AppShellTrigger,
} from "@/components/patterns/app-shell"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const apps = [
  { value: "route", label: "Route", hue: 150, icon: ChartBarIcon },
  { value: "notebook", label: "Notebook", hue: 50, icon: NotePencilIcon },
  { value: "fitness", label: "Fitness+", hue: 20, icon: FlameIcon },
]

const items: AppShellItem[] = [
  ...apps.map((app) => ({
    value: app.value,
    label: app.label,
    group: "Apps",
    icon: (
      <span
        style={{
          background: `linear-gradient(160deg, oklch(0.8 0.14 ${app.hue}), oklch(0.58 0.14 ${app.hue + 25}))`,
        }}
        className="flex size-6 shrink-0 items-center justify-center rounded-md text-white"
      >
        <app.icon weight="bold" className="size-3.5" />
      </span>
    ),
  })),
  {
    value: "analytics",
    label: "Analytics",
    icon: <ChartBarIcon />,
    group: "Reports",
  },
  {
    value: "sales",
    label: "Sales and Trends",
    icon: <TagIcon />,
    group: "Reports",
  },
  { value: "ratings", label: "Ratings", icon: <StarIcon />, group: "Reports" },
]

const metrics = [
  {
    value: "impressions",
    label: "Impressions",
    unit: "K",
    data: [12, 14, 13, 18, 17, 22, 25, 24, 28, 31, 29, 34],
  },
  {
    value: "downloads",
    label: "Downloads",
    unit: "K",
    data: [2.1, 2.4, 2.2, 3.1, 2.9, 3.8, 4.2, 4, 4.6, 5.1, 4.8, 5.6],
  },
  {
    value: "revenue",
    label: "Revenue",
    unit: "K $",
    data: [8, 9, 9, 11, 12, 14, 15, 15, 17, 19, 18, 21],
  },
  {
    value: "sessions",
    label: "Sessions",
    unit: "K",
    data: [40, 42, 41, 47, 48, 55, 58, 57, 62, 66, 64, 71],
  },
]

const regions = [
  { name: "United States", share: 0.46 },
  { name: "Germany", share: 0.21 },
  { name: "United Kingdom", share: 0.14 },
  { name: "Netherlands", share: 0.09 },
]

const chartConfig = {
  value: { label: "Value", color: "var(--accent)" },
} satisfies ChartConfig

function ActiveWeek({
  onChange,
}: {
  onChange: (index: number | null) => void
}) {
  const points = useActiveTooltipDataPoints<{ index?: number }>()
  const index = points?.[0]?.index ?? null

  React.useEffect(() => onChange(index), [index, onChange])

  return null
}

export function DashAnalytics() {
  const id = React.useId()
  const [section, setSection] = React.useState("route")
  const [metricValue, setMetricValue] = React.useState("downloads")
  const [active, setActive] = React.useState<number | null>(null)
  const appIndex = Math.max(
    0,
    apps.findIndex((app) => app.value === section)
  )
  const metric =
    metrics.find((item) => item.value === metricValue) ?? metrics[1]
  if (!metric) return null
  const data = metric.data.map((value, index) => ({
    week: `Week ${index + 1}`,
    index,
    value: Number((value * (1 - appIndex * 0.28)).toFixed(2)),
  }))
  const current = active ?? data.length - 1
  const point = data[current]
  if (!point) return null
  const latest = data.at(-1)?.value ?? 0
  const format = (value: number) => `${value.toFixed(1)} ${metric.unit}`
  const title = items.find((item) => item.value === section)?.label

  return (
    <AppShell items={items} value={section} onValueChange={setSection}>
      <div className="flex flex-col gap-5 px-5 py-5.5 md:px-7">
        <div className="flex flex-wrap items-start gap-4">
          <AppShellTrigger className="-ms-2 mt-1" />
          <div className="flex flex-1 flex-col">
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm text-label-secondary">
              Last 12 weeks · All regions
            </p>
          </div>
          <ToggleGroup
            spacing={0}
            value={[metricValue]}
            onValueChange={(value: string[]) => {
              if (value[0]) setMetricValue(value[0])
            }}
            aria-label="Metric"
            className="max-w-full overflow-x-auto"
          >
            {metrics.map((item) => (
              <ToggleGroupItem key={item.value} value={item.value} size="sm">
                {item.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <div className="rounded-xl bg-surface-secondary px-4 pt-3.5 pb-2.5">
          <div className="flex items-end gap-2.5">
            <div className="flex flex-1 flex-col" aria-live="polite">
              <span className="text-sm text-label-secondary">
                {current === data.length - 1 ? "This week" : point.week} ·{" "}
                {metric.label}
              </span>
              <span className="text-3xl font-bold tracking-tight tabular-nums">
                {format(point.value)}
              </span>
            </div>
            <span className="text-sm font-semibold text-[color-mix(in_oklab,var(--green),var(--label)_45%)] dark:text-green">
              +{12 + metrics.indexOf(metric) * 3}%
            </span>
          </div>
          <ChartContainer
            config={chartConfig}
            className="mt-3 aspect-auto h-44 w-full"
          >
            <AreaChart
              accessibilityLayer
              data={data}
              margin={{ top: 8, right: 6, left: 6, bottom: 0 }}
            >
              <defs>
                <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--color-value)"
                    stopOpacity={0.22}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--color-value)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} strokeDasharray="2 4" />
              <XAxis dataKey="week" hide />
              <ChartTooltip
                content={() => null}
                cursor={{ stroke: "var(--color-separator-strong)" }}
                defaultIndex={data.length - 1}
              />
              <Area
                dataKey="value"
                type="linear"
                stroke="var(--color-value)"
                strokeWidth={2.5}
                fill={`url(#${id}-fill)`}
                activeDot={{
                  r: 5,
                  fill: "var(--color-value)",
                  stroke: "var(--color-surface-secondary)",
                  strokeWidth: 2,
                }}
                animationDuration={500}
              />
              <ActiveWeek onChange={setActive} />
            </AreaChart>
          </ChartContainer>
        </div>
        <h2 className="-mb-2.5 px-1 text-sm font-semibold">By region</h2>
        <ItemGroup variant="inset">
          {regions.map((region, index) => (
            <React.Fragment key={region.name}>
              {index > 0 && <ItemSeparator />}
              <Item size="sm" role="listitem">
                <ItemContent>
                  <ItemTitle className="font-normal">{region.name}</ItemTitle>
                </ItemContent>
                <ItemActions className="gap-4">
                  <span className="hidden h-1.5 w-35 overflow-hidden rounded-full bg-control sm:block">
                    <span
                      style={{ width: `${(region.share / 0.46) * 100}%` }}
                      className="block h-full rounded-full bg-accent transition-[width] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]"
                    />
                  </span>
                  <span className="w-18 text-end tabular-nums">
                    {format(latest * region.share)}
                  </span>
                </ItemActions>
              </Item>
            </React.Fragment>
          ))}
        </ItemGroup>
      </div>
    </AppShell>
  )
}
