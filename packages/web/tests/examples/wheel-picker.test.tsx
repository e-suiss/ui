import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import WheelPickerDateTime from "@/examples/wheel-picker-date-time"
import WheelPickerDemo from "@/examples/wheel-picker-demo"
import WheelPickerDisabledItems from "@/examples/wheel-picker-disabled-items"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas, step } = await renderExample(<WheelPickerDemo />)

  const column = canvas.getByRole("listbox", { name: "Fruit" })

  await step("selects the default value", async () => {
    await expect(canvas.getByRole("option", { name: "Lemon" })).toHaveAttribute(
      "aria-selected",
      "true"
    )
  })

  await step("steps through the options with arrow keys", async () => {
    await userEvent.tab()
    await expect(column).toHaveFocus()
    await userEvent.keyboard("{ArrowDown}")
    const mango = canvas.getByRole("option", { name: "Mango" })
    await expect(mango).toHaveAttribute("aria-selected", "true")
    await expect(column).toHaveAttribute("aria-activedescendant", mango.id)
  })

  await step("jumps to the ends with Home and End", async () => {
    await userEvent.keyboard("{End}")
    await expect(canvas.getByRole("option", { name: "Plum" })).toHaveAttribute(
      "aria-selected",
      "true"
    )
    await userEvent.keyboard("{Home}")
    await expect(canvas.getByRole("option", { name: "Apple" })).toHaveAttribute(
      "aria-selected",
      "true"
    )
  })
})
test("Disabled Items", async () => {
  const { canvas, step } = await renderExample(<WheelPickerDisabledItems />)

  await step("skips the booked slots", async () => {
    await expect(canvas.getByRole("option", { name: "19:30" })).toHaveAttribute(
      "aria-disabled",
      "true"
    )
    canvas.getByRole("listbox", { name: "Reservation time" }).focus()
    await userEvent.keyboard("{ArrowDown}")
    await expect(canvas.getByRole("option", { name: "21:00" })).toHaveAttribute(
      "aria-selected",
      "true"
    )
  })

  await step("ignores clicks on a booked slot", async () => {
    await userEvent.click(canvas.getByRole("option", { name: "20:00" }))
    await expect(canvas.getByRole("option", { name: "20:00" })).toHaveAttribute(
      "aria-selected",
      "false"
    )
  })
})
test("Date Time", async () => {
  const { canvas, step } = await renderExample(<WheelPickerDateTime />)

  await step("names each column", async () => {
    await expect(canvas.getByRole("listbox", { name: "Day" })).toBeVisible()
    await expect(canvas.getByRole("listbox", { name: "Hour" })).toBeVisible()
    await expect(canvas.getByRole("listbox", { name: "Minute" })).toBeVisible()
  })

  await step("updates the summary as columns change", async () => {
    await expect(canvas.getByText("2026-10-04 19:30")).toBeVisible()
    canvas.getByRole("listbox", { name: "Hour" }).focus()
    await userEvent.keyboard("{ArrowDown}")
    canvas.getByRole("listbox", { name: "Minute" }).focus()
    await userEvent.keyboard("{ArrowUp}")
    canvas.getByRole("listbox", { name: "Day" }).focus()
    await userEvent.keyboard("{ArrowUp}")
    await expect(canvas.getByText("2026-10-03 20:25")).toBeVisible()
  })
})
