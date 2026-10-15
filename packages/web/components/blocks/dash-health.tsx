"use client"

import {
  CaretRightIcon,
  ChartBarIcon,
  FlameIcon,
  HeartIcon,
  MinusIcon,
  MoonIcon,
  PlusIcon,
  UsersIcon,
} from "@phosphor-icons/react"
import * as React from "react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

type Category = "Activity" | "Heart" | "Sleep" | "Mobility"

type CategoryStyle = {
  value: Category
  icon: React.ElementType
  tint: string
  text: string
}

const categories: [CategoryStyle, ...CategoryStyle[]] = [
  {
    value: "Activity",
    icon: FlameIcon,
    tint: "bg-orange-500",
    text: "text-[color-mix(in_oklab,var(--color-orange-500),var(--foreground)_45%)] dark:text-orange-500",
  },
  {
    value: "Heart",
    icon: HeartIcon,
    tint: "bg-red-500",
    text: "text-[color-mix(in_oklab,var(--color-red-500),var(--foreground)_25%)] dark:text-red-500",
  },
  {
    value: "Sleep",
    icon: MoonIcon,
    tint: "bg-cyan-500",
    text: "text-[color-mix(in_oklab,var(--color-cyan-500),var(--foreground)_50%)] dark:text-cyan-500",
  },
  {
    value: "Mobility",
    icon: ChartBarIcon,
    tint: "bg-green-500",
    text: "text-[color-mix(in_oklab,var(--color-green-500),var(--foreground)_45%)] dark:text-green-500",
  },
]

const metrics: {
  category: Category
  label: string
  value: string
  unit?: string
  color: string
  data: number[]
  bars?: boolean
}[] = [
  {
    category: "Activity",
    label: "Move",
    value: "486",
    unit: "kcal",
    color: "var(--color-red-500)",
    data: [40, 62, 38, 70, 55, 81, 65],
    bars: true,
  },
  {
    category: "Activity",
    label: "Steps",
    value: "8,412",
    unit: "steps",
    color: "var(--color-orange-500)",
    data: [60, 80, 45, 90, 70, 95, 52],
    bars: true,
  },
  {
    category: "Heart",
    label: "Resting Heart Rate",
    value: "58",
    unit: "bpm",
    color: "var(--color-red-500)",
    data: [61, 60, 59, 58, 60, 57, 58],
  },
  {
    category: "Sleep",
    label: "Sleep",
    value: "7 hr 12 min",
    color: "var(--color-cyan-500)",
    data: [68, 74, 59, 79, 64, 86, 72],
    bars: true,
  },
  {
    category: "Heart",
    label: "Cardio Fitness",
    value: "42.1",
    unit: "VO₂ max",
    color: "var(--color-red-500)",
    data: [40, 40, 41, 41, 42, 42, 42],
  },
  {
    category: "Mobility",
    label: "Walking Speed",
    value: "5.1",
    unit: "km/h",
    color: "var(--color-green-500)",
    data: [48, 50, 49, 51, 50, 52, 51],
  },
]

function Tile({ icon: Icon, tint }: { icon: React.ElementType; tint: string }) {
  return (
    <span
      className={`flex size-6 shrink-0 items-center justify-center rounded-md text-white ${tint}`}
    >
      <Icon weight="fill" className="size-3.5" />
    </span>
  )
}

type NavItem = {
  value: string
  label: string
  icon: React.ReactNode
  badge?: React.ReactNode
  group?: string
}

function NavSidebar({
  items,
  value,
  onValueChange,
  header,
  footer,
}: {
  items: NavItem[]
  value: string
  onValueChange: (value: string) => void
  header?: React.ReactNode
  footer?: React.ReactNode
}) {
  const { isMobile, setOpenMobile } = useSidebar()
  const groups = [...new Set(items.map((item) => item.group ?? ""))]

  return (
    <Sidebar collapsible="icon">
      {header && (
        <SidebarHeader className="group-data-[collapsible=icon]:hidden">
          {header}
        </SidebarHeader>
      )}
      <SidebarContent>
        {groups.map((group) => (
          <SidebarGroup key={group}>
            {group && <SidebarGroupLabel>{group}</SidebarGroupLabel>}
            <SidebarGroupContent>
              <SidebarMenu>
                {items
                  .filter((item) => (item.group ?? "") === group)
                  .map((item) => (
                    <SidebarMenuItem key={item.value}>
                      <SidebarMenuButton
                        isActive={item.value === value}
                        tooltip={item.label}
                        aria-current={item.value === value ? "page" : undefined}
                        onClick={() => {
                          onValueChange(item.value)
                          if (isMobile) setOpenMobile(false)
                        }}
                      >
                        {item.icon}
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                      {item.badge !== undefined && (
                        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                      )}
                    </SidebarMenuItem>
                  ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      {footer && (
        <SidebarFooter className="group-data-[collapsible=icon]:hidden">
          {footer}
        </SidebarFooter>
      )}
      <SidebarRail />
    </Sidebar>
  )
}

const items: NavItem[] = [
  {
    value: "Summary",
    label: "Summary",
    icon: <Tile icon={HeartIcon} tint="bg-pink-500" />,
  },
  {
    value: "Sharing",
    label: "Sharing",
    icon: <Tile icon={UsersIcon} tint="bg-blue-500" />,
  },
  ...categories.map((category) => ({
    value: category.value,
    label: category.value,
    icon: <Tile icon={category.icon} tint={category.tint} />,
    group: "Categories",
  })),
]

const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]

function Spark({
  data,
  color,
  bars,
}: {
  data: number[]
  color: string
  bars?: boolean
}) {
  const max = Math.max(...data)
  const min = Math.min(...data)

  if (bars) {
    return (
      <span aria-hidden className="flex h-9 items-end gap-1">
        {data.map((value, index) => (
          <span
            key={days[index]}
            style={{ height: `${(value / max) * 100}%`, background: color }}
            className="w-2 rounded-[3px] opacity-45 last:opacity-100"
          />
        ))}
      </span>
    )
  }

  const points = data
    .map(
      (value, index) =>
        `${((index / (data.length - 1)) * 120).toFixed(1)},${(36 - ((value - min) / Math.max(1, max - min)) * 30 - 3).toFixed(1)}`
    )
    .join(" ")

  return (
    <svg
      aria-hidden
      width="120"
      height="36"
      viewBox="0 0 120 36"
      className="overflow-visible"
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function DashHealth() {
  const [section, setSection] = React.useState("Summary")
  const [editing, setEditing] = React.useState(false)
  const [pinned, setPinned] = React.useState<string[]>([
    "Move",
    "Steps",
    "Resting Heart Rate",
    "Sleep",
  ])
  const summary = section === "Summary"
  const cards = metrics.filter((metric) =>
    summary
      ? editing || pinned.includes(metric.label)
      : metric.category === section
  )

  return (
    <SidebarProvider>
      <NavSidebar
        items={items}
        value={section}
        onValueChange={(value) => {
          setSection(value)
          setEditing(false)
        }}
        header={
          <p className="px-2 pt-1 text-2xl font-bold tracking-tight">Health</p>
        }
      />
      <SidebarInset className="bg-muted dark:bg-background">
        <div key={section} className="flex flex-col gap-2.5 px-5 py-6 md:px-7">
          <div className="flex items-center gap-2.5">
            <SidebarTrigger className="-ms-2" />
            <h1 className="flex-1 text-3xl font-bold tracking-tight">
              {section}
            </h1>
            <Avatar className="size-8.5">
              <AvatarFallback className="bg-linear-to-br from-[oklch(0.78_0.1_250)] to-[oklch(0.6_0.15_280)] text-white dark:from-[oklch(0.78_0.1_250)] dark:to-[oklch(0.6_0.15_280)]">
                JR
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="mt-2.5 flex items-center gap-2">
            <h2 className="flex-1 text-xl font-bold">
              {summary ? "Pinned" : "Last 7 days"}
            </h2>
            {summary && (
              <Button
                variant="plain"
                size="sm"
                onClick={() => setEditing(!editing)}
                data-editing={editing ? "" : undefined}
                className="text-base data-editing:font-semibold"
              >
                {editing ? "Done" : "Edit"}
              </Button>
            )}
          </div>
          {cards.length > 0 ? (
            <ul className="flex flex-col gap-2.5">
              {cards.map((metric, index) => {
                const category =
                  categories.find((item) => item.value === metric.category) ??
                  categories[0]
                const Icon = category.icon
                const isPinned = pinned.includes(metric.label)
                return (
                  <li
                    key={metric.label}
                    style={{ transitionDelay: `${index * 40}ms` }}
                    className="flex items-center gap-3 transition-[opacity,translate] duration-800 ease-[cubic-bezier(0.32,0.72,0,1)] starting:translate-y-2 starting:opacity-0 motion-reduce:transition-none"
                  >
                    {editing && (
                      <Button
                        size="icon-xs"
                        aria-label={`${isPinned ? "Unpin" : "Pin"} ${metric.label}`}
                        onClick={() =>
                          setPinned((current) =>
                            isPinned
                              ? current.filter(
                                  (label) => label !== metric.label
                                )
                              : [...current, metric.label]
                          )
                        }
                        data-pinned={isPinned ? "" : undefined}
                        className="relative bg-[color-mix(in_oklab,var(--color-green-500),var(--foreground)_35%)] text-white after:absolute after:-inset-2.5 after:content-[''] hover:bg-[color-mix(in_oklab,var(--color-green-500),var(--foreground)_45%)] data-pinned:bg-destructive data-pinned:hover:bg-destructive/90"
                      >
                        {isPinned ? (
                          <MinusIcon weight="bold" />
                        ) : (
                          <PlusIcon weight="bold" />
                        )}
                      </Button>
                    )}
                    <a
                      href={`#${metric.label.toLowerCase().replaceAll(" ", "-")}`}
                      data-dimmed={editing && !isPinned ? "" : undefined}
                      className="flex min-w-0 flex-1 flex-col gap-2.5 rounded-xl bg-background px-4 py-3 outline-none transition-opacity duration-200 focus-visible:ring-3 focus-visible:ring-ring/50 data-dimmed:opacity-55 dark:bg-muted"
                    >
                      <span
                        className={`flex items-center gap-1.5 text-base font-semibold ${category.text}`}
                      >
                        <Icon weight="fill" className="size-4" />
                        <span className="flex-1">{metric.label}</span>
                        <span className="text-sm font-normal text-muted-foreground">
                          9:41
                        </span>
                        <CaretRightIcon
                          weight="bold"
                          className="size-3 text-muted-foreground rtl:rotate-180"
                        />
                      </span>
                      <span className="flex items-end gap-4">
                        <span className="flex-1">
                          <span className="text-3xl font-bold tracking-tight tabular-nums">
                            {metric.value}
                          </span>
                          {metric.unit && (
                            <span className="ms-1 text-base font-semibold text-muted-foreground">
                              {metric.unit}
                            </span>
                          )}
                        </span>
                        <Spark
                          data={metric.data}
                          color={metric.color}
                          bars={metric.bars}
                        />
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="py-7.5 text-center text-base text-muted-foreground">
              No pinned items. Use Edit to add some.
            </p>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
