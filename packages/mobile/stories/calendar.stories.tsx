import type { Meta, StoryObj } from "@storybook/react-native"
import * as React from "react"
import { ScrollView } from "react-native"
import type { DateRange } from "@/components/primitives/calendar"
import { Calendar } from "@/components/ui/calendar"

type CalendarProps = React.ComponentProps<typeof Calendar>

const meta = {
  title: "Components/Calendar",
  component: Calendar,
} satisfies Meta<typeof Calendar>

export default meta

type Story = StoryObj<typeof meta>

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

export const Default: Story = {
  render: () => <SingleCalendar />,
}

export const Sizes: Story = {
  render: () => (
    <ScrollView contentContainerClassName="items-start gap-6">
      <SingleCalendar size="sm" />
      <SingleCalendar size="default" />
      <SingleCalendar size="lg" />
    </ScrollView>
  ),
}

export const Range: Story = {
  render: () => <RangeCalendar />,
}

export const Multiple: Story = {
  render: () => <MultipleCalendar />,
}

export const DropdownCaption: Story = {
  render: () => <SingleCalendar captionLayout="dropdown" />,
}

export const WeekNumbers: Story = {
  render: () => <SingleCalendar showWeekNumber />,
}

export const DisabledDays: Story = {
  render: () => <SingleCalendar disabled={{ dayOfWeek: [0, 6] }} />,
}

export const OutsideDays: Story = {
  render: () => <SingleCalendar showOutsideDays />,
}

export const ButtonVariants: Story = {
  render: () => (
    <ScrollView contentContainerClassName="items-start gap-6">
      <SingleCalendar buttonVariant="ghost" />
      <SingleCalendar buttonVariant="secondary" />
      <SingleCalendar buttonVariant="tinted" />
    </ScrollView>
  ),
}

export const Locale: Story = {
  render: () => <SingleCalendar locale="tr-TR" />,
}
