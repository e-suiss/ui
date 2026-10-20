import { waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import CalendarDemo from "@/examples/calendar-demo"
import CalendarDisabledDays from "@/examples/calendar-disabled-days"
import CalendarDropdownCaption from "@/examples/calendar-dropdown-caption"
import CalendarRange from "@/examples/calendar-range"
import CalendarSizes from "@/examples/calendar-sizes"
import CalendarWeekNumbers from "@/examples/calendar-week-numbers"
import { renderExample } from "@/tests/render-example"

const DAY = /January 20th, 2026/
const NEXT_MONTH = /next month/i
const PREVIOUS_MONTH = /previous month/i
const MONTH_DROPDOWN = /month/i
const YEAR_DROPDOWN = /year/i
const WEEK_NUMBER = /^\d{1,2}$/

test("Default", async () => {
  const { canvas, step } = await renderExample(<CalendarDemo />)

  const day = canvas.getByRole("button", { name: DAY })

  await step("selects a day on click", async () => {
    await userEvent.click(day)
    await waitFor(() =>
      expect(day.closest("td")).toHaveAttribute("aria-selected", "true")
    )
    await expect(
      canvas
        .getAllByRole("gridcell")
        .filter((cell) => cell.getAttribute("aria-selected") === "true")
    ).toHaveLength(1)
  })

  await step("moves focus between days with the arrow keys", async () => {
    await expect(day).toHaveFocus()
    await userEvent.keyboard("{ArrowRight}")
    await waitFor(() => expect(day).not.toHaveFocus())
    await userEvent.keyboard("{ArrowLeft}")
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: DAY })).toHaveFocus()
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
    await userEvent.click(canvas.getByRole("button", { name: PREVIOUS_MONTH }))
    await waitFor(() =>
      expect(canvas.getByRole("grid")).toHaveAttribute(
        "aria-label",
        month ?? ""
      )
    )
  })
})
test("Sizes", async () => {
  const { canvas, canvasElement, step } = await renderExample(<CalendarSizes />)

  await step("selects a day in every size", async () => {
    const calendars = canvasElement.querySelectorAll<HTMLElement>(
      '[data-slot="calendar"]'
    )
    await expect([...calendars].map((cal) => cal.dataset.size)).toEqual([
      "sm",
      "default",
      "lg",
    ])
    const days = canvas.getAllByRole("button", { name: DAY })
    await expect(days).toHaveLength(3)
    for (const day of days) {
      await userEvent.click(day)
      await waitFor(() =>
        expect(day.closest("td")).toHaveAttribute("aria-selected", "true")
      )
    }
  })
})
test("Range", async () => {
  const { canvas } = await renderExample(<CalendarRange />)

  await expect(canvas.getAllByRole("grid")).toHaveLength(2)
  await expect(
    canvas
      .getAllByRole("gridcell")
      .filter((cell) => cell.getAttribute("aria-selected") === "true")
  ).toHaveLength(7)
})
test("Dropdown Caption", async () => {
  const { canvas, step } = await renderExample(<CalendarDropdownCaption />)

  const monthName = "July"
  const lastYear = "2025"

  await step("jumps to another month from the month dropdown", async () => {
    await userEvent.selectOptions(
      canvas.getByRole("combobox", { name: MONTH_DROPDOWN }),
      "6"
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
})
test("Week Numbers", async () => {
  const { canvasElement, step } = await renderExample(<CalendarWeekNumbers />)

  await step("labels every week row with its number", async () => {
    const weeks = canvasElement.querySelectorAll(".rdp-week")
    await expect(weeks.length).toBeGreaterThanOrEqual(4)
    for (const week of weeks) {
      const number = week.querySelector(".rdp-week_number")
      await expect(number?.textContent).toMatch(WEEK_NUMBER)
    }
  })
})
test("Disabled Days", async () => {
  const { canvas } = await renderExample(<CalendarDisabledDays />)

  const weekend = canvas
    .getAllByRole("gridcell")
    .filter((cell) => cell.hasAttribute("data-disabled"))
  await expect(weekend.length).toBeGreaterThan(0)
  for (const cell of weekend) {
    await expect(cell.querySelector("button")).toBeDisabled()
  }
})
