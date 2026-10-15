import * as React from "react"
import { Calendar } from "@/components/ui/calendar"

function SingleCalendar(props: React.ComponentProps<typeof Calendar>) {
  const today = new Date()
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3)
  )
  return (
    <Calendar
      {...props}
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-2xl border"
    />
  )
}

export default function CalendarSizes() {
  return (
    <div className="flex flex-wrap items-start gap-6">
      <SingleCalendar buttonVariant="plain" size="sm" />
      <SingleCalendar buttonVariant="plain" size="default" />
      <SingleCalendar buttonVariant="plain" size="lg" />
    </div>
  )
}
