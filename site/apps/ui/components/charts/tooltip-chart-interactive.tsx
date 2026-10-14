"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Switch } from "@/components/ui/switch"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type Indicator = "dot" | "line" | "dashed"

type Trigger = "hover" | "click"

const chartData = [
  ["Q1 25", 69.1, 9, 26.3],
  ["Q2 25", 46.8, 8, 26.6],
  ["Q3 25", 44.6, 8, 27.4],
  ["Q4 25", 46.2, 8.7, 28.8],
  ["Q1 26", 71, 9.5, 29.1],
  ["Q2 26", 49.4, 8.6, 29.4],
  ["Q3 26", 47.3, 8.9, 30.1],
  ["Q4 26", 49, 9.3, 31.2],
].map(([quarter, phones, laptops, services]) => ({
  quarter: quarter as string,
  phones: phones as number,
  laptops: laptops as number,
  services: services as number,
}))

const chartConfig = {
  phones: { label: "Phones", color: "var(--blue)" },
  laptops: { label: "Laptops", color: "var(--teal)" },
  services: { label: "Services", color: "var(--purple)" },
} satisfies ChartConfig

const INDICATORS: Record<Indicator, string> = {
  dot: "Dot",
  line: "Line",
  dashed: "Dashed",
}

const TRIGGERS: Record<Trigger, string> = {
  hover: "On hover",
  click: "On click",
}

const billions = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

function Setting({
  label,
  checked,
  onCheckedChange,
}: {
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  const id = React.useId()

  return (
    <div className="flex items-center gap-2.5 text-sm">
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
      <label htmlFor={id}>{label}</label>
    </div>
  )
}

export function TooltipChartInteractive() {
  const [indicator, setIndicator] = React.useState<Indicator>("dot")
  const [trigger, setTrigger] = React.useState<Trigger>("hover")
  const [showTotal, setShowTotal] = React.useState(true)
  const [hideLabel, setHideLabel] = React.useState(false)
  const [hideIndicator, setHideIndicator] = React.useState(false)

  return (
    <Card variant="filled" size="sm" className="[--card-spacing:--spacing(5)]">
      <CardHeader className="gap-0.5">
        <p className="text-lg font-semibold">Tooltip settings</p>
        <p className="text-sm text-label-secondary">
          Quarterly revenue · billions · sample data. Change the settings and
          point at the bars.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-wrap items-end gap-x-6 gap-y-3">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-label-secondary">
              Indicator
            </span>
            <ToggleGroup
              spacing={0}
              value={[indicator]}
              onValueChange={(value: string[]) => {
                if (value[0]) setIndicator(value[0] as Indicator)
              }}
              aria-label="Indicator"
            >
              {(Object.keys(INDICATORS) as Indicator[]).map((key) => (
                <ToggleGroupItem key={key} value={key} size="sm">
                  {INDICATORS[key]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-label-secondary">
              Trigger
            </span>
            <ToggleGroup
              spacing={0}
              value={[trigger]}
              onValueChange={(value: string[]) => {
                if (value[0]) setTrigger(value[0] as Trigger)
              }}
              aria-label="Trigger"
            >
              {(Object.keys(TRIGGERS) as Trigger[]).map((key) => (
                <ToggleGroupItem key={key} value={key} size="sm">
                  {TRIGGERS[key]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2.5 pb-1">
            <Setting
              label="Total in title"
              checked={showTotal}
              onCheckedChange={setShowTotal}
            />
            <Setting
              label="Hide title"
              checked={hideLabel}
              onCheckedChange={setHideLabel}
            />
            <Setting
              label="Hide indicator"
              checked={hideIndicator}
              onCheckedChange={setHideIndicator}
            />
          </div>
        </div>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-72 w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 10, right: 4, left: 12, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="2 4" />
            <XAxis
              dataKey="quarter"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={8}
            />
            <YAxis
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              width="auto"
              tickFormatter={(value: number) => `${value}B`}
            />
            <ChartTooltip
              key={trigger}
              trigger={trigger}
              defaultIndex={4}
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator={indicator}
                  hideLabel={hideLabel}
                  hideIndicator={hideIndicator}
                  labelFormatter={
                    showTotal
                      ? (label, payload) => (
                          <div className="flex justify-between gap-4">
                            <span>{label}</span>
                            <span className="tabular-nums">
                              {billions.format(
                                payload.reduce(
                                  (sum, item) => sum + Number(item.value ?? 0),
                                  0
                                )
                              )}
                              B
                            </span>
                          </div>
                        )
                      : undefined
                  }
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="services"
              stackId="a"
              fill="var(--color-services)"
              radius={[0, 0, 4, 4]}
              maxBarSize={44}
            />
            <Bar
              dataKey="laptops"
              stackId="a"
              fill="var(--color-laptops)"
              maxBarSize={44}
            />
            <Bar
              dataKey="phones"
              stackId="a"
              fill="var(--color-phones)"
              radius={[4, 4, 0, 0]}
              maxBarSize={44}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
