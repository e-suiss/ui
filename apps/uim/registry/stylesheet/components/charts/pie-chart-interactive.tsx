import * as React from "react"
import { Pressable, StyleSheet, View } from "react-native"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  Pie,
  PieChart,
} from "@/components/ui/chart"
import { Text } from "@/components/ui/text"
import { fontSize, type ThemeColors, useTheme } from "@/components/ui/theme"
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
  apps: { label: "Apps", color: "red" },
  photos: { label: "Photos", color: "orange" },
  system: { label: "System", color: "gray" },
  backups: { label: "Backups", color: "purple" },
  drive: { label: "Drive", color: "blue" },
  messages: { label: "Messages", color: "green" },
  mail: { label: "Mail", color: "cyan" },
  other: { label: "Other", color: "yellow" },
  free: { label: "Free", color: "control" },
} satisfies ChartConfig

const SWATCH: Record<Kind, keyof ThemeColors> = {
  apps: "red",
  photos: "orange",
  system: "gray",
  backups: "purple",
  drive: "blue",
  messages: "green",
  mail: "cyan",
  other: "yellow",
  free: "control",
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 16,
  },
  heading: { minWidth: 192, flexGrow: 1, gap: 2 },
  title: { ...fontSize.lg, fontWeight: "600" },
  caption: { ...fontSize.sm, fontVariant: ["tabular-nums"] },
  device: { paddingHorizontal: 20 },
  content: { gap: 20 },
  bar: {
    height: 10,
    flexDirection: "row",
    overflow: "hidden",
    borderRadius: 9999,
  },
  segment: { height: "100%" },
  dimmed: { opacity: 0.35 },
  body: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  pie: { width: 280, height: 280, maxWidth: "100%" },
  center: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
  },
  value: {
    ...fontSize["3xl"],
    fontWeight: "600",
    letterSpacing: -0.75,
    fontVariant: ["tabular-nums"],
  },
  chart: { width: "100%", height: "100%", aspectRatio: 1 },
  list: { minWidth: 240, flexGrow: 1, flexBasis: 240 },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 9,
  },
  dot: { width: 10, height: 10, flexShrink: 0, borderRadius: 9999 },
  name: { flexGrow: 1, ...fontSize.base },
  size: { ...fontSize.base, fontVariant: ["tabular-nums"] },
})

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
  const { colors } = useTheme()
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
      <CardHeader style={styles.header}>
        <View style={styles.heading}>
          <Text style={styles.title}>{`${STORAGE[device].label} storage`}</Text>
          <Text style={[styles.caption, { color: colors.labelSecondary }]}>
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
            <ToggleGroupItem
              key={key}
              value={key}
              size="sm"
              style={styles.device}
            >
              <Text>{STORAGE[key].label}</Text>
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </CardHeader>
      <CardContent style={styles.content}>
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={[styles.bar, { backgroundColor: colors.control }]}
        >
          {KINDS.filter((kind) => kind !== "free").map((kind) => {
            const share = (Math.max(0, sizeOf(kind)) / total) * 100
            return (
              <View
                key={kind}
                style={[
                  styles.segment,
                  {
                    width: `${share}%`,
                    marginEnd: Math.min(2, share * 4),
                    backgroundColor: colors[SWATCH[kind]],
                  },
                  active && active !== kind && styles.dimmed,
                ]}
              />
            )
          })}
        </View>
        <View style={styles.body}>
          <View style={styles.pie}>
            <View
              pointerEvents="none"
              accessibilityLiveRegion="polite"
              style={styles.center}
            >
              <Text style={[styles.caption, { color: colors.labelSecondary }]}>
                {active ? chartConfig[active].label : "Used"}
              </Text>
              <Text style={styles.value}>
                {`${formatSize(activeValue)} GB`}
              </Text>
              <Text style={[styles.caption, { color: colors.labelSecondary }]}>
                {`${Math.round((activeValue / total) * 100)}%`}
              </Text>
            </View>
            <ChartContainer
              config={chartConfig}
              accessibilityLabel={`${STORAGE[device].label} storage`}
              style={styles.chart}
            >
              <PieChart
                key={device}
                onActiveIndexChange={(index) =>
                  setActive(index === null ? null : (KINDS[index] ?? null))
                }
              >
                <Pie
                  data={data}
                  dataKey="size"
                  nameKey="kind"
                  innerRadius="64%"
                  outerRadius="88%"
                  startAngle={90}
                  endAngle={-270}
                  stroke="surface-secondary"
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
          <View style={styles.list}>
            {KINDS.filter((kind) => sizeOf(kind) > 0).map((kind) => (
              <Pressable
                key={kind}
                role="button"
                accessibilityState={{ selected: active === kind }}
                onPress={() =>
                  setActive((current) => (current === kind ? null : kind))
                }
                style={[
                  styles.row,
                  active === kind && { backgroundColor: colors.control },
                ]}
              >
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: colors[SWATCH[kind]] },
                    kind === "free" && {
                      borderWidth: 1,
                      borderColor: colors.separatorStrong,
                    },
                  ]}
                />
                <Text style={styles.name}>{chartConfig[kind].label}</Text>
                <Text style={[styles.size, { color: colors.labelSecondary }]}>
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
