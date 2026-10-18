import { View } from "react-native"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Bar,
  BarChart,
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  XAxis,
} from "@/components/ui/chart"
import { Text } from "@/components/ui/text"

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

const energyConfig = {
  energy: { label: "Active energy", color: "red-500" },
} satisfies ChartConfig

const energyValues = [
  512, 604, 455, 389, 662, 598, 431, 520, 690, 447, 575, 402, 633, 558,
]

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
                      <Text className="text-muted-foreground">
                        Active energy
                      </Text>
                      <Text className="font-semibold text-foreground tabular-nums">
                        {formatNumber(Number(value))}
                      </Text>
                      <Text className="text-xs text-muted-foreground">
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

export default function ChartTooltipFormatter() {
  return <FormatterDemo />
}
