import * as React from "react"
import { Calendar } from "@/components/ui/calendar"

export default function CalendarDemo() {
  const today = new Date()
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3)
  )
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-2xl border border-border"
    />
  )
}
