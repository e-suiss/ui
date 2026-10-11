"use client"

import {
  ChartBarIcon,
  HandbagIcon,
  HouseIcon,
  StorefrontIcon,
  UsersIcon,
} from "@phosphor-icons/react"
import * as React from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  useActiveTooltipDataPoints,
  XAxis,
} from "recharts"

import {
  AppShell,
  type AppShellItem,
  AppShellTrigger,
} from "@/components/patterns/app-shell"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const items: AppShellItem[] = [
  { value: "overview", label: "Overview", icon: <HouseIcon /> },
  { value: "orders", label: "Orders", icon: <HandbagIcon />, badge: 12 },
  { value: "customers", label: "Customers", icon: <UsersIcon /> },
  { value: "reports", label: "Reports", icon: <ChartBarIcon /> },
  ...["Union Square", "Fifth Avenue", "Michigan Avenue"].map((store) => ({
    value: store,
    label: store,
    icon: <StorefrontIcon />,
    group: "Stores",
  })),
]

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
  online: { label: "Online", color: "var(--blue)" },
  store: { label: "In store", color: "var(--teal)" },
} satisfies ChartConfig

const orders = [
  {
    id: "W1048",
    name: "Jamie Rivera",
    product: "Phone Pro",
    status: "Shipped",
    total: 999,
    hue: 250,
  },
  {
    id: "W1047",
    name: "Morgan Lee",
    product: "Book Air",
    status: "Processing",
    total: 1099,
    hue: 30,
  },
  {
    id: "W1046",
    name: "Riley Chen",
    product: "Watch Series 11",
    status: "Delivered",
    total: 399,
    hue: 150,
  },
  {
    id: "W1045",
    name: "Avery Brooks",
    product: "Pods Studio",
    status: "Returned",
    total: 549,
    hue: 330,
  },
  {
    id: "W1044",
    name: "Taylor Kim",
    product: "Pad Air",
    status: "Delivered",
    total: 599,
    hue: 200,
  },
]

const filters = ["All", "Shipped", "Delivered", "Returned"]

const money = (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  })

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")

function ActiveDay({ onChange }: { onChange: (index: number | null) => void }) {
  const points = useActiveTooltipDataPoints<{ index?: number }>()
  const index = points?.[0]?.index ?? null

  React.useEffect(() => onChange(index), [index, onChange])

  return null
}

export function DashStore() {
  const [section, setSection] = React.useState("overview")
  const [range, setRange] = React.useState("7d")
  const [filter, setFilter] = React.useState("All")
  const [active, setActive] = React.useState<number | null>(null)
  const scale = ranges.find((item) => item.value === range)?.scale ?? 1
  const data = week.map((day, index) => ({ ...day, index }))
  const activeDay = active === null ? undefined : week[active]
  const title = items.find((item) => item.value === section)?.label

  const stats = [
    {
      label: "Revenue",
      value: money(1284500 * scale),
      change: "+12.4%",
      up: true,
    },
    {
      label: "Orders",
      value: Math.round(842 * scale).toLocaleString("en-US"),
      change: "+8.1%",
      up: true,
    },
    { label: "Average order", value: money(1525), change: "−2.3%", up: false },
    { label: "Conversion", value: "3.42%", change: "+0.4 pts", up: true },
  ]

  return (
    <AppShell
      items={items}
      value={section}
      onValueChange={setSection}
      header={
        <p className="flex items-center gap-2 px-2 pt-1 text-base font-semibold">
          <span className="font-bold tracking-tight">suiss</span>
          Store Admin
        </p>
      }
      footer={
        <div className="flex items-center gap-2.5 px-2 pb-1">
          <Avatar>
            <AvatarFallback>JR</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Jamie Rivera</span>
            <span className="text-xs text-label-secondary">Admin</span>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-5 px-5 py-5.5 md:px-7">
        <div className="flex flex-wrap items-start gap-4">
          <AppShellTrigger className="-ms-2 mt-1" />
          <div className="flex flex-1 flex-col">
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="text-sm text-label-secondary">All stores</p>
          </div>
          <ToggleGroup
            spacing={0}
            value={[range]}
            onValueChange={(value: string[]) => {
              if (value[0]) setRange(value[0])
            }}
            aria-label="Range"
          >
            {ranges.map((item) => (
              <ToggleGroupItem key={item.value} value={item.value} size="sm">
                {item.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <dl className="grid grid-cols-2 overflow-hidden rounded-xl bg-surface-secondary">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              data-index={index}
              className="flex flex-col gap-0.5 border-separator px-4 py-3.5 data-[index='1']:border-s data-[index='2']:border-t data-[index='3']:border-s data-[index='3']:border-t"
            >
              <dt className="text-sm text-label-secondary">{stat.label}</dt>
              <dd className="text-2xl font-semibold tracking-tight tabular-nums">
                {stat.value}
              </dd>
              <dd
                data-up={stat.up ? "" : undefined}
                className="text-xs text-[color-mix(in_oklab,var(--red),var(--label)_25%)] data-up:text-[color-mix(in_oklab,var(--green),var(--label)_45%)] dark:text-red dark:data-up:text-green"
              >
                {stat.change} vs. previous period
              </dd>
            </div>
          ))}
        </dl>
        <div className="rounded-xl bg-surface-secondary px-4 pt-3.5 pb-2">
          <div className="flex items-start gap-2">
            <div className="flex flex-1 flex-col" aria-live="polite">
              <span className="text-sm text-label-secondary">
                {activeDay ? activeDay.day : "Weekly sales"}
              </span>
              <span className="text-2xl font-semibold tabular-nums">
                {activeDay
                  ? money((activeDay.online + activeDay.store) * 1000)
                  : money(1284500 * scale)}
              </span>
            </div>
            <div className="flex gap-3 text-xs text-label-secondary">
              {(["online", "store"] as const).map((key) => (
                <span key={key} className="flex items-center gap-1.25">
                  <span
                    style={{ background: chartConfig[key].color }}
                    className="size-2 rounded-full"
                  />
                  {chartConfig[key].label}
                </span>
              ))}
            </div>
          </div>
          <ChartContainer
            config={chartConfig}
            className="mt-3.5 aspect-auto h-40 w-full"
          >
            <BarChart
              accessibilityLayer
              data={data}
              barGap={3}
              margin={{ top: 4, right: 0, left: 0, bottom: 0 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={6}
              />
              <ChartTooltip content={() => null} cursor={false} />
              {(["online", "store"] as const).map((key) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={`var(--color-${key})`}
                  radius={3}
                  maxBarSize={12}
                  isAnimationActive={false}
                >
                  {data.map((day) => (
                    <Cell
                      key={day.day}
                      fillOpacity={
                        active === null || active === day.index ? 1 : 0.35
                      }
                      className="transition-[fill-opacity] duration-200"
                    />
                  ))}
                </Bar>
              ))}
              <ActiveDay onChange={setActive} />
            </BarChart>
          </ChartContainer>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="flex-1 px-1 text-sm font-semibold">Recent orders</h2>
          <ToggleGroup
            spacing={0}
            value={[filter]}
            onValueChange={(value: string[]) => {
              if (value[0]) setFilter(value[0])
            }}
            aria-label="Order status"
          >
            {filters.map((item) => (
              <ToggleGroupItem key={item} value={item} size="sm">
                {item}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <ItemGroup
          variant="inset"
          className="**:data-[slot=item-separator]:ms-15"
        >
          {orders
            .filter((order) => filter === "All" || order.status === filter)
            .map((order, index) => (
              <React.Fragment key={`${filter}-${order.id}`}>
                {index > 0 && <ItemSeparator />}
                <Item
                  size="sm"
                  role="listitem"
                  className="transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] starting:translate-y-1.5 starting:opacity-0 motion-reduce:transition-none"
                >
                  <Avatar>
                    <AvatarFallback
                      style={{
                        background: `linear-gradient(160deg, oklch(0.78 0.1 ${order.hue}), oklch(0.6 0.14 ${order.hue + 30}))`,
                      }}
                      className="text-white"
                    >
                      {initials(order.name)}
                    </AvatarFallback>
                  </Avatar>
                  <ItemContent className="gap-0">
                    <ItemTitle className="font-semibold">
                      {order.name}
                    </ItemTitle>
                    <ItemDescription className="text-sm">
                      {order.product} · {order.id}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions className="gap-4 text-sm">
                    <span
                      data-returned={
                        order.status === "Returned" ? "" : undefined
                      }
                      className="hidden w-24 text-end text-label-secondary data-returned:text-danger sm:block"
                    >
                      {order.status}
                    </span>
                    <span className="w-20 text-end text-base tabular-nums">
                      {money(order.total)}
                    </span>
                  </ItemActions>
                </Item>
              </React.Fragment>
            ))}
        </ItemGroup>
      </div>
    </AppShell>
  )
}
