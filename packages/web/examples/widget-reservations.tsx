import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  Widget,
  WidgetAction,
  WidgetHeader,
  WidgetIcon,
  WidgetTitle,
  WidgetValue,
} from "@/components/ui/widget"

export default function WidgetReservations() {
  return (
    <div>
      <Widget resizable defaultSize="medium" sizes={["small", "medium"]}>
        <WidgetHeader className="gap-1.5 text-[color-mix(in_oklab,var(--primary)_80%,var(--foreground))]">
          <WidgetIcon size="sm" className="text-primary">
            <IconPlaceholder
              lucide="CalendarIcon"
              tabler="IconCalendar"
              hugeicons="Calendar01Icon"
              phosphor="CalendarBlankIcon"
              remixicon="RiCalendarLine"
            />
          </WidgetIcon>
          <WidgetTitle>Reservations</WidgetTitle>
          <WidgetAction className="text-xs text-muted-foreground">
            Up next
          </WidgetAction>
        </WidgetHeader>
        <div>
          <WidgetValue>20:00</WidgetValue>
          <p className="text-sm">Ayşe Y. · 6 guests</p>
        </div>
        <div className="mt-auto flex flex-col gap-1 group-data-[size=small]/widget:hidden">
          <div className="flex justify-between text-xs text-muted-foreground tabular-nums">
            <span>18:00</span>
            <span>20:00</span>
            <span>22:00</span>
            <span>24:00</span>
          </div>
          <div className="relative h-2 rounded-full bg-secondary">
            <span className="absolute inset-y-0 start-[30%] w-[45%] rounded-full bg-blue-500" />
          </div>
        </div>
      </Widget>
      <p className="mt-6 text-xs text-muted-foreground">
        Snaps between small and medium only.
      </p>
    </div>
  )
}
