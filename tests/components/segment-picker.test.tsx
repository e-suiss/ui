import { ListIcon, SquaresFourIcon } from "@phosphor-icons/react"
import * as React from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import {
  SegmentPicker,
  SegmentPickerItem,
} from "@/components/patterns/segment-picker"

afterEach(async () => {
  await page.viewport(1280, 800)
})

type PickerProps = Partial<React.ComponentProps<typeof SegmentPicker>>

function Periods(props: PickerProps) {
  return (
    <SegmentPicker aria-label="Period" {...props}>
      <SegmentPickerItem value="day">Day</SegmentPickerItem>
      <SegmentPickerItem value="week">Week</SegmentPickerItem>
      <SegmentPickerItem value="month">Month</SegmentPickerItem>
      <SegmentPickerItem value="year" disabled>
        Year
      </SegmentPickerItem>
    </SegmentPicker>
  )
}

function Views(props: PickerProps) {
  return (
    <SegmentPicker aria-label="View" defaultValue="grid" {...props}>
      <SegmentPickerItem value="list" aria-label="List">
        <ListIcon />
      </SegmentPickerItem>
      <SegmentPickerItem value="grid" label="Grid">
        <SquaresFourIcon />
        Grid
      </SegmentPickerItem>
      <SegmentPickerItem value="table">
        <SquaresFourIcon />
      </SegmentPickerItem>
    </SegmentPicker>
  )
}

function Controlled() {
  const [value, setValue] = React.useState("month")
  return (
    <>
      <Periods value={value} onValueChange={setValue} />
      <span>Selected: {value}</span>
      <button type="button" onClick={() => setValue("day")}>
        Reset
      </button>
    </>
  )
}

function FormPicker(props: PickerProps) {
  const [submitted, setSubmitted] = React.useState("")
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitted(
          String(new FormData(event.currentTarget).get("period") ?? "")
        )
      }}
    >
      <Periods name="period" {...props} />
      <button type="submit">Submit</button>
      <output>{submitted ? `Sent ${submitted}` : "Nothing sent"}</output>
    </form>
  )
}

const group = () => page.getByRole("group", { name: "Period" })
const segment = (name: string) => page.getByRole("button", { name })
const select = (name = "Period") => page.getByRole("combobox", { name })

function pressed() {
  return Array.from(
    document.querySelectorAll<HTMLElement>("[aria-pressed=true]"),
    (item) => item.textContent
  )
}

function selectOptions() {
  return Array.from(
    document.querySelectorAll<HTMLOptionElement>("select option"),
    (option) => [option.value, option.textContent, option.disabled]
  )
}

const background = (name: string) =>
  getComputedStyle(segment(name).element()).backgroundColor

const wait = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms))

describe("SegmentPicker on desktop", () => {
  it("renders a labelled group with the default value pressed", async () => {
    await render(<Periods defaultValue="week" />)
    await expect.element(group()).toBeVisible()
    await expect
      .element(segment("Week"))
      .toHaveAttribute("aria-pressed", "true")
    expect(pressed()).toEqual(["Week"])
    await expect.element(select()).not.toBeInTheDocument()
  })

  it("starts with nothing pressed without a value", async () => {
    await render(<Periods />)
    await expect.element(segment("Day")).toBeVisible()
    expect(pressed()).toEqual([])
  })

  it("selects a segment on click and keeps it pressed on a second click", async () => {
    const onValueChange = vi.fn()
    await render(<Periods defaultValue="week" onValueChange={onValueChange} />)
    await segment("Month").click()
    await expect.poll(pressed).toEqual(["Month"])
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith("month")
    await segment("Month").click()
    await wait(100)
    expect(pressed()).toEqual(["Month"])
    expect(onValueChange).toHaveBeenCalledTimes(1)
  })

  it("moves focus with the arrow keys and selects with Enter and Space", async () => {
    const onValueChange = vi.fn()
    await render(<Periods defaultValue="day" onValueChange={onValueChange} />)
    await segment("Day").click()
    await userEvent.keyboard("{ArrowRight}")
    await expect.element(segment("Week")).toHaveFocus()
    expect(pressed()).toEqual(["Day"])
    await userEvent.keyboard("{Enter}")
    await expect.poll(pressed).toEqual(["Week"])
    await userEvent.keyboard("{ArrowRight}")
    await expect.element(segment("Month")).toHaveFocus()
    await userEvent.keyboard(" ")
    await expect.poll(pressed).toEqual(["Month"])
    expect(onValueChange.mock.calls).toEqual([["week"], ["month"]])
  })

  it("does not select a disabled segment", async () => {
    const onValueChange = vi.fn()
    await render(<Periods defaultValue="day" onValueChange={onValueChange} />)
    await expect.element(segment("Year")).toBeDisabled()
    await segment("Year").click({ force: true })
    await wait(100)
    expect(pressed()).toEqual(["Day"])
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it("disables every segment", async () => {
    await render(<Periods defaultValue="day" disabled />)
    for (const name of ["Day", "Week", "Month", "Year"]) {
      await expect.element(segment(name)).toBeDisabled()
    }
  })

  it("follows a controlled value", async () => {
    await render(<Controlled />)
    await expect.poll(pressed).toEqual(["Month"])
    await segment("Week").click()
    await expect.element(page.getByText("Selected: week")).toBeVisible()
    expect(pressed()).toEqual(["Week"])
    await page.getByRole("button", { name: "Reset" }).click()
    await expect.poll(pressed).toEqual(["Day"])
  })

  it("keeps a fixed controlled value", async () => {
    const onValueChange = vi.fn()
    await render(<Periods value="day" onValueChange={onValueChange} />)
    await segment("Week").click()
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith("week")
    await wait(100)
    expect(pressed()).toEqual(["Day"])
  })

  it("submits the value with a form", async () => {
    await render(<FormPicker defaultValue="week" />)
    await segment("Month").click()
    await page.getByRole("button", { name: "Submit" }).click()
    await expect.element(page.getByText("Sent month")).toBeVisible()
  })

  it("raises the pressed segment above the others", async () => {
    await render(<Periods defaultValue="day" />)
    await segment("Week").hover()
    const resting = background("Week")
    await expect.poll(() => background("Day")).not.toBe(resting)
    const raised = background("Day")
    await segment("Month").click()
    await page.getByRole("group", { name: "Period" }).hover()
    await expect.poll(() => background("Month")).toBe(raised)
    await expect.poll(() => background("Day")).toBe(resting)
  })

  it("names icon segments by their label", async () => {
    await render(<Views />)
    await expect
      .element(page.getByRole("button", { name: "List" }))
      .toHaveAttribute("aria-pressed", "false")
    await expect
      .element(page.getByRole("button", { name: "Grid" }))
      .toHaveAttribute("aria-pressed", "true")
  })
})

describe("SegmentPicker on mobile", () => {
  it("renders a native select with the default value", async () => {
    await page.viewport(390, 844)
    await render(<Periods defaultValue="week" />)
    await expect.element(select()).toHaveValue("week")
    await expect.element(group()).not.toBeInTheDocument()
    expect(selectOptions()).toEqual([
      ["day", "Day", false],
      ["week", "Week", false],
      ["month", "Month", false],
      ["year", "Year", true],
    ])
  })

  it("adds an empty placeholder option without a value", async () => {
    await page.viewport(390, 844)
    await render(<Periods />)
    await expect.element(select()).toHaveValue("")
    expect(selectOptions()[0]).toEqual(["", "", true])
    expect(selectOptions()).toHaveLength(5)
  })

  it("selects an option and reports it", async () => {
    const onValueChange = vi.fn()
    await page.viewport(390, 844)
    await render(<Periods defaultValue="day" onValueChange={onValueChange} />)
    await select().selectOptions("month")
    await expect.element(select()).toHaveValue("month")
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith("month")
  })

  it("labels icon options from the label, aria-label or value", async () => {
    await page.viewport(390, 844)
    await render(<Views />)
    await expect.element(select("View")).toHaveValue("grid")
    expect(selectOptions()).toEqual([
      ["list", "List", false],
      ["grid", "Grid", false],
      ["table", "table", false],
    ])
  })

  it("follows a controlled value", async () => {
    await page.viewport(390, 844)
    await render(<Controlled />)
    await expect.element(select()).toHaveValue("month")
    await select().selectOptions("week")
    await expect.element(page.getByText("Selected: week")).toBeVisible()
    await page.getByRole("button", { name: "Reset" }).click()
    await expect.element(select()).toHaveValue("day")
  })

  it("can be disabled and sized", async () => {
    await page.viewport(390, 844)
    const { rerender } = await render(<Periods defaultValue="day" disabled />)
    await expect.element(select()).toBeDisabled()
    await rerender(<Periods defaultValue="day" size="sm" />)
    await expect.element(select()).toHaveAttribute("data-size", "sm")
    await rerender(<Periods defaultValue="day" size="lg" />)
    await expect.element(select()).toHaveAttribute("data-size", "default")
  })

  it("submits the value with a form", async () => {
    await page.viewport(390, 844)
    await render(<FormPicker defaultValue="week" />)
    await select().selectOptions("day")
    await page.getByRole("button", { name: "Submit" }).click()
    await expect.element(page.getByText("Sent day")).toBeVisible()
  })
})
