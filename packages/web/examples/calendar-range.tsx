import * as React from "react"
import type { DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"

export default function CalendarRange() {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: new Date(2026, 0, 15),
    to: new Date(2026, 0, 21),
  })
  return (
    <Calendar
      mode="range"
      selected={range}
      onSelect={setRange}
      defaultMonth={new Date(2026, 0)}
      today={new Date(2026, 0, 15)}
      numberOfMonths={2}
      buttonVariant="plain"
      className="rounded-2xl border"
    />
  )
}
