import * as React from "react"
import type { DateRange } from "react-day-picker"
import { Calendar } from "@/components/ui/calendar"

function RangeCalendar(props: React.ComponentProps<typeof Calendar>) {
  const today = new Date()
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: today,
    to: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6),
  })
  return (
    <Calendar
      {...props}
      mode="range"
      selected={range}
      onSelect={setRange}
      numberOfMonths={2}
      className="rounded-2xl border"
    />
  )
}

export default function CalendarRange() {
  return <RangeCalendar buttonVariant="plain" />
}
