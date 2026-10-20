import * as React from "react"
import { Calendar } from "@/components/ui/calendar"

export default function CalendarDropdownCaption() {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2026, 0, 18)
  )
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      defaultMonth={new Date(2026, 0)}
      today={new Date(2026, 0, 15)}
      buttonVariant="plain"
      captionLayout="dropdown"
      className="rounded-2xl border"
    />
  )
}
