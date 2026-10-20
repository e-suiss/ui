import * as React from "react"
import { Calendar } from "@/components/ui/calendar"

function SingleCalendar(props: React.ComponentProps<typeof Calendar>) {
  const [date, setDate] = React.useState<Date | undefined>(
    new Date(2026, 0, 18)
  )
  return (
    <Calendar
      {...props}
      mode="single"
      selected={date}
      onSelect={setDate}
      defaultMonth={new Date(2026, 0)}
      today={new Date(2026, 0, 15)}
      className="rounded-2xl border"
    />
  )
}

export default function CalendarSizes() {
  return (
    <div className="flex flex-wrap items-start gap-6">
      <SingleCalendar
        buttonVariant="plain"
        size="sm"
        labels={{ labelNav: () => "Small calendar navigation" }}
      />
      <SingleCalendar
        buttonVariant="plain"
        size="default"
        labels={{ labelNav: () => "Default calendar navigation" }}
      />
      <SingleCalendar
        buttonVariant="plain"
        size="lg"
        labels={{ labelNav: () => "Large calendar navigation" }}
      />
    </div>
  )
}
