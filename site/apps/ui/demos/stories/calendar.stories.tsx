// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import type { DateRange } from "react-day-picker"
import { expect, userEvent, waitFor } from "storybook/test"

import { Calendar } from "@/components/ui/calendar"

const TODAY = /^Today/
const NEXT_MONTH = /next month/i
const PREVIOUS_MONTH = /previous month/i
const MONTH_DROPDOWN = /month/i
const YEAR_DROPDOWN = /year/i
const WEEK_NUMBER = /^\d{1,2}$/

const meta = {
  title: "Components/Calendar",
  component: Calendar,
  args: {
    buttonVariant: "plain",
    size: "default",
  },
  argTypes: {
    buttonVariant: {
      control: "select",
      options: ["plain", "ghost", "secondary", "tinted"],
    },
    size: {
      control: "select",
      options: ["sm", "default", "lg"],
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

export const Default: Story = {
  render: (args) => <SingleCalendar {...args} />,
  play: async ({ canvas, step }) => {
    const today = canvas.getByRole("button", { name: TODAY })

    await step("selects a day on click", async () => {
      await userEvent.click(today)
      await waitFor(() =>
        expect(today.closest("td")).toHaveAttribute("aria-selected", "true")
      )
      await expect(
        canvas
          .getAllByRole("gridcell")
          .filter((cell) => cell.getAttribute("aria-selected") === "true")
      ).toHaveLength(1)
    })

    await step("moves focus between days with the arrow keys", async () => {
      await expect(today).toHaveFocus()
      await userEvent.keyboard("{ArrowRight}")
      await waitFor(() => expect(today).not.toHaveFocus())
      await userEvent.keyboard("{ArrowLeft}")
      await waitFor(() =>
        expect(canvas.getByRole("button", { name: TODAY })).toHaveFocus()
      )
    })

    await step("pages between months", async () => {
      const month = canvas.getByRole("grid").getAttribute("aria-label")
      await userEvent.click(canvas.getByRole("button", { name: NEXT_MONTH }))
      await waitFor(() =>
        expect(canvas.getByRole("grid")).not.toHaveAttribute(
          "aria-label",
          month ?? ""
        )
      )
      await userEvent.click(
        canvas.getByRole("button", { name: PREVIOUS_MONTH })
      )
      await waitFor(() =>
        expect(canvas.getByRole("grid")).toHaveAttribute(
          "aria-label",
          month ?? ""
        )
      )
    })
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-start gap-6">
      <SingleCalendar {...args} size="sm" />
      <SingleCalendar {...args} size="default" />
      <SingleCalendar {...args} size="lg" />
    </div>
  ),
  play: async ({ canvas, canvasElement, step }) => {
    await step("selects a day in every size", async () => {
      const calendars = canvasElement.querySelectorAll<HTMLElement>(
        '[data-slot="calendar"]'
      )
      await expect([...calendars].map((cal) => cal.dataset.size)).toEqual([
        "sm",
        "default",
        "lg",
      ])
      const todays = canvas.getAllByRole("button", { name: TODAY })
      await expect(todays).toHaveLength(3)
      for (const today of todays) {
        await userEvent.click(today)
        await waitFor(() =>
          expect(today.closest("td")).toHaveAttribute("aria-selected", "true")
        )
      }
    })
  },
}

export const Range: Story = {
  render: (args) => <RangeCalendar {...args} />,
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole("grid")).toHaveLength(2)
    await expect(
      canvas
        .getAllByRole("gridcell")
        .filter((cell) => cell.getAttribute("aria-selected") === "true")
    ).toHaveLength(7)
  },
}

export const DropdownCaption: Story = {
  args: { captionLayout: "dropdown" },
  render: (args) => <SingleCalendar {...args} />,
  play: async ({ canvas, step }) => {
    const today = new Date()
    const otherMonth = new Date(
      today.getFullYear(),
      (today.getMonth() + 6) % 12
    )
    const monthName = otherMonth.toLocaleString("en-US", { month: "long" })
    const lastYear = String(today.getFullYear() - 1)

    await step("jumps to another month from the month dropdown", async () => {
      await userEvent.selectOptions(
        canvas.getByRole("combobox", { name: MONTH_DROPDOWN }),
        String(otherMonth.getMonth())
      )
      await waitFor(() =>
        expect(canvas.getByRole("grid").getAttribute("aria-label")).toContain(
          monthName
        )
      )
    })

    await step("jumps to another year from the year dropdown", async () => {
      await userEvent.selectOptions(
        canvas.getByRole("combobox", { name: YEAR_DROPDOWN }),
        lastYear
      )
      await waitFor(() =>
        expect(canvas.getByRole("grid")).toHaveAttribute(
          "aria-label",
          `${monthName} ${lastYear}`
        )
      )
    })
  },
}

export const WeekNumbers: Story = {
  args: { showWeekNumber: true },
  render: (args) => <SingleCalendar {...args} />,
  play: async ({ canvasElement, step }) => {
    await step("labels every week row with its number", async () => {
      const weeks = canvasElement.querySelectorAll(".rdp-week")
      await expect(weeks.length).toBeGreaterThanOrEqual(4)
      for (const week of weeks) {
        const number = week.querySelector(".rdp-week_number")
        await expect(number?.textContent).toMatch(WEEK_NUMBER)
      }
    })
  },
}

export const DisabledDays: Story = {
  args: { disabled: { dayOfWeek: [0, 6] } },
  render: (args) => <SingleCalendar {...args} />,
  play: async ({ canvas }) => {
    const weekend = canvas
      .getAllByRole("gridcell")
      .filter((cell) => cell.hasAttribute("data-disabled"))
    await expect(weekend.length).toBeGreaterThan(0)
    for (const cell of weekend) {
      await expect(cell.querySelector("button")).toBeDisabled()
    }
  },
}
