import type { Meta, StoryObj } from "@storybook/react-native"
import { DesktopIcon, DeviceMobileIcon } from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  XAxis,
  YAxis,
} from "@/components/ui/chart"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Text } from "@/components/ui/text"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const meta = {
  title: "Components/Chart",
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const monthData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 173, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 264, mobile: 140 },
]

const deviceConfig = {
  desktop: { label: "Desktop", color: "blue" },
  mobile: { label: "Mobile", color: "teal" },
} satisfies ChartConfig

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

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

function formatNumber(value: number, digits = 0) {
  try {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value)
  } catch {
    const [whole = "0", fraction] = value.toFixed(digits).split(".")
    const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return fraction ? `${grouped}.${fraction}` : grouped
  }
}

function formatTotal(value: number) {
  try {
    return new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 1,
    }).format(value)
  } catch {
    return String(Math.round(value * 10) / 10)
  }
}

function dayKey(date: Date) {
  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-")
}

function fromKey(key: string) {
  const [year = 0, month = 1, day = 1] = key.split("-").map(Number)
  return new Date(year, month - 1, day)
}

function StackedTooltipChart({
  title,
  description,
  defaultIndex,
  content,
}: {
  title: string
  description: string
  defaultIndex: number
  content: React.ReactElement
}) {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={deviceConfig}
          accessibilityLabel={title}
          className="h-52 w-full"
        >
          <BarChart
            data={monthData}
            margin={{ top: 70, right: 4, left: 4, bottom: 0 }}
          >
            <XAxis
              dataKey="month"
              tickMargin={8}
              interval={0}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <ChartTooltip
              defaultIndex={defaultIndex}
              cursor={false}
              content={content}
            />
            <Bar
              dataKey="desktop"
              stackId="a"
              radius={[0, 0, 4, 4]}
              maxBarSize={30}
            />
            <Bar
              dataKey="mobile"
              stackId="a"
              radius={[4, 4, 0, 0]}
              maxBarSize={30}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export const TooltipDot: Story = {
  render: () => (
    <StackedTooltipChart
      title="Dot indicator"
      description='indicator="dot"'
      defaultIndex={2}
      content={<ChartTooltipContent indicator="dot" />}
    />
  ),
}

export const TooltipLine: Story = {
  render: () => (
    <StackedTooltipChart
      title="Line indicator"
      description='indicator="line"'
      defaultIndex={2}
      content={<ChartTooltipContent indicator="line" />}
    />
  ),
}

export const TooltipDashed: Story = {
  render: () => (
    <StackedTooltipChart
      title="Dashed indicator"
      description='indicator="dashed"'
      defaultIndex={2}
      content={<ChartTooltipContent indicator="dashed" />}
    />
  ),
}

export const TooltipNoIndicator: Story = {
  render: () => (
    <StackedTooltipChart
      title="No indicator"
      description="Just the name and value"
      defaultIndex={2}
      content={<ChartTooltipContent hideIndicator />}
    />
  ),
}

export const TooltipNoLabel: Story = {
  render: () => (
    <StackedTooltipChart
      title="No label"
      description="The month is hidden"
      defaultIndex={2}
      content={<ChartTooltipContent hideLabel />}
    />
  ),
}

const energyConfig = {
  energy: { label: "Active energy", color: "red" },
} satisfies ChartConfig

const energyValues = [
  512, 604, 455, 389, 662, 598, 431, 520, 690, 447, 575, 402, 633, 558,
]

const fortnight = energyValues.map((energy, index) => ({
  date: dayKey(new Date(2026, 8, 23 + index)),
  energy,
}))

function LabelFormatterDemo() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Custom label</CardTitle>
        <CardDescription>The date written out in full</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={energyConfig}
          accessibilityLabel="Custom label"
          className="h-52 w-full"
        >
          <AreaChart
            data={fortnight}
            margin={{ top: 70, right: 12, left: 12, bottom: 0 }}
          >
            <XAxis
              dataKey="date"
              tickMargin={8}
              interval={2}
              tickFormatter={(value: string) => String(Number(value.slice(8)))}
            />
            <ChartTooltip
              defaultIndex={8}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(_, payload) => {
                    const date = fromKey(String(payload[0]?.payload.date))
                    return `${WEEKDAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}`
                  }}
                />
              }
            />
            <Area
              dataKey="energy"
              type="monotone"
              strokeWidth={2}
              fill={{
                stops: [
                  { offset: 0, opacity: 0.38 },
                  { offset: 1, opacity: 0.02 },
                ],
              }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export const TooltipLabelFormatter: Story = {
  render: () => <LabelFormatterDemo />,
}

const week = energyValues.slice(-7).map((energy, index) => ({
  date: dayKey(new Date(2026, 9, index)),
  energy,
}))

function FormatterDemo() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>With units</CardTitle>
        <CardDescription>A unit next to the value</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={energyConfig}
          accessibilityLabel="With units"
          className="h-52 w-full"
        >
          <BarChart
            data={week}
            margin={{ top: 70, right: 4, left: 4, bottom: 0 }}
          >
            <XAxis
              dataKey="date"
              tickMargin={8}
              interval={0}
              tickFormatter={(value: string) =>
                (WEEKDAYS[fromKey(value).getDay()] ?? "").slice(0, 3)
              }
            />
            <ChartTooltip
              defaultIndex={3}
              cursor={false}
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value) => (
                    <View className="flex-row items-baseline gap-1.5">
                      <Text className="text-label-secondary">
                        Active energy
                      </Text>
                      <Text className="font-semibold text-label tabular-nums">
                        {formatNumber(Number(value))}
                      </Text>
                      <Text className="text-2xs text-label-secondary">
                        kcal
                      </Text>
                    </View>
                  )}
                />
              }
            />
            <Bar dataKey="energy" radius={4} maxBarSize={26} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export const TooltipFormatter: Story = {
  render: () => <FormatterDemo />,
}

const iconConfig = {
  desktop: { label: "Desktop", color: "blue", icon: DesktopIcon },
  mobile: { label: "Mobile", color: "teal", icon: DeviceMobileIcon },
} satisfies ChartConfig

function IconsDemo() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>With icons</CardTitle>
        <CardDescription>An icon instead of a color</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={iconConfig}
          accessibilityLabel="With icons"
          className="h-52 w-full"
        >
          <BarChart
            data={monthData}
            margin={{ top: 70, right: 4, left: 4, bottom: 0 }}
          >
            <XAxis
              dataKey="month"
              tickMargin={8}
              interval={0}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <ChartTooltip
              defaultIndex={3}
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Bar
              dataKey="desktop"
              stackId="a"
              radius={[0, 0, 4, 4]}
              maxBarSize={30}
            />
            <Bar
              dataKey="mobile"
              stackId="a"
              radius={[4, 4, 0, 0]}
              maxBarSize={30}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export const TooltipIcons: Story = {
  render: () => <IconsDemo />,
}

const stepsData = [
  { day: "Monday", steps: 8412 },
  { day: "Tuesday", steps: 10230 },
  { day: "Wednesday", steps: 6120 },
  { day: "Thursday", steps: 12480 },
  { day: "Friday", steps: 9050 },
  { day: "Saturday", steps: 14320 },
  { day: "Sunday", steps: 4870 },
]

const stepsConfig = {
  steps: { label: "Steps", color: "orange" },
} satisfies ChartConfig

function CustomDemo() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Custom content</CardTitle>
        <CardDescription>A tooltip built from scratch</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={stepsConfig}
          accessibilityLabel="Custom content"
          className="h-52 w-full"
        >
          <BarChart
            data={stepsData}
            margin={{ top: 70, right: 4, left: 4, bottom: 0 }}
          >
            <XAxis
              dataKey="day"
              tickMargin={8}
              interval={0}
              tickFormatter={(value: string) => value.slice(0, 3)}
            />
            <ChartTooltip
              defaultIndex={5}
              cursor={false}
              content={({ active, payload, label }) => {
                const entry = payload[0]
                if (!active || !entry) return null
                return (
                  <View className="min-w-28 rounded-xl border border-label/5 bg-surface-raised px-3 py-2 shadow-lg dark:border-label/10">
                    <Text className="text-2xs font-semibold tracking-wide text-label-secondary uppercase">
                      Total
                    </Text>
                    <View className="flex-row items-baseline gap-1">
                      <Text className="text-2xl font-semibold tabular-nums">
                        {formatNumber(Number(entry.value))}
                      </Text>
                      <Text className="text-xs font-semibold text-label-secondary">
                        steps
                      </Text>
                    </View>
                    <Text className="text-xs text-label-secondary">
                      {label}
                    </Text>
                  </View>
                )
              }}
            />
            <Bar dataKey="steps" radius={4} maxBarSize={26} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export const TooltipCustom: Story = {
  render: () => <CustomDemo />,
}

type Indicator = "dot" | "line" | "dashed"

const INDICATORS: Record<Indicator, string> = {
  dot: "Dot",
  line: "Line",
  dashed: "Dashed",
}

const revenueData = [
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

const revenueConfig = {
  phones: { label: "Phones", color: "blue" },
  laptops: { label: "Laptops", color: "teal" },
  services: { label: "Services", color: "purple" },
} satisfies ChartConfig

function Setting({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <View className="flex-row items-center gap-2.5">
      <Switch
        size="sm"
        checked={checked}
        onCheckedChange={onCheckedChange}
        accessibilityLabelledBy={id}
      />
      <Label nativeID={id} onPress={() => onCheckedChange(!checked)}>
        <Text className="text-sm">{label}</Text>
      </Label>
    </View>
  )
}

function InteractiveDemo() {
  const [indicator, setIndicator] = React.useState<Indicator>("dot")
  const [showTotal, setShowTotal] = React.useState(true)
  const [hideLabel, setHideLabel] = React.useState(false)
  const [hideIndicator, setHideIndicator] = React.useState(false)

  return (
    <Card variant="filled" size="sm">
      <CardHeader className="gap-0.5">
        <Text className="text-lg font-semibold">Tooltip settings</Text>
        <Text className="text-sm text-label-secondary">
          Quarterly revenue · billions · sample data. Change the settings and
          touch the bars.
        </Text>
      </CardHeader>
      <CardContent className="gap-5">
        <View className="flex-row flex-wrap items-end gap-x-6 gap-y-3">
          <View className="gap-1.5">
            <Text className="text-xs font-semibold text-label-secondary">
              Indicator
            </Text>
            <ToggleGroup
              spacing={0}
              value={[indicator]}
              onValueChange={(value) => {
                if (value[0]) setIndicator(value[0] as Indicator)
              }}
              accessibilityLabel="Indicator"
            >
              {(Object.keys(INDICATORS) as Indicator[]).map((key) => (
                <ToggleGroupItem key={key} value={key} size="sm">
                  <Text>{INDICATORS[key]}</Text>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </View>
          <View className="flex-row flex-wrap gap-x-5 gap-y-2.5 pb-1">
            <Setting
              id="tooltip-total"
              label="Total in title"
              checked={showTotal}
              onCheckedChange={setShowTotal}
            />
            <Setting
              id="tooltip-hide-title"
              label="Hide title"
              checked={hideLabel}
              onCheckedChange={setHideLabel}
            />
            <Setting
              id="tooltip-hide-indicator"
              label="Hide indicator"
              checked={hideIndicator}
              onCheckedChange={setHideIndicator}
            />
          </View>
        </View>
        <ChartContainer
          config={revenueConfig}
          accessibilityLabel="Quarterly revenue"
          className="h-72 w-full"
        >
          <BarChart
            data={revenueData}
            margin={{ top: 10, right: 4, left: 12, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="2 4" />
            <XAxis dataKey="quarter" tickMargin={8} minTickGap={8} />
            <YAxis
              orientation="right"
              tickMargin={6}
              width="auto"
              tickFormatter={(value: number) => `${value}B`}
            />
            <ChartTooltip
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
                          <View className="flex-row justify-between gap-4">
                            <Text>{label}</Text>
                            <Text className="tabular-nums">
                              {formatTotal(
                                payload.reduce(
                                  (sum, item) => sum + Number(item.value),
                                  0
                                )
                              )}
                              B
                            </Text>
                          </View>
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
              radius={[0, 0, 4, 4]}
              maxBarSize={44}
            />
            <Bar dataKey="laptops" stackId="a" maxBarSize={44} />
            <Bar
              dataKey="phones"
              stackId="a"
              radius={[4, 4, 0, 0]}
              maxBarSize={44}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export const TooltipInteractive: Story = {
  render: () => <InteractiveDemo />,
}
