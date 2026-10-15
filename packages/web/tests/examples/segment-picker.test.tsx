import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import SegmentPickerControlled from "@/examples/segment-picker-controlled"
import SegmentPickerDemo from "@/examples/segment-picker-demo"
import SegmentPickerDisabled from "@/examples/segment-picker-disabled"
import SegmentPickerDisabledItem from "@/examples/segment-picker-disabled-item"
import SegmentPickerWithIcons from "@/examples/segment-picker-with-icons"
import SegmentPickerWithoutValue from "@/examples/segment-picker-without-value"
import { byBase } from "@/tests/base"
import { renderExample } from "@/tests/render-example"

const SINGLE = byBase({
  base: { group: "group", role: "button", pressed: "aria-pressed" },
  radix: { group: "radiogroup", role: "radio", pressed: "aria-checked" },
  aria: { group: "radiogroup", role: "radio", pressed: "aria-checked" },
} as const)

test("Default", async () => {
  const { canvas, step } = await renderExample(<SegmentPickerDemo />)

  const week = canvas.getByRole(SINGLE.role, { name: "Week" })
  const month = canvas.getByRole(SINGLE.role, { name: "Month" })

  await step("starts with the default segment pressed", async () => {
    await expect(
      canvas.getByRole(SINGLE.group, { name: "Period" })
    ).toBeVisible()
    await expect(week).toHaveAttribute(SINGLE.pressed, "true")
  })

  await step("moves the selection to a clicked segment", async () => {
    await userEvent.click(month)
    await expect(month).toHaveAttribute(SINGLE.pressed, "true")
    await expect(week).toHaveAttribute(SINGLE.pressed, "false")
  })

  await step(
    "keeps the selection when the pressed segment is clicked",
    async () => {
      await userEvent.click(month)
      await expect(month).toHaveAttribute(SINGLE.pressed, "true")
    }
  )
})
test("Without Value", async () => {
  const { canvas, step } = await renderExample(<SegmentPickerWithoutValue />)

  await step("starts with nothing pressed and selects on click", async () => {
    for (const button of canvas.getAllByRole(SINGLE.role)) {
      await expect(button).toHaveAttribute(SINGLE.pressed, "false")
    }
    const day = canvas.getByRole(SINGLE.role, { name: "Day" })
    await userEvent.click(day)
    await expect(day).toHaveAttribute(SINGLE.pressed, "true")
  })
})
test("With Icons", async () => {
  const { canvas, step } = await renderExample(<SegmentPickerWithIcons />)

  await step("selects icon-only segments by their labels", async () => {
    await expect(
      canvas.getByRole(SINGLE.role, { name: "Grid" })
    ).toHaveAttribute(SINGLE.pressed, "true")
    const table = canvas.getByRole(SINGLE.role, { name: "Table" })
    await userEvent.click(table)
    await expect(table).toHaveAttribute(SINGLE.pressed, "true")
  })
})
test("Disabled Item", async () => {
  const { canvas, step } = await renderExample(<SegmentPickerDisabledItem />)

  await step("ignores the disabled segment", async () => {
    const year = canvas.getByRole(SINGLE.role, { name: "Year" })
    await expect(year).toBeDisabled()
    await userEvent.click(year, { pointerEventsCheck: 0 })
    await expect(year).toHaveAttribute(SINGLE.pressed, "false")
    await expect(
      canvas.getByRole(SINGLE.role, { name: "Week" })
    ).toHaveAttribute(SINGLE.pressed, "true")
  })
})
test("Disabled", async () => {
  const { canvas, step } = await renderExample(<SegmentPickerDisabled />)

  await step("disables every segment", async () => {
    for (const button of canvas.getAllByRole(SINGLE.role)) {
      await expect(button).toBeDisabled()
    }
  })
})
test("Controlled", async () => {
  const { canvas, step } = await renderExample(<SegmentPickerControlled />)

  await step("starts with the controlled value", async () => {
    await expect(
      canvas.getByRole(SINGLE.role, { name: "Month" })
    ).toHaveAttribute(SINGLE.pressed, "true")
    await expect(canvas.getByText("Selected: month")).toBeVisible()
  })

  await step("reports a new choice to the owner", async () => {
    const year = canvas.getByRole(SINGLE.role, { name: "Year" })
    await userEvent.click(year)
    await expect(canvas.getByText("Selected: year")).toBeVisible()
    await expect(year).toHaveAttribute(SINGLE.pressed, "true")
  })
})
