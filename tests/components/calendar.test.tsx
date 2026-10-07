import * as React from "react"
import type { DateRange } from "react-day-picker"
import { enUS, tr } from "react-day-picker/locale"
import { describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import { Calendar } from "@/components/ui/calendar"

const OCTOBER = new Date(2026, 9, 1)
const TODAY = new Date(2026, 9, 7)

const day = (name: string | RegExp) => page.getByRole("button", { name })
const cell = (date: string) =>
  document.querySelector<HTMLElement>(`td[data-day="${date}"]`)
const buttonOf = (date: string) =>
  cell(date)?.querySelector<HTMLButtonElement>("button") ?? null
const grid = () => page.getByRole("grid")
const caption = () => page.getByRole("status").elements()[0]?.textContent ?? ""
const nextMonth = () =>
  page.getByRole("button", { name: "Go to the Next Month" })
const previousMonth = () =>
  page.getByRole("button", { name: "Go to the Previous Month" })

const selectedDays = () =>
  Array.from(
    document.querySelectorAll<HTMLElement>("td[aria-selected=true]"),
    (selected) => selected.dataset.day
  )

function SingleCalendar({
  onChange,
  required,
}: {
  onChange?: (date: Date | undefined) => void
  required?: boolean
}) {
  const [date, setDate] = React.useState<Date | undefined>()
  if (required) {
    return (
      <Calendar
        mode="single"
        required
        defaultMonth={OCTOBER}
        today={TODAY}
        selected={date ?? new Date(2026, 9, 12)}
        onSelect={(next) => {
          setDate(next)
          onChange?.(next)
        }}
      />
    )
  }
  return (
    <Calendar
      mode="single"
      defaultMonth={OCTOBER}
      today={TODAY}
      selected={date}
      onSelect={(next) => {
        setDate(next)
        onChange?.(next)
      }}
    />
  )
}

function RangeCalendar({
  onChange,
}: {
  onChange?: (range: DateRange | undefined) => void
}) {
  const [range, setRange] = React.useState<DateRange | undefined>()
  return (
    <Calendar
      mode="range"
      defaultMonth={OCTOBER}
      today={TODAY}
      numberOfMonths={2}
      selected={range}
      onSelect={(next) => {
        setRange(next)
        onChange?.(next)
      }}
    />
  )
}

function MultipleCalendar() {
  const [dates, setDates] = React.useState<Date[] | undefined>()
  return (
    <Calendar
      mode="multiple"
      defaultMonth={OCTOBER}
      today={TODAY}
      selected={dates}
      onSelect={setDates}
    />
  )
}

describe("Calendar selection", () => {
  it("selects and clears a single day", async () => {
    const onChange = vi.fn()
    await render(<SingleCalendar onChange={onChange} />)
    await expect.element(grid()).toHaveAttribute("aria-label", "October 2026")
    await day("Thursday, October 15th, 2026").click()

    expect(onChange).toHaveBeenCalledTimes(1)
    const picked = onChange.mock.lastCall?.[0]
    expect(picked).toBeInstanceOf(Date)
    expect(picked?.getDate()).toBe(15)
    await expect
      .element(day("Thursday, October 15th, 2026, selected"))
      .toHaveAttribute("data-selected-single", "true")
    expect(selectedDays()).toEqual(["2026-10-15"])

    await day("Thursday, October 15th, 2026, selected").click()
    await expect.poll(selectedDays).toEqual([])
    expect(onChange.mock.lastCall?.[0]).toBeUndefined()
  })

  it("moves the single selection to the newly clicked day", async () => {
    await render(<SingleCalendar />)
    await day("Thursday, October 15th, 2026").click()
    await day("Tuesday, October 20th, 2026").click()
    await expect.poll(selectedDays).toEqual(["2026-10-20"])
    expect(buttonOf("2026-10-15")?.dataset.selectedSingle).not.toBe("true")
  })

  it("keeps a required single selection when the selected day is clicked", async () => {
    await render(<SingleCalendar required />)
    expect(selectedDays()).toEqual(["2026-10-12"])
    await day("Monday, October 12th, 2026, selected").click()
    await expect.poll(selectedDays).toEqual(["2026-10-12"])
  })

  it("marks the start, middle and end of a range", async () => {
    const onChange = vi.fn()
    await render(<RangeCalendar onChange={onChange} />)
    expect(grid().elements()).toHaveLength(2)
    await day("Monday, October 5th, 2026").click()
    await expect.poll(selectedDays).toEqual(["2026-10-05"])
    await day("Thursday, October 8th, 2026").click()

    await expect
      .poll(selectedDays)
      .toEqual(["2026-10-05", "2026-10-06", "2026-10-07", "2026-10-08"])
    const range = onChange.mock.lastCall?.[0]
    expect(range?.from?.getDate()).toBe(5)
    expect(range?.to?.getDate()).toBe(8)
    expect(buttonOf("2026-10-05")?.dataset.rangeStart).toBe("true")
    expect(buttonOf("2026-10-06")?.dataset.rangeMiddle).toBe("true")
    expect(buttonOf("2026-10-07")?.dataset.rangeMiddle).toBe("true")
    expect(buttonOf("2026-10-08")?.dataset.rangeEnd).toBe("true")
    expect(buttonOf("2026-10-06")?.dataset.selectedSingle).toBe("false")
    await expect
      .element(day("Monday, October 5th, 2026, selected"))
      .toBeVisible()
  })

  it("spans a range across both visible months", async () => {
    await render(<RangeCalendar />)
    await day("Friday, October 30th, 2026").click()
    await day("Tuesday, November 3rd, 2026").click()
    await expect
      .poll(selectedDays)
      .toEqual([
        "2026-10-30",
        "2026-10-31",
        "2026-11-01",
        "2026-11-02",
        "2026-11-03",
      ])
    expect(buttonOf("2026-10-30")?.dataset.rangeStart).toBe("true")
    expect(buttonOf("2026-11-03")?.dataset.rangeEnd).toBe("true")
  })

  it("toggles several days in multiple mode", async () => {
    await render(<MultipleCalendar />)
    await expect.element(grid()).toHaveAttribute("aria-multiselectable", "true")
    await day("Friday, October 2nd, 2026").click()
    await day("Friday, October 9th, 2026").click()
    await day("Friday, October 16th, 2026").click()
    await expect
      .poll(selectedDays)
      .toEqual(["2026-10-02", "2026-10-09", "2026-10-16"])
    expect(buttonOf("2026-10-09")?.dataset.selectedSingle).toBe("true")
    await day("Friday, October 9th, 2026, selected").click()
    await expect.poll(selectedDays).toEqual(["2026-10-02", "2026-10-16"])
  })
})

describe("Calendar days", () => {
  it("disables matching days and ignores clicks on them", async () => {
    const onSelect = vi.fn()
    await render(
      <Calendar
        mode="single"
        defaultMonth={OCTOBER}
        today={TODAY}
        disabled={{ dayOfWeek: [0, 6] }}
        onSelect={onSelect}
      />
    )
    await expect.element(day("Saturday, October 3rd, 2026")).toBeDisabled()
    await expect.element(day("Sunday, October 4th, 2026")).toBeDisabled()
    await expect.element(day("Monday, October 5th, 2026")).toBeEnabled()
    await day("Saturday, October 3rd, 2026").click({ force: true })
    expect(onSelect).not.toHaveBeenCalled()
    expect(selectedDays()).toEqual([])
  })

  it("highlights today", async () => {
    await render(
      <Calendar mode="single" defaultMonth={OCTOBER} today={TODAY} />
    )
    await expect
      .element(day("Today, Wednesday, October 7th, 2026"))
      .toHaveAttribute("data-today", "true")
    expect(buttonOf("2026-10-08")?.dataset.today).toBe("false")
  })

  it("hides outside days by default", async () => {
    await render(
      <Calendar mode="single" defaultMonth={OCTOBER} today={TODAY} />
    )
    await expect.element(grid()).toBeVisible()
    expect(cell("2026-09-30")?.dataset.hidden).toBe("true")
    expect(buttonOf("2026-09-30")).toBeNull()
    expect(cell("2026-09-27")?.dataset.outside).toBe("true")
  })

  it("shows outside days when asked", async () => {
    await render(
      <Calendar
        mode="single"
        showOutsideDays
        defaultMonth={OCTOBER}
        today={TODAY}
      />
    )
    await expect.element(day("Wednesday, September 30th, 2026")).toBeVisible()
    await expect.element(day("Sunday, September 27th, 2026")).toBeVisible()
  })

  it("labels each day with its date for the locale", async () => {
    await render(
      <Calendar mode="single" defaultMonth={OCTOBER} today={TODAY} />
    )
    await expect.element(grid()).toBeVisible()
    expect(buttonOf("2026-10-15")?.dataset.day).toBe(
      new Date(2026, 9, 15).toLocaleDateString()
    )
  })

  it.each([
    ["sm", 24],
    ["default", 32],
    ["lg", 40],
  ] as const)("renders %s cells at %ipx", async (size, pixels) => {
    await render(
      <Calendar
        mode="single"
        size={size}
        defaultMonth={OCTOBER}
        today={TODAY}
      />
    )
    await expect.element(grid()).toBeVisible()
    await expect
      .poll(() => {
        const button = buttonOf("2026-10-15")
        return button ? [button.offsetWidth, button.offsetHeight] : []
      })
      .toEqual([pixels, pixels])
    expect(nextMonth().element().getBoundingClientRect().width).toBe(pixels)
  })
})

describe("Calendar navigation", () => {
  it("moves between months with the nav buttons", async () => {
    const onMonthChange = vi.fn()
    await render(
      <Calendar
        mode="single"
        defaultMonth={OCTOBER}
        today={TODAY}
        onMonthChange={onMonthChange}
      />
    )
    expect(caption()).toBe("October 2026")
    await nextMonth().click()
    await expect.poll(caption).toBe("November 2026")
    await expect.element(grid()).toHaveAttribute("aria-label", "November 2026")
    expect(onMonthChange.mock.lastCall?.[0]?.getMonth()).toBe(10)
    await previousMonth().click()
    await previousMonth().click()
    await expect.poll(caption).toBe("September 2026")
  })

  it("disables navigation past the start and end months", async () => {
    await render(
      <Calendar
        mode="single"
        defaultMonth={OCTOBER}
        today={TODAY}
        startMonth={new Date(2026, 8)}
        endMonth={new Date(2026, 9)}
      />
    )
    await expect.element(nextMonth()).toHaveAttribute("aria-disabled", "true")
    await expect.element(previousMonth()).not.toHaveAttribute("aria-disabled")
    await previousMonth().click()
    await expect.poll(caption).toBe("September 2026")
    await expect
      .element(previousMonth())
      .toHaveAttribute("aria-disabled", "true")
    await previousMonth().click({ force: true })
    await expect.poll(caption).toBe("September 2026")
  })

  it("jumps with the month and year dropdowns", async () => {
    await render(
      <Calendar
        mode="single"
        captionLayout="dropdown"
        locale={enUS}
        defaultMonth={OCTOBER}
        today={TODAY}
        startMonth={new Date(2024, 0)}
        endMonth={new Date(2027, 11)}
      />
    )
    const months = page.getByRole("combobox", { name: "Choose the Month" })
    const years = page.getByRole("combobox", { name: "Choose the Year" })
    await expect.element(months).toHaveValue("9")
    expect(
      Array.from(
        months.element().querySelectorAll("option"),
        (option) => option.textContent
      )
    ).toEqual([
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ])
    await months.selectOptions("2")
    await expect.element(grid()).toHaveAttribute("aria-label", "March 2026")
    await years.selectOptions("2024")
    await expect.element(grid()).toHaveAttribute("aria-label", "March 2024")
  })

  it("tabs to today and selects it with Enter", async () => {
    const onChange = vi.fn()
    await render(
      <div>
        <button type="button">Before</button>
        <SingleCalendar onChange={onChange} />
      </div>
    )
    page.getByRole("button", { name: "Before" }).element().focus()
    await userEvent.tab()
    await expect.element(previousMonth()).toHaveFocus()
    await userEvent.tab()
    await expect.element(nextMonth()).toHaveFocus()
    await userEvent.tab()
    await expect
      .element(day("Today, Wednesday, October 7th, 2026"))
      .toHaveFocus()
    await userEvent.keyboard("{Enter}")
    await expect.poll(selectedDays).toEqual(["2026-10-07"])
    expect(onChange.mock.lastCall?.[0]?.getDate()).toBe(7)
  })

  it("makes the selected day the tab stop", async () => {
    await render(<SingleCalendar required />)
    const tabbable = Array.from(
      document.querySelectorAll<HTMLElement>("td button"),
      (button) => button.tabIndex
    ).filter((index) => index === 0)
    expect(tabbable).toHaveLength(1)
    expect(buttonOf("2026-10-12")?.tabIndex).toBe(0)
  })
})

describe("Calendar week numbers and locale", () => {
  it("shows a week number at the start of each row", async () => {
    await render(
      <Calendar
        mode="single"
        showWeekNumber
        defaultMonth={OCTOBER}
        today={TODAY}
      />
    )
    const weeks = page.getByRole("rowheader").elements()
    expect(weeks.map((week) => week.textContent)).toEqual([
      "40",
      "41",
      "42",
      "43",
      "44",
    ])
    expect(weeks[0]?.getAttribute("aria-label")).toBe("Week 40")
    const firstRow = weeks[0]?.parentElement
    expect(firstRow?.firstElementChild).toBe(weeks[0])
    const number = weeks[0]?.getBoundingClientRect()
    const firstDay = buttonOf("2026-10-01")?.getBoundingClientRect()
    expect(number?.height).toBe(firstDay?.height)
  })

  it("translates labels and starts the week on Monday", async () => {
    await render(
      <Calendar
        mode="single"
        captionLayout="dropdown"
        locale={tr}
        defaultMonth={OCTOBER}
        today={TODAY}
      />
    )
    await expect.element(grid()).toHaveAttribute("aria-label", "Ekim 2026")
    expect(
      Array.from(
        document.querySelectorAll<HTMLElement>("thead th"),
        (header) => header.textContent
      )
    ).toEqual(["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"])
    await expect.element(day("Önceki aya git")).toBeVisible()
    await expect.element(day("Sonraki aya git")).toBeVisible()
    const months = page.getByRole("combobox", { name: "Ayı seçin" })
    expect(
      Array.from(
        months.element().querySelectorAll("option"),
        (option) => option.textContent
      ).slice(0, 3)
    ).toEqual(["Oca", "Şub", "Mar"])
    expect(buttonOf("2026-10-15")?.dataset.day).toBe("15.10.2026")
    await day("15 Ekim 2026 Perşembe").click()
    await expect.element(day("15 Ekim 2026 Perşembe, seçili")).toBeVisible()
  })
})
