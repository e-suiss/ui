import * as React from "react"
import { Calendar } from "@/components/ui/calendar"

function MultipleCalendar() {
  const today = new Date()
  const [dates, setDates] = React.useState<Date[] | undefined>([
    new Date(today.getFullYear(), today.getMonth(), 8),
    new Date(today.getFullYear(), today.getMonth(), 15),
    new Date(today.getFullYear(), today.getMonth(), 22),
  ])
  return (
    <Calendar
      mode="multiple"
      selected={dates}
      onSelect={setDates}
      className="rounded-2xl border border-border"
    />
  )
}

export default function CalendarMultiple() {
  return <MultipleCalendar />
}
