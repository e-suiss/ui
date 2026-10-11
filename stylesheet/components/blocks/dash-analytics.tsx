import {
  CaretDownIcon,
  ChartBarIcon,
  FlameIcon,
  NotePencilIcon,
  type Icon as PhosphorIcon,
  StarIcon,
  TagIcon,
} from "phosphor-react-native"
import * as React from "react"
import { ScrollView, StyleSheet, View } from "react-native"
import { Button } from "@/components/ui/button"
import {
  Area,
  AreaChart,
  CartesianGrid,
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  XAxis,
} from "@/components/ui/chart"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Header,
  HeaderActions,
  HeaderLargeTitle,
  HeaderScrollView,
  HeaderTitle,
  useHeaderScroll,
} from "@/components/ui/header"
import { Icon } from "@/components/ui/icon"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { Screen } from "@/components/ui/screen"
import { TabBar, TabBarItem, TabBarList } from "@/components/ui/tab-bar"
import { Text } from "@/components/ui/text"
import { fontSize, radius, useTheme } from "@/components/ui/theme"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const apps: { value: string; label: string; icon: PhosphorIcon }[] = [
  { value: "route", label: "Route", icon: ChartBarIcon },
  { value: "notebook", label: "Notebook", icon: NotePencilIcon },
  { value: "fitness", label: "Fitness+", icon: FlameIcon },
]

const SECTIONS: { value: string; label: string; icon: PhosphorIcon }[] = [
  { value: "analytics", label: "Analytics", icon: ChartBarIcon },
  { value: "sales", label: "Sales and Trends", icon: TagIcon },
  { value: "ratings", label: "Ratings", icon: StarIcon },
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
  value: { label: "Value", color: "accent" },
} satisfies ChartConfig

const styles = StyleSheet.create({
  other: { flex: 1, gap: 8, paddingHorizontal: 16, paddingTop: 52 },
  otherTitle: { ...fontSize["3xl"], fontWeight: "700" },
  body: { gap: 20, paddingTop: 12, paddingBottom: 32 },
  metrics: { paddingHorizontal: 16 },
  card: {
    marginHorizontal: 16,
    borderRadius: radius.xl,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
  },
  summary: { flexDirection: "row", alignItems: "flex-end", gap: 10 },
  reading: { minWidth: 0, flex: 1 },
  caption: { ...fontSize.sm },
  value: {
    ...fontSize["3xl"],
    fontWeight: "700",
    letterSpacing: -0.75,
    fontVariant: ["tabular-nums"],
  },
  change: { ...fontSize.sm, fontWeight: "600" },
  chart: { marginTop: 12, height: 176 },
  heading: {
    marginBottom: -10,
    paddingHorizontal: 20,
    ...fontSize.sm,
    fontWeight: "600",
  },
  group: { paddingHorizontal: 16 },
  amount: { textAlign: "right", fontVariant: ["tabular-nums"] },
})

function AppMenu({
  value,
  onValueChange,
}: {
  value: string
  onValueChange: (value: string) => void
}) {
  const { colors } = useTheme()
  const current = apps.find((item) => item.value === value) ?? apps[0]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="secondary" size="sm" />}
        accessibilityLabel={`App, ${current?.label}`}
      >
        {current ? <Icon as={current.icon} size={16} /> : null}
        <Text>{current?.label}</Text>
        <Icon as={CaretDownIcon} weight="bold" size={12} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(next) => {
            if (typeof next === "string") onValueChange(next)
          }}
        >
          {apps.map((item) => (
            <DropdownMenuRadioItem key={item.value} value={item.value}>
              <Icon as={item.icon} size={18} color={colors.label} />
              <Text>{item.label}</Text>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function OtherSection({ value }: { value: string }) {
  const { colors } = useTheme()
  const label = SECTIONS.find((section) => section.value === value)?.label
  return (
    <View style={styles.other}>
      <Text role="heading" style={styles.otherTitle}>
        {label}
      </Text>
      <Text style={[fontSize.lg, { color: colors.labelSecondary }]}>
        This section isn't part of the sample. Choose Analytics.
      </Text>
    </View>
  )
}

function DashAnalytics({
  onAppChange,
  onMetricChange,
  onNavigate,
}: {
  onAppChange?: (app: string) => void
  onMetricChange?: (metric: string) => void
  onNavigate?: (section: string) => void
}) {
  const { colors } = useTheme()
  const [section, setSection] = React.useState("analytics")
  const [app, setApp] = React.useState("route")
  const [metricValue, setMetricValue] = React.useState("downloads")
  const [active, setActive] = React.useState<number | null>(null)
  const scroll = useHeaderScroll()
  const appIndex = Math.max(
    0,
    apps.findIndex((item) => item.value === app)
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
  const title = apps[appIndex]?.label

  return (
    <Screen edges={["top", "right", "left"]}>
      {section === "analytics" ? (
        <>
          <Header scroll={scroll}>
            <HeaderTitle>{title}</HeaderTitle>
            <HeaderActions>
              <AppMenu
                value={app}
                onValueChange={(value) => {
                  setApp(value)
                  onAppChange?.(value)
                }}
              />
            </HeaderActions>
          </Header>
          <HeaderScrollView scroll={scroll}>
            <HeaderLargeTitle subtitle="Last 12 weeks · All regions">
              {title}
            </HeaderLargeTitle>
            <View style={styles.body}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ flexGrow: 0 }}
                contentContainerStyle={styles.metrics}
              >
                <ToggleGroup
                  spacing={0}
                  value={[metricValue]}
                  onValueChange={(value) => {
                    if (!value[0]) return
                    setMetricValue(value[0])
                    onMetricChange?.(value[0])
                  }}
                  accessibilityLabel="Metric"
                >
                  {metrics.map((item) => (
                    <ToggleGroupItem
                      key={item.value}
                      value={item.value}
                      size="sm"
                    >
                      <Text>{item.label}</Text>
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </ScrollView>
              <View
                style={[
                  styles.card,
                  { backgroundColor: colors.surfaceSecondary },
                ]}
              >
                <View style={styles.summary}>
                  <View accessibilityLiveRegion="polite" style={styles.reading}>
                    <Text
                      style={[styles.caption, { color: colors.labelSecondary }]}
                    >
                      {`${current === data.length - 1 ? "This week" : point.week} · ${metric.label}`}
                    </Text>
                    <Text style={styles.value}>{format(point.value)}</Text>
                  </View>
                  <Text style={[styles.change, { color: colors.green }]}>
                    {`+${12 + metrics.indexOf(metric) * 3}%`}
                  </Text>
                </View>
                <ChartContainer
                  config={chartConfig}
                  accessibilityLabel={metric.label}
                  style={styles.chart}
                >
                  <AreaChart
                    data={data}
                    margin={{ top: 8, right: 6, left: 6, bottom: 0 }}
                    onActiveIndexChange={setActive}
                  >
                    <CartesianGrid vertical={false} strokeDasharray="2 4" />
                    <XAxis dataKey="week" hide />
                    <ChartTooltip
                      content={() => null}
                      cursor={{ stroke: "separator-strong" }}
                      defaultIndex={data.length - 1}
                    />
                    <Area
                      dataKey="value"
                      type="linear"
                      stroke="accent"
                      strokeWidth={2.5}
                      fill={{
                        stops: [
                          { offset: 0, opacity: 0.22 },
                          { offset: 1, opacity: 0 },
                        ],
                      }}
                      activeDot={{
                        r: 5,
                        fill: "accent",
                        stroke: "surface-secondary",
                        strokeWidth: 2,
                      }}
                    />
                  </AreaChart>
                </ChartContainer>
              </View>
              <Text role="heading" style={styles.heading}>
                By region
              </Text>
              <View style={styles.group}>
                <ItemGroup variant="inset">
                  {regions.map((region, index) => (
                    <React.Fragment key={region.name}>
                      {index > 0 ? <ItemSeparator /> : null}
                      <Item size="sm">
                        <ItemContent>
                          <ItemTitle style={{ fontWeight: "400" }}>
                            {region.name}
                          </ItemTitle>
                        </ItemContent>
                        <ItemActions>
                          <Text style={styles.amount}>
                            {format(latest * region.share)}
                          </Text>
                        </ItemActions>
                      </Item>
                    </React.Fragment>
                  ))}
                </ItemGroup>
              </View>
            </View>
          </HeaderScrollView>
        </>
      ) : (
        <OtherSection value={section} />
      )}
      <TabBar
        value={section}
        onValueChange={(value) => {
          setSection(value)
          onNavigate?.(value)
        }}
      >
        <TabBarList>
          {SECTIONS.map((item) => (
            <TabBarItem key={item.value} value={item.value} icon={item.icon}>
              {item.label}
            </TabBarItem>
          ))}
        </TabBarList>
      </TabBar>
    </Screen>
  )
}

export { DashAnalytics }
