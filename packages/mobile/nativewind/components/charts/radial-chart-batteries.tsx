import { View } from "react-native"
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
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
} from "@/components/ui/chart"
import { Text } from "@/components/ui/text"

const devices = [
  { name: "Phone", level: 82 },
  { name: "Earbuds", level: 46 },
  { name: "Watch", level: 18 },
  { name: "Case", level: 100 },
]

const LOW = 20

function Battery({ name, level }: { name: string; level: number }) {
  const chartConfig = {
    level: { label: name, color: level <= LOW ? "red-500" : "green-500" },
  } satisfies ChartConfig

  return (
    <View
      accessible
      accessibilityLabel={`${name}, ${level}%`}
      className="items-center gap-2"
    >
      <View className="size-16">
        <View
          pointerEvents="none"
          className="absolute inset-0 items-center justify-center"
        >
          <Text className="text-xs font-semibold text-muted-foreground">
            {name[0]}
          </Text>
        </View>
        <ChartContainer
          config={chartConfig}
          className="aspect-square size-full"
        >
          <RadialBarChart
            data={[{ level }]}
            innerRadius="78%"
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
            barSize={6}
          >
            <PolarAngleAxis domain={[0, 100]} />
            <RadialBar
              isAnimationActive={false}
              dataKey="level"
              cornerRadius={6}
              background={{ fillOpacity: 0.22 }}
            />
          </RadialBarChart>
        </ChartContainer>
      </View>
      <Text className="text-base font-semibold tabular-nums">{`${level}%`}</Text>
      <Text className="text-xs text-muted-foreground">{name}</Text>
    </View>
  )
}

export function RadialChartBatteries() {
  return (
    <Card variant="filled" size="sm">
      <CardHeader>
        <CardTitle>Batteries</CardTitle>
        <CardDescription>Charge left on each device</CardDescription>
      </CardHeader>
      <CardContent>
        <View className="flex-row gap-2 py-4">
          {devices.map((device) => (
            <View key={device.name} className="flex-1">
              <Battery {...device} />
            </View>
          ))}
        </View>
      </CardContent>
    </Card>
  )
}
