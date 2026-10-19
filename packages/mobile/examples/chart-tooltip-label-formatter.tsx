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
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  XAxis,
} from "@/components/ui/chart"

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

const fortnight = energyValues.map((energy, index) => ({
  date: dayKey(new Date(2026, 8, 23 + index)),
  energy,
}))

export default function ChartTooltipLabelFormatter() {
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
