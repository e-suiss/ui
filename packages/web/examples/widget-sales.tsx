import { CashRegisterIcon } from "@phosphor-icons/react"
import type * as React from "react"
import {
  Widget,
  WidgetDescription,
  WidgetHeader,
  WidgetIcon,
  WidgetTitle,
  WidgetValue,
} from "@/components/ui/widget"

const hourly = [12, 18, 14, 30, 44, 34, 22, 40, 100, 46, 30, 14]

const topItems = [
  { name: "Grilled meatballs", count: 38 },
  { name: "Lahmacun", count: 31 },
  { name: "Adana kebab", count: 24 },
  { name: "Künefe", count: 19 },
]

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="mt-6 text-xs text-label-secondary">{children}</p>
}

export default function WidgetSales() {
  return (
    <div>
      <Widget resizable defaultSize="large">
        <WidgetHeader className="gap-1.5 text-warning">
          <WidgetIcon size="sm" className="text-warning">
            <CashRegisterIcon weight="fill" />
          </WidgetIcon>
          <WidgetTitle>Hestia</WidgetTitle>
        </WidgetHeader>
        <div className="flex min-h-0 flex-col gap-3 group-data-[size=medium]/widget:flex-1 group-data-[size=medium]/widget:flex-row group-data-[size=medium]/widget:items-end">
          <div className="shrink-0">
            <WidgetValue>₺18,240</WidgetValue>
            <WidgetDescription className="text-xs">
              Today's revenue · 42 orders
            </WidgetDescription>
          </div>
          <div
            aria-hidden="true"
            className="flex h-14 shrink-0 items-end gap-1 group-data-[size=medium]/widget:h-full group-data-[size=medium]/widget:flex-1 group-data-[size=small]/widget:hidden"
          >
            {hourly.map((value, index) => (
              <span
                key={index}
                data-now={value === 100}
                className="flex-1 rounded-sm bg-control data-[now=true]:bg-orange"
                style={{ height: `${value}%` }}
              />
            ))}
          </div>
        </div>
        <ul className="flex flex-col group-data-[size=medium]/widget:hidden group-data-[size=small]/widget:hidden">
          {topItems.map((item) => (
            <li
              key={item.name}
              className="flex items-center justify-between border-t py-1.5 text-sm"
            >
              {item.name}
              <span className="text-label-secondary tabular-nums">
                {item.count}
              </span>
            </li>
          ))}
        </ul>
      </Widget>
      <Hint>
        Hover the corner and drag the handle. Double-click it to reset.
      </Hint>
    </div>
  )
}
