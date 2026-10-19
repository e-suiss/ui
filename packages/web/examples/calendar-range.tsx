import * as React from "react"
import type { DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"

export default function CalendarRange() {
  const today = new Date()
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: today,
    to: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6),
  })
  return (
    <Calendar
      mode="range"
      selected={range}
      onSelect={setRange}
      numberOfMonths={2}
      buttonVariant="plain"
      className="rounded-2xl border"
    />
  )
}
