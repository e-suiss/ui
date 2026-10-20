import { screen, waitFor, within } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import DatePickerControlled from "@/examples/date-picker-controlled"
import DatePickerDemo from "@/examples/date-picker-demo"
import DatePickerDisabled from "@/examples/date-picker-disabled"
import DatePickerLocale from "@/examples/date-picker-locale"
import DatePickerWithValue from "@/examples/date-picker-with-value"
import DatePickerYearRange from "@/examples/date-picker-year-range"
import { renderExample } from "@/tests/render-example"

const DATE = /^Date,/

const DAY_15 = /\b15(th)?\b/
const DAY_1 = /\b1(st)?\b/
const DAY_10 = /\b10(th)?\b/
const DAY_20 = /\b20(th)?\b/
const NEXT_MONTH = /next/i
function monthOf(date: Date, locale = "en-US") {
  return new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
  }).format(date)
}
function formatDate(date: Date, locale = "en-US") {
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

test("Default", async () => {
  const { canvas, step } = await renderExample(<DatePickerDemo />)

  const trigger = canvas.getByRole("button", { name: DATE })
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
})
test("With Value", async () => {
  const { canvas, step } = await renderExample(<DatePickerWithValue />)

  const trigger = canvas.getByRole("button", { name: DATE })

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
})
test("Locale", async () => {
  const { canvas, step } = await renderExample(<DatePickerLocale />)

  const trigger = canvas.getByRole("button", { name: DATE })

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
})
test("Year Range", async () => {
  const { canvas, step } = await renderExample(<DatePickerYearRange />)

  const trigger = canvas.getByRole("button", { name: DATE })

  await step("picks a day in a past year", async () => {
    const grid = await openCalendar(trigger)
    await expect(grid).toHaveAccessibleName(monthOf(new Date(1990, 5, 1)))
    await pickDay(grid, DAY_20)
    await expect(trigger).toHaveTextContent(formatDate(new Date(1990, 5, 20)))
  })
})
test("Disabled", async () => {
  const { canvas, step } = await renderExample(<DatePickerDisabled />)

  await step("does not open when clicked", async () => {
    const trigger = canvas.getByRole("button", { name: DATE })
    await expect(trigger).toBeDisabled()
    await userEvent.click(trigger, { pointerEventsCheck: 0 })
    await expect(screen.queryByRole("grid")).toBeNull()
  })
})
test("Controlled", async () => {
  const { canvas, step } = await renderExample(<DatePickerControlled />)

  await step("reports the picked day to the owner", async () => {
    await expect(
      canvas.getByText(`Selected: ${new Date(2026, 9, 4).toDateString()}`)
    ).toBeVisible()
    const grid = await openCalendar(canvas.getByRole("button", { name: DATE }))
    await pickDay(grid, DAY_20)
    await expect(
      canvas.getByText(`Selected: ${new Date(2026, 9, 20).toDateString()}`)
    ).toBeVisible()
  })
})
