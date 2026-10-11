import { cn } from "cn"
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
import { View } from "react-native"
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

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
  online: { label: "Online", color: "blue" },
  store: { label: "In store", color: "teal" },
} satisfies ChartConfig

const SERIES = [
  { key: "online", swatch: "bg-blue" },
  { key: "store", swatch: "bg-teal" },
] as const

const orders = [
  {
    id: "W1048",
    name: "Jamie Rivera",
    product: "Phone Pro",
    status: "Shipped",
    total: 999,
    tint: "bg-blue dark:bg-blue",
  },
  {
    id: "W1047",
    name: "Morgan Lee",
    product: "Book Air",
    status: "Processing",
    total: 1099,
    tint: "bg-orange dark:bg-orange",
  },
  {
    id: "W1046",
    name: "Riley Chen",
    product: "Watch Series 11",
    status: "Delivered",
    total: 399,
    tint: "bg-green dark:bg-green",
  },
  {
    id: "W1045",
    name: "Avery Brooks",
    product: "Pods Studio",
    status: "Returned",
    total: 549,
    tint: "bg-pink dark:bg-pink",
  },
  {
    id: "W1044",
    name: "Taylor Kim",
    product: "Pad Air",
    status: "Delivered",
    total: 599,
    tint: "bg-cyan dark:bg-cyan",
  },
]

const filters = ["All", "Shipped", "Delivered", "Returned"]

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
        <Icon as={StorefrontIcon} className="size-4" />
        <Icon as={CaretDownIcon} weight="bold" className="size-3" />
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
  const label = SECTIONS.find((section) => section.value === value)?.label
  return (
    <View className="flex-1 gap-2 px-4 pt-[3.25rem]">
      <Text role="heading" className="text-3xl font-bold">
        {label}
      </Text>
      <Text className="text-lg text-label-secondary">
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
            <View className="gap-5 px-4 pt-3 pb-8">
              <ToggleGroup
                spacing={0}
                value={[range]}
                onValueChange={(value) => {
                  if (!value[0]) return
                  setRange(value[0])
                  onRangeChange?.(value[0])
                }}
                accessibilityLabel="Range"
                className="self-stretch"
              >
                {ranges.map((item) => (
                  <ToggleGroupItem
                    key={item.value}
                    value={item.value}
                    size="sm"
                    className="flex-1"
                  >
                    <Text>{item.label}</Text>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <View className="flex-row flex-wrap overflow-hidden rounded-xl bg-surface-secondary">
                {stats.map((stat, index) => (
                  <View
                    key={stat.label}
                    accessible
                    className={cn(
                      "w-1/2 gap-0.5 border-separator px-4 py-3.5",
                      index % 2 === 1 && "border-s",
                      index > 1 && "border-t"
                    )}
                  >
                    <Text className="text-sm text-label-secondary">
                      {stat.label}
                    </Text>
                    <Text
                      numberOfLines={1}
                      adjustsFontSizeToFit
                      className="text-2xl font-semibold tracking-tight tabular-nums"
                    >
                      {stat.value}
                    </Text>
                    <Text
                      className={cn(
                        "text-xs",
                        stat.up ? "text-green" : "text-red"
                      )}
                    >
                      {`${stat.change} vs. previous period`}
                    </Text>
                  </View>
                ))}
              </View>
              <View className="rounded-xl bg-surface-secondary px-4 pt-3.5 pb-2">
                <View className="flex-row items-start gap-2">
                  <View
                    accessibilityLiveRegion="polite"
                    className="min-w-0 flex-1"
                  >
                    <Text className="text-sm text-label-secondary">
                      {activeDay ? activeDay.day : "Weekly sales"}
                    </Text>
                    <Text className="text-2xl font-semibold tabular-nums">
                      {activeDay
                        ? money((activeDay.online + activeDay.store) * 1000)
                        : money(1284500 * scale)}
                    </Text>
                  </View>
                  <View className="flex-row gap-3">
                    {SERIES.map((series) => (
                      <View
                        key={series.key}
                        className="flex-row items-center gap-[0.3125rem]"
                      >
                        <View
                          className={cn("size-2 rounded-full", series.swatch)}
                        />
                        <Text className="text-xs text-label-secondary">
                          {chartConfig[series.key].label}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
                <ChartContainer
                  config={chartConfig}
                  accessibilityLabel="Weekly sales"
                  className="mt-3.5 h-40 w-full"
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
              <View className="-mb-2 gap-3">
                <Text role="heading" className="px-1 text-sm font-semibold">
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
                        <ItemSeparator className="ms-[3.75rem]" />
                      ) : null}
                      <Item size="sm" onPress={() => onOrderPress?.(order.id)}>
                        <Avatar>
                          <AvatarFallback className={order.tint}>
                            {initials(order.name)}
                          </AvatarFallback>
                        </Avatar>
                        <ItemContent className="gap-0">
                          <ItemTitle className="font-semibold">
                            {order.name}
                          </ItemTitle>
                          <ItemDescription className="text-sm">
                            {`${order.product} · ${order.id}`}
                          </ItemDescription>
                        </ItemContent>
                        <ItemActions className="flex-col items-end gap-0">
                          <Text className="text-base tabular-nums">
                            {money(order.total)}
                          </Text>
                          <Text
                            className={cn(
                              "text-xs",
                              order.status === "Returned"
                                ? "text-danger"
                                : "text-label-secondary"
                            )}
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
