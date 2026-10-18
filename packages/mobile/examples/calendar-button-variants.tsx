import * as React from "react"
import { ScrollView } from "react-native"
import { Calendar } from "@/components/ui/calendar"

type CalendarProps = React.ComponentProps<typeof Calendar>

function SingleCalendar(
  props: Omit<CalendarProps, "mode" | "selected" | "onSelect">
) {
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
      className="rounded-2xl border border-border"
    />
  )
}

export default function CalendarButtonVariants() {
  return (
    <ScrollView contentContainerClassName="items-start gap-6">
      <SingleCalendar buttonVariant="ghost" />
      <SingleCalendar buttonVariant="secondary" />
      <SingleCalendar buttonVariant="tinted" />
    </ScrollView>
  )
}
