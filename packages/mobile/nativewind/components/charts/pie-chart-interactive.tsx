import { cn } from "cn"
import * as React from "react"
import { Pressable, View } from "react-native"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  Pie,
  PieChart,
} from "@/components/ui/chart"
import { Text } from "@/components/ui/text"
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
  apps: { label: "Apps", color: "red-500" },
  photos: { label: "Photos", color: "chart-4" },
  system: { label: "System", color: "chart-5" },
  backups: { label: "Backups", color: "purple-500" },
  drive: { label: "Drive", color: "chart-1" },
  messages: { label: "Messages", color: "green-500" },
  mail: { label: "Mail", color: "cyan-500" },
  other: { label: "Other", color: "yellow-500" },
  free: { label: "Free", color: "secondary" },
} satisfies ChartConfig

const SWATCH: Record<Kind, string> = {
  apps: "bg-red-500",
  photos: "bg-orange-500",
  system: "bg-zinc-500",
  backups: "bg-purple-500",
  drive: "bg-blue-500",
  messages: "bg-green-500",
  mail: "bg-cyan-500",
  other: "bg-yellow-500",
  free: "bg-secondary border border-input",
}

const LIFT = 7

function formatSize(value: number) {
  try {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }).format(value)
  } catch {
    return value.toFixed(1)
  }
}

function sizes(device: Device) {
  const { total, used } = STORAGE[device]
  const taken = Object.values(used).reduce((sum, value) => sum + value, 0)
  return KINDS.map((kind) =>
    kind === "free" ? total - taken : (used[kind] ?? 0)
  )
}

export function PieChartInteractive() {
  const [device, setDevice] = React.useState<Device>("phone")
  const [active, setActive] = React.useState<Kind | null>(null)
  const values = React.useMemo(() => sizes(device), [device])
  const sizeOf = (kind: Kind) => values[KINDS.indexOf(kind)] ?? 0
  const total = values.reduce((sum, value) => sum + value, 0)
  const used = total - sizeOf("free")
  const activeValue = active ? sizeOf(active) : used
  const data = KINDS.map((kind, index) => ({
    kind,
    size: Math.max(0, values[index] ?? 0),
  }))

  return (
    <Card variant="filled" size="sm">
      <CardHeader className="flex-row flex-wrap items-start justify-between gap-4">
        <View className="min-w-48 grow gap-0.5">
          <Text className="text-lg font-semibold">
            {`${STORAGE[device].label} storage`}
          </Text>
          <Text className="text-sm text-muted-foreground tabular-nums">
            {`${formatSize(used)} GB of ${STORAGE[device].total} GB used`}
          </Text>
        </View>
        <ToggleGroup
          spacing={0}
          value={[device]}
          onValueChange={(value) => {
            if (!value[0]) return
            setDevice(value[0] as Device)
            setActive(null)
          }}
          accessibilityLabel="Device"
        >
          {(Object.keys(STORAGE) as Device[]).map((key) => (
            <ToggleGroupItem key={key} value={key} size="sm" className="px-5">
              <Text>{STORAGE[key].label}</Text>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </CardHeader>
      <CardContent className="gap-5">
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          className="h-2.5 flex-row overflow-hidden rounded-full bg-secondary"
        >
          {KINDS.filter((kind) => kind !== "free").map((kind) => {
            const share = (Math.max(0, sizeOf(kind)) / total) * 100
            return (
              <View
                key={kind}
                style={{
                  width: `${share}%`,
                  marginEnd: Math.min(2, share * 4),
                }}
                className={cn(
                  "h-full",
                  SWATCH[kind],
                  active && active !== kind && "opacity-35"
                )}
              />
            )
          })}
        </View>
        <View className="flex-row flex-wrap items-center justify-center gap-6">
          <View className="size-[17.5rem] max-w-full">
            <View
              pointerEvents="none"
              accessibilityLiveRegion="polite"
              className="absolute inset-0 items-center justify-center"
            >
              <Text className="text-sm text-muted-foreground">
                {active ? chartConfig[active].label : "Used"}
              </Text>
              <Text className="text-3xl font-semibold tracking-tight tabular-nums">
                {`${formatSize(activeValue)} GB`}
              </Text>
              <Text className="text-sm text-muted-foreground tabular-nums">
                {`${Math.round((activeValue / total) * 100)}%`}
              </Text>
            </View>
            <ChartContainer
              config={chartConfig}
              accessibilityLabel={`${STORAGE[device].label} storage`}
              className="aspect-square size-full"
            >
              <PieChart
                key={device}
                onActiveIndexChange={(index) =>
                  setActive(index === null ? null : (KINDS[index] ?? null))
                }
              >
                <Pie
                  isAnimationActive={false}
                  data={data}
                  dataKey="size"
                  nameKey="kind"
                  innerRadius="64%"
                  outerRadius="88%"
                  startAngle={90}
                  endAngle={-270}
                  stroke="muted"
                  strokeWidth={3}
                  cornerRadius={4}
                  shape={(sector, index) => ({
                    ...sector,
                    outerRadius:
                      sector.outerRadius + (KINDS[index] === active ? LIFT : 0),
                  })}
                />
              </PieChart>
            </ChartContainer>
          </View>
          <View className="min-w-60 grow basis-60">
            {KINDS.filter((kind) => sizeOf(kind) > 0).map((kind) => (
              <Pressable
                key={kind}
                role="button"
                accessibilityState={{ selected: active === kind }}
                onPress={() =>
                  setActive((current) => (current === kind ? null : kind))
                }
                className={cn(
                  "flex-row items-center gap-2.5 rounded-lg px-2 py-[0.5625rem]",
                  active === kind && "bg-secondary"
                )}
              >
                <View
                  className={cn("size-2.5 shrink-0 rounded-full", SWATCH[kind])}
                />
                <Text className="grow text-base">
                  {chartConfig[kind].label}
                </Text>
                <Text className="text-base text-muted-foreground tabular-nums">
                  {`${formatSize(Math.max(0, sizeOf(kind)))} GB`}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </CardContent>
    </Card>
  )
}
