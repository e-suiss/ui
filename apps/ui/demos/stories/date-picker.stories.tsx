// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"

import { DatePicker } from "@/components/patterns/date-picker"

const meta = {
  title: "Patterns/Date Picker",
  component: DatePicker,
  args: {
    "aria-label": "Date",
    className: "w-60",
  },
} satisfies Meta<typeof DatePicker>

export default meta

type Story = StoryObj<typeof meta>

const DAY_15 = /\b15(th)?\b/
const DAY_1 = /\b1(st)?\b/
const DAY_10 = /\b10(th)?\b/
const DAY_20 = /\b20(th)?\b/
const NEXT_MONTH = /next/i

function monthOf(date: Date, locale?: string) {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(date)
}

function formatDate(date: Date, locale?: string) {
  return new Intl.DateTimeFormat(locale, { dateStyle: "medium" }).format(date)
}

async function openCalendar(trigger: HTMLElement) {
  await userEvent.click(trigger)
  return screen.findByRole("grid")
}

async function pickDay(grid: HTMLElement, name: RegExp) {
  await userEvent.click(within(grid).getByRole("button", { name }))
  await waitFor(() => expect(screen.queryByRole("grid")).toBeNull())
}

export const Default: Story = {
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("button", { name: "Date" })
    const today = new Date()

    await step("shows the placeholder before a date is picked", async () => {
      await expect(trigger).toHaveTextContent("Pick a date")
    })

    await step("Escape closes the calendar and returns focus", async () => {
      await openCalendar(trigger)
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(screen.queryByRole("grid")).toBeNull())
      await waitFor(() => expect(trigger).toHaveFocus())
    })

    await step("picking a day closes and shows the date", async () => {
      const grid = await openCalendar(trigger)
      await pickDay(grid, DAY_15)
      await expect(trigger).toHaveTextContent(
        formatDate(new Date(today.getFullYear(), today.getMonth(), 15))
      )
    })
  },
}

export const WithValue: Story = {
  args: { defaultValue: new Date(2026, 9, 4) },
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("button", { name: "Date" })

    await step("opens on the month of the current value", async () => {
      await expect(trigger).toHaveTextContent(formatDate(new Date(2026, 9, 4)))
      const grid = await openCalendar(trigger)
      await expect(grid).toHaveAccessibleName(monthOf(new Date(2026, 9, 1)))
    })

    await step("moves to the next month and picks a day", async () => {
      await userEvent.click(screen.getByRole("button", { name: NEXT_MONTH }))
      const grid = await screen.findByRole("grid", {
        name: monthOf(new Date(2026, 10, 1)),
      })
      await pickDay(grid, DAY_1)
      await expect(trigger).toHaveTextContent(formatDate(new Date(2026, 10, 1)))
    })
  },
}

export const Locale: Story = {
  args: {
    locale: "tr-TR",
    placeholder: "Tarih seç",
    defaultValue: new Date(2026, 9, 4),
  },
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("button", { name: "Date" })

    await step("formats the trigger and calendar in Turkish", async () => {
      await expect(trigger).toHaveTextContent(
        formatDate(new Date(2026, 9, 4), "tr-TR")
      )
      await openCalendar(trigger)
      await expect(screen.getByText("Ekim 2026")).toBeInTheDocument()
      await expect(screen.getByRole("grid")).toHaveAccessibleName("Ekim 2026")
      await expect(
        screen.getByRole("button", { name: "4 Ekim 2026 Pazar" })
      ).toBeInTheDocument()
    })

    await step("picking a day shows it in the locale format", async () => {
      await pickDay(screen.getByRole("grid"), DAY_10)
      await expect(trigger).toHaveTextContent(
        formatDate(new Date(2026, 9, 10), "tr-TR")
      )
    })
  },
}

export const YearRange: Story = {
  args: {
    placeholder: "Date of birth",
    fromYear: 1940,
    toYear: 2010,
    defaultValue: new Date(1990, 5, 15),
  },
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("button", { name: "Date" })

    await step("picks a day in a past year", async () => {
      const grid = await openCalendar(trigger)
      await expect(grid).toHaveAccessibleName(monthOf(new Date(1990, 5, 1)))
      await pickDay(grid, DAY_20)
      await expect(trigger).toHaveTextContent(formatDate(new Date(1990, 5, 20)))
    })
  },
}

export const WithTitle: Story = {
  args: { title: "Delivery date" },
}

export const WithCloseButton: Story = {
  args: { showCloseButton: true },
}

export const WithCloseLabel: Story = {
  args: { showCloseButton: true, closeLabel: "Done" },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas, step }) => {
    await step("does not open when clicked", async () => {
      const trigger = canvas.getByRole("button", { name: "Date" })
      await expect(trigger).toBeDisabled()
      await userEvent.click(trigger, { pointerEventsCheck: 0 })
      await expect(screen.queryByRole("grid")).toBeNull()
    })
  },
}

export const Invalid: Story = {
  args: { "aria-invalid": true },
}

function ControlledExample(args: React.ComponentProps<typeof DatePicker>) {
  const [value, setValue] = React.useState<Date | null>(new Date(2026, 9, 4))

  return (
    <div className="flex flex-col items-start gap-2">
      <DatePicker {...args} value={value} onValueChange={setValue} />
      <p className="text-sm text-label-secondary">
        Selected: {value ? value.toDateString() : "none"}
      </p>
    </div>
  )
}

export const Controlled: Story = {
  render: (args) => <ControlledExample {...args} />,
  play: async ({ canvas, step }) => {
    await step("reports the picked day to the owner", async () => {
      await expect(
        canvas.getByText(`Selected: ${new Date(2026, 9, 4).toDateString()}`)
      ).toBeVisible()
      const grid = await openCalendar(
        canvas.getByRole("button", { name: "Date" })
      )
      await pickDay(grid, DAY_20)
      await expect(
        canvas.getByText(`Selected: ${new Date(2026, 9, 20).toDateString()}`)
      ).toBeVisible()
    })
  },
}

export const Floating: Story = {
  args: { floating: true },
}
