import {
  CaretDownIcon,
  ChartBarIcon,
  HandbagIcon,
  HouseIcon,
  type Icon as PhosphorIcon,
  StorefrontIcon,
  UsersIcon,
} from "phosphor-react-native"
import * as React from "react"
import { StyleSheet, View } from "react-native"
import { FadeInDown, ReduceMotion } from "react-native-reanimated"
import { AnimatedView } from "@/components/ui/animated-view"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  XAxis,
} from "@/components/ui/chart"
import { Chip, ChipGroup } from "@/components/ui/chip"
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
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { Screen } from "@/components/ui/screen"
import { TabBar, TabBarItem, TabBarList } from "@/components/ui/tab-bar"
import { Text } from "@/components/ui/text"
import {
  fontSize,
  palette,
  radius,
  type ThemeColors,
  useTheme,
} from "@/components/ui/theme"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type Tone = keyof ThemeColors | keyof typeof palette

function tone(colors: ThemeColors, key: Tone) {
  return { ...colors, ...palette }[key]
}

const SECTIONS: {
  value: string
  label: string
  icon: PhosphorIcon
  badge?: number
}[] = [
  { value: "overview", label: "Overview", icon: HouseIcon },
  { value: "orders", label: "Orders", icon: HandbagIcon, badge: 12 },
  { value: "customers", label: "Customers", icon: UsersIcon },
  { value: "reports", label: "Reports", icon: ChartBarIcon },
]

const STORES = ["All stores", "Union Square", "Fifth Avenue", "Michigan Avenue"]

const ranges = [
  { value: "24h", label: "24 Hours", scale: 0.15 },
  { value: "7d", label: "7 Days", scale: 1 },
  { value: "30d", label: "30 Days", scale: 4.3 },
]

const week = [
  { day: "Mon", online: 42, store: 46 },
  { day: "Tue", online: 58, store: 44 },
  { day: "Wed", online: 50, store: 56 },
  { day: "Thu", online: 68, store: 54 },
  { day: "Fri", online: 64, store: 70 },
  { day: "Sat", online: 80, store: 62 },
  { day: "Sun", online: 72, store: 76 },
]

const chartConfig = {
  online: { label: "Online", color: "chart-1" },
  store: { label: "In store", color: "chart-2" },
} satisfies ChartConfig

const SERIES = [
  { key: "online", swatch: "chart1" },
  { key: "store", swatch: "chart2" },
] as const

const orders: {
  id: string
  name: string
  product: string
  status: string
  total: number
  tint: Tone
}[] = [
  {
    id: "W1048",
    name: "Jamie Rivera",
    product: "Phone Pro",
    status: "Shipped",
    total: 999,
    tint: "blue500",
  },
  {
    id: "W1047",
    name: "Morgan Lee",
    product: "Book Air",
    status: "Processing",
    total: 1099,
    tint: "orange500",
  },
  {
    id: "W1046",
    name: "Riley Chen",
    product: "Watch Series 11",
    status: "Delivered",
    total: 399,
    tint: "green500",
  },
  {
    id: "W1045",
    name: "Avery Brooks",
    product: "Pods Studio",
    status: "Returned",
    total: 549,
    tint: "pink500",
  },
  {
    id: "W1044",
    name: "Taylor Kim",
    product: "Pad Air",
    status: "Delivered",
    total: 599,
    tint: "cyan500",
  },
]

const filters = ["All", "Shipped", "Delivered", "Returned"]

const styles = StyleSheet.create({
  other: { flex: 1, gap: 8, paddingHorizontal: 16, paddingTop: 52 },
  otherTitle: { ...fontSize["3xl"], fontWeight: "700" },
  body: { gap: 20, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32 },
  ranges: { alignSelf: "stretch" },
  range: { flex: 1 },
  stats: {
    flexDirection: "row",
    flexWrap: "wrap",
    overflow: "hidden",
    borderRadius: radius.xl,
  },
  stat: {
    width: "50%",
    gap: 2,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  caption: { ...fontSize.sm },
  statValue: {
    ...fontSize["2xl"],
    fontWeight: "600",
    letterSpacing: -0.7,
    fontVariant: ["tabular-nums"],
  },
  card: {
    borderRadius: radius.xl,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  summary: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  reading: { minWidth: 0, flex: 1 },
  total: {
    ...fontSize["2xl"],
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  legend: { flexDirection: "row", gap: 12 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  dot: { width: 8, height: 8, borderRadius: 9999 },
  chart: { marginTop: 14, height: 160 },
  orders: { marginBottom: -8, gap: 12 },
  heading: { paddingHorizontal: 4, ...fontSize.sm, fontWeight: "600" },
  price: { ...fontSize.base, fontVariant: ["tabular-nums"] },
  actions: { flexDirection: "column", alignItems: "flex-end", gap: 0 },
})

const THOUSANDS = /\B(?=(\d{3})+(?!\d))/g

function money(value: number) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value)
  } catch {
    return `$${Math.round(value).toString().replace(THOUSANDS, ",")}`
  }
}

function count(value: number) {
  try {
    return new Intl.NumberFormat("en-US").format(value)
  } catch {
    return String(value).replace(THOUSANDS, ",")
  }
}

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")

function StoreMenu({
  value,
  onValueChange,
}: {
  value: string
  onValueChange: (value: string) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="secondary" size="sm" />}
        accessibilityLabel={`Store, ${value}`}
      >
        <Icon as={StorefrontIcon} size={16} />
        <Icon as={CaretDownIcon} weight="bold" size={12} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup
          value={value}
          onValueChange={(next) => {
            if (typeof next === "string") onValueChange(next)
          }}
        >
          {STORES.map((store) => (
            <DropdownMenuRadioItem key={store} value={store}>
              <Text>{store}</Text>
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
      <Text style={[fontSize.lg, { color: colors.mutedForeground }]}>
        This section isn't part of the sample. Choose Overview.
      </Text>
    </View>
  )
}

function DashStore({
  onRangeChange,
  onFilterChange,
  onStoreChange,
  onOrderPress,
  onNavigate,
}: {
  onRangeChange?: (range: string) => void
  onFilterChange?: (filter: string) => void
  onStoreChange?: (store: string) => void
  onOrderPress?: (id: string) => void
  onNavigate?: (section: string) => void
}) {
  const { colors } = useTheme()
  const [section, setSection] = React.useState("overview")
  const [store, setStore] = React.useState("All stores")
  const [range, setRange] = React.useState("7d")
  const [filter, setFilter] = React.useState("All")
  const [active, setActive] = React.useState<number | null>(null)
  const scroll = useHeaderScroll()
  const scale = ranges.find((item) => item.value === range)?.scale ?? 1
  const data = week.map((day, index) => ({ ...day, index }))
  const activeDay = active === null ? undefined : week[active]
  const list = orders.filter(
    (order) => filter === "All" || order.status === filter
  )

  const stats = [
    {
      label: "Revenue",
      value: money(1284500 * scale),
      change: "+12.4%",
      up: true,
    },
    {
      label: "Orders",
      value: count(Math.round(842 * scale)),
      change: "+8.1%",
      up: true,
    },
    { label: "Average order", value: money(1525), change: "−2.3%", up: false },
    { label: "Conversion", value: "3.42%", change: "+0.4 pts", up: true },
  ]

  return (
    <Screen edges={["top", "right", "left"]}>
      {section === "overview" ? (
        <>
          <Header scroll={scroll}>
            <HeaderTitle>Overview</HeaderTitle>
            <HeaderActions>
              <StoreMenu
                value={store}
                onValueChange={(value) => {
                  setStore(value)
                  onStoreChange?.(value)
                }}
              />
            </HeaderActions>
          </Header>
          <HeaderScrollView scroll={scroll}>
            <HeaderLargeTitle subtitle={store}>Overview</HeaderLargeTitle>
            <View style={styles.body}>
              <ToggleGroup
                spacing={0}
                value={[range]}
                onValueChange={(value) => {
                  if (!value[0]) return
                  setRange(value[0])
                  onRangeChange?.(value[0])
                }}
                accessibilityLabel="Range"
                style={styles.ranges}
              >
                {ranges.map((item) => (
                  <ToggleGroupItem
                    key={item.value}
                    value={item.value}
                    size="sm"
                    style={styles.range}
                  >
                    <Text>{item.label}</Text>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <View style={[styles.stats, { backgroundColor: colors.muted }]}>
                {stats.map((stat, index) => (
                  <View
                    key={stat.label}
                    accessible
                    style={[
                      styles.stat,
                      { borderColor: colors.border },
                      index % 2 === 1 && {
                        borderStartWidth: StyleSheet.hairlineWidth,
                      },
                      index > 1 && { borderTopWidth: StyleSheet.hairlineWidth },
                    ]}
                  >
                    <Text
                      style={[
                        styles.caption,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      {stat.label}
                    </Text>
                    <Text
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      style={styles.statValue}
                    >
                      {stat.value}
                    </Text>
                    <Text
                      style={[
                        fontSize.xs,
                        { color: stat.up ? palette.green500 : palette.red500 },
                      ]}
                    >
                      {`${stat.change} vs. previous period`}
                    </Text>
                  </View>
                ))}
              </View>
              <View style={[styles.card, { backgroundColor: colors.muted }]}>
                <View style={styles.summary}>
                  <View accessibilityLiveRegion="polite" style={styles.reading}>
                    <Text
                      style={[
                        styles.caption,
                        { color: colors.mutedForeground },
                      ]}
                    >
                      {activeDay ? activeDay.day : "Weekly sales"}
                    </Text>
                    <Text style={styles.total}>
                      {activeDay
                        ? money((activeDay.online + activeDay.store) * 1000)
                        : money(1284500 * scale)}
                    </Text>
                  </View>
                  <View style={styles.legend}>
                    {SERIES.map((series) => (
                      <View key={series.key} style={styles.legendItem}>
                        <View
                          style={[
                            styles.dot,
                            { backgroundColor: tone(colors, series.swatch) },
                          ]}
                        />
                        <Text
                          style={[
                            fontSize.xs,
                            { color: colors.mutedForeground },
                          ]}
                        >
                          {chartConfig[series.key].label}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
                <ChartContainer
                  config={chartConfig}
                  accessibilityLabel="Weekly sales"
                  style={styles.chart}
                >
                  <BarChart
                    data={data}
                    barGap={3}
                    margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
                    onActiveIndexChange={setActive}
                  >
                    <CartesianGrid vertical={false} strokeDasharray="3 3" />
                    <XAxis dataKey="day" tickMargin={6} />
                    <ChartTooltip content={() => null} cursor={false} />
                    {SERIES.map((series) => (
                      <Bar
                        isAnimationActive={false}
                        key={series.key}
                        dataKey={series.key}
                        fill={chartConfig[series.key].color}
                        radius={3}
                        maxBarSize={12}
                      >
                        {data.map((day) => (
                          <Cell
                            key={day.day}
                            fillOpacity={
                              active === null || active === day.index ? 1 : 0.35
                            }
                          />
                        ))}
                      </Bar>
                    ))}
                  </BarChart>
                </ChartContainer>
              </View>
              <View style={styles.orders}>
                <Text role="heading" style={styles.heading}>
                  Recent orders
                </Text>
                <ChipGroup
                  value={[filter]}
                  onValueChange={(value) => {
                    if (!value[0]) return
                    setFilter(value[0])
                    onFilterChange?.(value[0])
                  }}
                  accessibilityLabel="Order status"
                >
                  {filters.map((item) => (
                    <Chip key={item} value={item}>
                      {item}
                    </Chip>
                  ))}
                </ChipGroup>
              </View>
              <AnimatedView
                key={filter}
                entering={FadeInDown.duration(700).reduceMotion(
                  ReduceMotion.System
                )}
              >
                <ItemGroup variant="inset">
                  {list.map((order, index) => (
                    <React.Fragment key={order.id}>
                      {index > 0 ? (
                        <ItemSeparator style={{ marginStart: 60 }} />
                      ) : null}
                      <Item size="sm" onPress={() => onOrderPress?.(order.id)}>
                        <Avatar>
                          <AvatarFallback
                            style={{
                              backgroundColor: tone(colors, order.tint),
                            }}
                          >
                            {initials(order.name)}
                          </AvatarFallback>
                        </Avatar>
                        <ItemContent style={{ gap: 0 }}>
                          <ItemTitle style={{ fontWeight: "600" }}>
                            {order.name}
                          </ItemTitle>
                          <ItemDescription style={fontSize.sm}>
                            {`${order.product} · ${order.id}`}
                          </ItemDescription>
                        </ItemContent>
                        <ItemActions style={styles.actions}>
                          <Text style={styles.price}>{money(order.total)}</Text>
                          <Text
                            style={[
                              fontSize.xs,
                              {
                                color:
                                  order.status === "Returned"
                                    ? colors.destructive
                                    : colors.mutedForeground,
                              },
                            ]}
                          >
                            {order.status}
                          </Text>
                        </ItemActions>
                      </Item>
                    </React.Fragment>
                  ))}
                </ItemGroup>
              </AnimatedView>
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
            <TabBarItem
              key={item.value}
              value={item.value}
              icon={item.icon}
              badge={item.badge}
            >
              {item.label}
            </TabBarItem>
          ))}
        </TabBarList>
      </TabBar>
    </Screen>
  )
}

export { DashStore }
