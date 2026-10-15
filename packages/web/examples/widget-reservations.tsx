import { CalendarBlankIcon } from "@phosphor-icons/react"
import type * as React from "react"
import {
  Widget,
  WidgetAction,
  WidgetHeader,
  WidgetIcon,
  WidgetTitle,
  WidgetValue,
} from "@/components/ui/widget"

function Hint({ children }: { children: React.ReactNode }) {
  return <p className="mt-6 text-xs text-label-secondary">{children}</p>
}

export default function WidgetReservations() {
  return (
    <div>
      <Widget resizable defaultSize="medium" sizes={["small", "medium"]}>
        <WidgetHeader className="gap-1.5 text-link">
          <WidgetIcon size="sm" className="text-link">
            <CalendarBlankIcon weight="fill" />
          </WidgetIcon>
          <WidgetTitle>Reservations</WidgetTitle>
          <WidgetAction className="text-xs text-label-secondary">
            Up next
          </WidgetAction>
        </WidgetHeader>
        <div>
          <WidgetValue>20:00</WidgetValue>
          <p className="text-sm">Ayşe Y. · 6 guests</p>
        </div>
        <div className="mt-auto flex flex-col gap-1 group-data-[size=small]/widget:hidden">
          <div className="flex justify-between text-2xs text-label-secondary tabular-nums">
            <span>18:00</span>
            <span>20:00</span>
            <span>22:00</span>
            <span>24:00</span>
          </div>
          <div className="relative h-2 rounded-full bg-control">
            <span className="absolute inset-y-0 start-[30%] w-[45%] rounded-full bg-blue" />
          </div>
        </div>
      </Widget>
      <Hint>Snaps between small and medium only.</Hint>
    </div>
  )
}
