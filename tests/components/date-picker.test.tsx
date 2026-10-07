import { afterEach, describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import { DatePicker } from "@/components/patterns/date-picker"

afterEach(async () => {
  await page.viewport(1280, 800)
})

const octoberFifteenth = /October 15/
const octoberTwentieth = /October 20/
const previousMonth = /previous month/i
const nextMonth = /next month/i

const trigger = () => page.getByRole("button", { name: "Date" })
const dialog = () => page.getByRole("dialog")
const wheel = (name: string) => page.getByRole("listbox", { name })

function weekdays() {
  return Array.from(
    document.querySelectorAll<HTMLElement>("[role=dialog] thead th"),
    (cell) => cell.textContent
  )
}

function wheelOrder() {
  return Array.from(
    document.querySelectorAll<HTMLElement>("[role=dialog] [role=listbox]"),
    (column) => column.getAttribute("aria-label")
  )
}

function options(name: string) {
  return Array.from(
    wheel(name).element().querySelectorAll<HTMLElement>("[role=option]"),
    (item) => item.dataset.value
  )
}

function selectedOption(name: string) {
  return wheel(name)
    .element()
    .querySelector<HTMLElement>("[aria-selected=true]")?.dataset.value
}

function frame() {
  return new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))
}

async function settled(element: HTMLElement) {
  let last = element.scrollTop
  let still = 0
  while (still < 6) {
    await frame()
    still = element.scrollTop === last ? still + 1 : 0
    last = element.scrollTop
  }
}

async function press(name: string, key: string) {
  const column = wheel(name).element() as HTMLElement
  await settled(column)
  column.focus()
  await userEvent.keyboard(key)
}

describe("DatePicker on desktop", () => {
  it("shows the placeholder until a date is picked", async () => {
    await render(<DatePicker aria-label="Date" placeholder="Pick a date" />)
    await expect.element(trigger()).toHaveTextContent("Pick a date")
    await expect.element(trigger()).toHaveAttribute("data-placeholder", "")
  })

  it("lets the popover's rounded surface show behind the calendar", async () => {
    await render(<DatePicker aria-label="Date" locale="en-US" />)
    await trigger().click()
    await expect.element(dialog()).toBeVisible()
    const calendar = dialog()
      .element()
      .querySelector<HTMLElement>("[data-slot=calendar]")
    expect(calendar && getComputedStyle(calendar).backgroundColor).toBe(
      "rgba(0, 0, 0, 0)"
    )
    expect(getComputedStyle(dialog().element()).borderTopLeftRadius).not.toBe(
      "0px"
    )
  })

  it("selects a day from the calendar popover and formats it", async () => {
    const onValueChange = vi.fn()
    await render(
      <DatePicker
        aria-label="Date"
        locale="en-US"
        defaultValue={new Date(2026, 9, 4)}
        onValueChange={onValueChange}
      />
    )
    await expect.element(trigger()).toHaveTextContent("Oct 4, 2026")
    await trigger().click()
    await expect.element(dialog()).toBeVisible()
    await expect.element(dialog().getByRole("grid")).toBeVisible()
    await expect
      .element(dialog().getByText("October 2026", { exact: true }))
      .toBeVisible()
    await dialog().getByRole("button", { name: octoberFifteenth }).click()

    expect(onValueChange).toHaveBeenCalledTimes(1)
    const picked = onValueChange.mock.lastCall?.[0]
    expect(picked).toBeInstanceOf(Date)
    expect(picked?.getFullYear()).toBe(2026)
    expect(picked?.getMonth()).toBe(9)
    expect(picked?.getDate()).toBe(15)
    await expect.element(trigger()).toHaveTextContent("Oct 15, 2026")
    await expect.element(trigger()).not.toHaveAttribute("data-placeholder")
    await expect.element(dialog()).not.toBeInTheDocument()
    await expect.element(page.getByRole("listbox")).not.toBeInTheDocument()
  })

  it("formats the value with the given locale", async () => {
    await render(
      <DatePicker
        aria-label="Date"
        locale="tr-TR"
        defaultValue={new Date(2026, 9, 4)}
      />
    )
    await expect.element(trigger()).toHaveTextContent("4 Eki 2026")
    await trigger().click()
    await expect
      .element(dialog().getByText("Ekim 2026", { exact: true }))
      .toBeVisible()
  })

  it("starts the week on Monday for tr-TR", async () => {
    await render(
      <DatePicker
        aria-label="Date"
        locale="tr-TR"
        defaultValue={new Date(2026, 9, 4)}
      />
    )
    await trigger().click()
    await expect.element(dialog()).toBeVisible()
    await expect
      .poll(weekdays)
      .toEqual(["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"])
  })

  it("starts the week on Sunday for en-US", async () => {
    await render(
      <DatePicker
        aria-label="Date"
        locale="en-US"
        defaultValue={new Date(2026, 9, 4)}
      />
    )
    await trigger().click()
    await expect.element(dialog()).toBeVisible()
    await expect
      .poll(weekdays)
      .toEqual(["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"])
  })

  it("keeps a controlled value until the parent updates it", async () => {
    const onValueChange = vi.fn()
    const screen = await render(
      <DatePicker
        aria-label="Date"
        locale="en-US"
        value={new Date(2026, 9, 4)}
        onValueChange={onValueChange}
      />
    )
    await trigger().click()
    await dialog().getByRole("button", { name: octoberTwentieth }).click()
    expect(onValueChange.mock.lastCall?.[0]?.getDate()).toBe(20)
    await expect.element(trigger()).toHaveTextContent("Oct 4, 2026")
    await screen.rerender(
      <DatePicker
        aria-label="Date"
        locale="en-US"
        value={new Date(2026, 9, 20)}
        onValueChange={onValueChange}
      />
    )
    await expect.element(trigger()).toHaveTextContent("Oct 20, 2026")
  })

  it("stops month navigation at fromYear and toYear", async () => {
    await render(
      <DatePicker
        aria-label="Date"
        locale="en-US"
        fromYear={2020}
        toYear={2020}
        defaultValue={new Date(2020, 0, 10)}
      />
    )
    await trigger().click()
    const previous = dialog().getByRole("button", { name: previousMonth })
    const next = dialog().getByRole("button", { name: nextMonth })
    await expect.element(previous).toBeDisabled()
    await expect.element(next).toBeEnabled()
    for (let month = 0; month < 11; month++) {
      await next.click()
    }
    await expect
      .element(dialog().getByText("December 2020", { exact: true }))
      .toBeVisible()
    await expect.element(next).toBeDisabled()
    await expect.element(previous).toBeEnabled()
  })

  it("cannot be opened when disabled", async () => {
    await render(<DatePicker aria-label="Date" disabled />)
    await expect.element(trigger()).toBeDisabled()
    await trigger().click({ force: true })
    await expect.element(dialog()).not.toBeInTheDocument()
  })
})

describe("DatePicker on mobile", () => {
  it("opens a drawer with date wheels instead of a calendar", async () => {
    await page.viewport(390, 844)
    await render(
      <DatePicker
        aria-label="Date"
        locale="en-US"
        defaultValue={new Date(2026, 9, 4)}
      />
    )
    await trigger().click()
    await expect.element(dialog()).toBeVisible()
    await expect.element(wheel("Day")).toBeVisible()
    await expect.element(wheel("Month")).toBeVisible()
    await expect.element(wheel("Year")).toBeVisible()
    await expect.element(page.getByRole("grid")).not.toBeInTheDocument()
    expect(document.querySelector("[data-slot=drawer-content]")).not.toBeNull()
    expect(selectedOption("Day")).toBe("4")
    expect(selectedOption("Month")).toBe("9")
    expect(selectedOption("Year")).toBe("2026")
  })

  it("orders the wheels month, day, year for en-US", async () => {
    await page.viewport(390, 844)
    await render(<DatePicker aria-label="Date" locale="en-US" />)
    await trigger().click()
    await expect.element(wheel("Year")).toBeVisible()
    expect(wheelOrder()).toEqual(["Month", "Day", "Year"])
  })

  it("orders the wheels day, month, year for tr-TR", async () => {
    await page.viewport(390, 844)
    await render(<DatePicker aria-label="Date" locale="tr-TR" />)
    await trigger().click()
    await expect.element(wheel("Year")).toBeVisible()
    expect(wheelOrder()).toEqual(["Day", "Month", "Year"])
    await expect
      .element(wheel("Month").getByRole("option", { name: "Ocak" }))
      .toBeInTheDocument()
  })

  it("orders the wheels year, month, day for ja-JP", async () => {
    await page.viewport(390, 844)
    await render(<DatePicker aria-label="Date" locale="ja-JP" />)
    await trigger().click()
    await expect.element(wheel("Year")).toBeVisible()
    expect(wheelOrder()).toEqual(["Year", "Month", "Day"])
  })

  it("shows the right number of days for each month", async () => {
    await page.viewport(390, 844)
    await render(
      <DatePicker
        aria-label="Date"
        locale="en-US"
        defaultValue={new Date(2026, 3, 10)}
      />
    )
    await trigger().click()
    await expect.element(wheel("Day")).toBeVisible()
    expect(options("Day")).toHaveLength(30)
    await press("Month", "{ArrowDown}")
    await expect.poll(() => options("Day")).toHaveLength(31)
  })

  it("clamps the day into February of a leap and a common year", async () => {
    await page.viewport(390, 844)
    const onValueChange = vi.fn()
    await render(
      <DatePicker
        aria-label="Date"
        locale="en-US"
        fromYear={2020}
        toYear={2030}
        defaultValue={new Date(2024, 0, 31)}
        onValueChange={onValueChange}
      />
    )
    await trigger().click()
    await expect.element(wheel("Day")).toBeVisible()
    expect(options("Day")).toHaveLength(31)

    await press("Month", "{ArrowDown}")
    await expect.poll(() => options("Day")).toHaveLength(29)
    const leap = onValueChange.mock.lastCall?.[0]
    expect([leap?.getFullYear(), leap?.getMonth(), leap?.getDate()]).toEqual([
      2024, 1, 29,
    ])
    await expect.poll(() => selectedOption("Day")).toBe("29")

    await press("Year", "{ArrowDown}")
    await expect.poll(() => options("Day")).toHaveLength(28)
    const common = onValueChange.mock.lastCall?.[0]
    expect([
      common?.getFullYear(),
      common?.getMonth(),
      common?.getDate(),
    ]).toEqual([2025, 1, 28])
    await expect.poll(() => selectedOption("Day")).toBe("28")
    await userEvent.keyboard("{Escape}")
    await expect.element(dialog()).not.toBeInTheDocument()
    await expect.element(trigger()).toHaveTextContent("Feb 28, 2025")
  })

  it("limits the year wheel to fromYear and toYear", async () => {
    await page.viewport(390, 844)
    const onValueChange = vi.fn()
    await render(
      <DatePicker
        aria-label="Date"
        locale="en-US"
        fromYear={2020}
        toYear={2022}
        defaultValue={new Date(2021, 5, 15)}
        onValueChange={onValueChange}
      />
    )
    await trigger().click()
    await expect.element(wheel("Year")).toBeVisible()
    expect(options("Year")).toEqual(["2020", "2021", "2022"])
    await press("Year", "{End}")
    expect(onValueChange.mock.lastCall?.[0]?.getFullYear()).toBe(2022)
    await press("Year", "{ArrowDown}")
    expect(onValueChange).toHaveBeenCalledTimes(1)
  })
})
