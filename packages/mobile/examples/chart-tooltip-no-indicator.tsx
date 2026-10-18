import type * as React from "react"
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

const monthData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 173, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 264, mobile: 140 },
]

const deviceConfig = {
  desktop: { label: "Desktop", color: "chart-1" },
  mobile: { label: "Mobile", color: "chart-2" },
} satisfies ChartConfig

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

export default function ChartTooltipNoIndicator() {
  return (
    <StackedTooltipChart
      title="No indicator"
      description="Just the name and value"
      defaultIndex={2}
      content={<ChartTooltipContent hideIndicator />}
    />
  )
}
