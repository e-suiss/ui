import * as React from "react"
import { ScrollView } from "react-native"
import type { DateRange } from "@/components/primitives/calendar"
import { Calendar } from "@/components/ui/calendar"

function RangeCalendar() {
  const today = new Date()
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: today,
    to: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6),
  })
  return (
    <ScrollView>
      <Calendar
        mode="range"
        selected={range}
        onSelect={setRange}
        numberOfMonths={2}
        className="rounded-2xl border border-border"
      />
    </ScrollView>
  )
}

export default function CalendarRange() {
  return <RangeCalendar />
}
