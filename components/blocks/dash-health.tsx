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

import {
  AppShell,
  type AppShellItem,
  AppShellTrigger,
} from "@/components/patterns/app-shell"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

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
    tint: "bg-orange",
    text: "text-[color-mix(in_oklab,var(--orange),var(--label)_45%)] dark:text-orange",
  },
  {
    value: "Heart",
    icon: HeartIcon,
    tint: "bg-red",
    text: "text-[color-mix(in_oklab,var(--red),var(--label)_25%)] dark:text-red",
  },
  {
    value: "Sleep",
    icon: MoonIcon,
    tint: "bg-cyan",
    text: "text-[color-mix(in_oklab,var(--cyan),var(--label)_50%)] dark:text-cyan",
  },
  {
    value: "Mobility",
    icon: ChartBarIcon,
    tint: "bg-green",
    text: "text-[color-mix(in_oklab,var(--green),var(--label)_45%)] dark:text-green",
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
    color: "var(--red)",
    data: [40, 62, 38, 70, 55, 81, 65],
    bars: true,
  },
  {
    category: "Activity",
    label: "Steps",
    value: "8,412",
    unit: "steps",
    color: "var(--orange)",
    data: [60, 80, 45, 90, 70, 95, 52],
    bars: true,
  },
  {
    category: "Heart",
    label: "Resting Heart Rate",
    value: "58",
    unit: "bpm",
    color: "var(--red)",
    data: [61, 60, 59, 58, 60, 57, 58],
  },
  {
    category: "Sleep",
    label: "Sleep",
    value: "7 hr 12 min",
    color: "var(--cyan)",
    data: [68, 74, 59, 79, 64, 86, 72],
    bars: true,
  },
  {
    category: "Heart",
    label: "Cardio Fitness",
    value: "42.1",
    unit: "VO₂ max",
    color: "var(--red)",
    data: [40, 40, 41, 41, 42, 42, 42],
  },
  {
    category: "Mobility",
    label: "Walking Speed",
    value: "5.1",
    unit: "km/h",
    color: "var(--green)",
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

const items: AppShellItem[] = [
  {
    value: "Summary",
    label: "Summary",
    icon: <Tile icon={HeartIcon} tint="bg-pink" />,
  },
  {
    value: "Sharing",
    label: "Sharing",
    icon: <Tile icon={UsersIcon} tint="bg-blue" />,
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
    <AppShell
      items={items}
      value={section}
      onValueChange={(value) => {
        setSection(value)
        setEditing(false)
      }}
      header={
        <p className="px-2 pt-1 text-2xl font-bold tracking-tight">Health</p>
      }
      className="bg-surface-secondary dark:bg-surface"
    >
      <div key={section} className="flex flex-col gap-2.5 px-5 py-6 md:px-7">
        <div className="flex items-center gap-2.5">
          <AppShellTrigger className="-ms-2" />
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
                            ? current.filter((label) => label !== metric.label)
                            : [...current, metric.label]
                        )
                      }
                      data-pinned={isPinned ? "" : undefined}
                      className="relative bg-[color-mix(in_oklab,var(--green),var(--label)_35%)] text-white after:absolute after:-inset-2.5 after:content-[''] hover:bg-[color-mix(in_oklab,var(--green),var(--label)_45%)] data-pinned:bg-danger data-pinned:hover:bg-danger/90"
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
                    className="flex min-w-0 flex-1 flex-col gap-2.5 rounded-xl bg-surface px-4 py-3 outline-none transition-opacity duration-200 focus-visible:focus-ring data-dimmed:opacity-55 dark:bg-surface-secondary"
                  >
                    <span
                      className={`flex items-center gap-1.5 text-base font-semibold ${category.text}`}
                    >
                      <Icon weight="fill" className="size-4" />
                      <span className="flex-1">{metric.label}</span>
                      <span className="text-sm font-normal text-label-secondary">
                        9:41
                      </span>
                      <CaretRightIcon
                        weight="bold"
                        className="size-3 text-label-tertiary rtl:rotate-180"
                      />
                    </span>
                    <span className="flex items-end gap-4">
                      <span className="flex-1">
                        <span className="text-3xl font-bold tracking-tight tabular-nums">
                          {metric.value}
                        </span>
                        {metric.unit && (
                          <span className="ms-1 text-base font-semibold text-label-secondary">
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
          <p className="py-7.5 text-center text-base text-label-secondary">
            No pinned items. Use Edit to add some.
          </p>
        )}
      </div>
    </AppShell>
  )
}
