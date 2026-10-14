import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Pie,
  PieChart,
} from "@/components/ui/chart"

const chartData = [
  { device: "phone", users: 275 },
  { device: "laptop", users: 200 },
  { device: "tablet", users: 187 },
  { device: "watch", users: 173 },
  { device: "other", users: 90 },
]

const chartConfig = {
  users: { label: "Users" },
  phone: { label: "Phone", color: "blue" },
  laptop: { label: "Laptop", color: "teal" },
  tablet: { label: "Tablet", color: "indigo" },
  watch: { label: "Watch", color: "orange" },
  other: { label: "Other", color: "gray" },
} satisfies ChartConfig

const ACTIVE = 0

export function PieChartActive() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Highlighted slice</CardTitle>
        <CardDescription>The selected slice pops out</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          accessibilityLabel="Highlighted slice"
          style={{ height: 208 }}
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="device" />}
            />
            <Pie
              data={chartData}
              dataKey="users"
              nameKey="device"
              innerRadius="50%"
              outerRadius="78%"
              strokeWidth={0}
              shape={(sector, index) =>
                index === ACTIVE
                  ? [
                      { ...sector, outerRadius: sector.outerRadius + 10 },
                      {
                        ...sector,
                        innerRadius: sector.outerRadius + 13,
                        outerRadius: sector.outerRadius + 16,
                      },
                    ]
                  : sector
              }
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
