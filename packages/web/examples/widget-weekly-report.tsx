import { ChartBarIcon, TriangleIcon } from "@phosphor-icons/react"
import type * as React from "react"
import {
  Widget,
  WidgetHeader,
  WidgetIcon,
  WidgetTitle,
  WidgetValue,
} from "@/components/ui/widget"

const week = [
  { day: "Mon", value: 52 },
  { day: "Tue", value: 44 },
  { day: "Wed", value: 60 },
  { day: "Thu", value: 56 },
  { day: "Fri", value: 82 },
  { day: "Sat", value: 100 },
  { day: "Sun", value: 70 },
]

const channels = [
  { name: "Dine-in", amount: "₺64,200", tint: "bg-blue-500" },
  { name: "Takeaway", amount: "₺38,900", tint: "bg-orange-500" },
  { name: "Pickup", amount: "₺18,800", tint: "bg-green-500" },
]

const bestSellers = [
  { name: "Grilled meatballs", count: 238 },
  { name: "Lahmacun", count: 201 },
  { name: "Adana kebab", count: 164 },
  { name: "Künefe", count: 131 },
  { name: "Ayran", count: 120 },
  { name: "Lentil soup", count: 96 },
] as const

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="mt-6 text-xs text-muted-foreground">{children}</p>
}

export default function WidgetWeeklyReport() {
  return (
    <div>
      <Widget resizable defaultSize="extra-large" className="flex-row gap-6">
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <WidgetHeader className="gap-1.5 text-green-600 dark:text-green-400">
            <WidgetIcon
              size="sm"
              className="text-green-600 dark:text-green-400"
            >
              <ChartBarIcon weight="fill" />
            </WidgetIcon>
            <WidgetTitle>This week</WidgetTitle>
          </WidgetHeader>
          <div className="flex min-h-0 flex-col gap-3 group-data-[size=medium]/widget:flex-1 group-data-[size=medium]/widget:flex-row group-data-[size=medium]/widget:items-end">
            <div className="shrink-0">
              <WidgetValue>₺121,900</WidgetValue>
              <p className="flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                <TriangleIcon weight="fill" className="size-2.5" />
                12% more than last week
              </p>
            </div>
            <div className="flex h-24 min-w-0 shrink-0 items-end gap-2 group-data-[size=medium]/widget:h-full group-data-[size=medium]/widget:gap-1.5 group-data-[size=medium]/widget:flex-1 group-data-[size=small]/widget:hidden">
              {week.map((day) => (
                <div
                  key={day.day}
                  className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1"
                >
                  <div className="flex min-h-0 w-full flex-1 items-end">
                    <span
                      aria-hidden="true"
                      data-top={day.value === 100}
                      className="w-full rounded-md bg-secondary data-[top=true]:bg-green-500"
                      style={{ height: `${day.value}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground group-data-[size=medium]/widget:hidden">
                    {day.day}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <ul className="flex flex-col group-data-[size=medium]/widget:hidden group-data-[size=small]/widget:hidden">
            {channels.map((channel) => (
              <li
                key={channel.name}
                className="flex items-center gap-2 border-t py-1.5 text-sm"
              >
                <span
                  aria-hidden="true"
                  className={`size-2 rounded-full ${channel.tint}`}
                />
                <span className="flex-1">{channel.name}</span>
                <span className="text-muted-foreground tabular-nums">
                  {channel.amount}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden w-72 shrink-0 flex-col gap-2 group-data-[size=extra-large]/widget:flex">
          <p className="text-xs font-semibold text-muted-foreground">
            Best sellers
          </p>
          {bestSellers.map((item) => (
            <div key={item.name} className="flex flex-col gap-1">
              <div className="flex justify-between text-sm">
                {item.name}
                <span className="text-muted-foreground tabular-nums">
                  {item.count}
                </span>
              </div>
              <div className="h-1 rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-green-500"
                  style={{
                    width: `${(item.count / bestSellers[0].count) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </Widget>
      <Hint>Extra large shows best sellers, large hides them.</Hint>
    </div>
  )
}
