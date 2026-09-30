import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import type { DateRange } from "react-day-picker"

import { Calendar } from "@/components/ui/calendar"

const meta = {
  title: "Components/Calendar",
  component: Calendar,
  args: {
    buttonVariant: "ghost",
  },
  argTypes: {
    buttonVariant: {
      control: "select",
      options: ["default", "outline", "secondary", "ghost"],
    },
    captionLayout: {
      control: "select",
      options: ["label", "dropdown", "dropdown-months", "dropdown-years"],
    },
  },
} satisfies Meta<typeof Calendar>

export default meta

type Story = StoryObj<typeof meta>

function SingleCalendar(props: React.ComponentProps<typeof Calendar>) {
  const [date, setDate] = React.useState<Date | undefined>(new Date())
  return (
    <Calendar
      {...props}
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-3xl border"
    />
  )
}

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
      className="rounded-3xl border"
    />
  )
}

export const Default: Story = {
  render: (args) => <SingleCalendar {...args} />,
}

export const Range: Story = {
  render: (args) => <RangeCalendar {...args} />,
}

export const DropdownCaption: Story = {
  args: { captionLayout: "dropdown" },
  render: (args) => <SingleCalendar {...args} />,
}

export const WeekNumbers: Story = {
  args: { showWeekNumber: true },
  render: (args) => <SingleCalendar {...args} />,
}

export const DisabledDays: Story = {
  args: { disabled: { dayOfWeek: [0, 6] } },
  render: (args) => <SingleCalendar {...args} />,
}
