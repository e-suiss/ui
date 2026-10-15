import { screen, waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import PickerControlled from "@/examples/picker-controlled"
import PickerDemo from "@/examples/picker-demo"
import PickerDisabled from "@/examples/picker-disabled"
import PickerGrouped from "@/examples/picker-grouped"
import PickerInvalid from "@/examples/picker-invalid"
import PickerWithValue from "@/examples/picker-with-value"
import { byBase } from "@/tests/base"
import { renderExample } from "@/tests/render-example"

const TRIGGER = byBase({ base: "combobox", radix: "combobox", aria: "button" })

function named(label: string) {
  return byBase<string | RegExp>({
    base: label,
    radix: label,
    aria: new RegExp(`${label}$`),
  })
}

test("Default", async () => {
  const { canvas, step } = await renderExample(<PickerDemo />)

  const trigger = canvas.getByRole(TRIGGER, { name: named("Fruit") })

  await step("shows the placeholder before a choice", async () => {
    await expect(trigger).toHaveTextContent("Select a fruit")
  })

  await step("opens the list and picks an option", async () => {
    await userEvent.click(trigger)
    await userEvent.click(
      await screen.findByRole("option", { name: "Blueberry" })
    )
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull())
    await expect(trigger).toHaveTextContent("Blueberry")
  })

  await step("closes with Escape without changing the value", async () => {
    await userEvent.click(trigger)
    await screen.findByRole("listbox")
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull())
    await expect(trigger).toHaveTextContent("Blueberry")
  })
})
test("With Value", async () => {
  const { canvas, step } = await renderExample(<PickerWithValue />)

  const trigger = canvas.getByRole(TRIGGER, { name: named("Fruit") })

  await step("shows the initial value and marks it in the list", async () => {
    await expect(trigger).toHaveTextContent("Banana")
    await userEvent.click(trigger)
    await expect(
      await screen.findByRole("option", { name: "Banana" })
    ).toHaveAttribute("aria-selected", "true")
  })

  await step("replaces it with a new choice", async () => {
    await userEvent.click(screen.getByRole("option", { name: "Grapes" }))
    await waitFor(() => expect(trigger).toHaveTextContent("Grapes"))
  })
})
test("Grouped", async () => {
  const { canvas, step } = await renderExample(<PickerGrouped />)

  const trigger = canvas.getByRole(TRIGGER, { name: named("Time zone") })

  await step("lists labelled groups with a disabled option", async () => {
    await userEvent.click(trigger)
    const europe = await screen.findByRole("group", { name: "Europe" })
    await waitFor(() => expect(europe).toBeVisible())
    await expect(
      screen.getByRole("option", { name: "Turkey Time" })
    ).toHaveAttribute("aria-disabled", "true")
  })

  await step("picks an option from a group", async () => {
    await userEvent.click(screen.getByRole("option", { name: "Pacific Time" }))
    await waitFor(() => expect(trigger).toHaveTextContent("Pacific Time"))
  })
})
test("Disabled", async () => {
  const { canvas, step } = await renderExample(<PickerDisabled />)

  await step("does not open when disabled", async () => {
    const trigger = canvas.getByRole(TRIGGER, { name: named("Fruit") })
    await expect(trigger).toBeDisabled()
    await userEvent.click(trigger, { pointerEventsCheck: 0 })
    await expect(screen.queryByRole("listbox")).toBeNull()
  })
})
test("Invalid", async () => {
  const { canvas, step } = await renderExample(<PickerInvalid />)

  await step("exposes the invalid state", async () => {
    const trigger = canvas.getByRole(TRIGGER, { name: named("Fruit") })
    if (byBase({ base: true, radix: true, aria: false }))
      await expect(trigger).toHaveAttribute("aria-invalid", "true")
    else
      await expect(trigger.closest("[data-invalid]")).toHaveAttribute(
        "data-invalid",
        "true"
      )
  })
})
test("Controlled", async () => {
  const { canvas, step } = await renderExample(<PickerControlled />)

  const trigger = canvas.getByRole(TRIGGER, { name: named("Fruit") })

  await step("starts with the controlled value", async () => {
    await expect(trigger).toHaveTextContent("Grapes")
    await expect(canvas.getByText("Selected: grapes")).toBeVisible()
  })

  await step("reports a new choice to the owner", async () => {
    await userEvent.click(trigger)
    await userEvent.click(
      await screen.findByRole("option", { name: "Pineapple" })
    )
    await waitFor(() =>
      expect(canvas.getByText("Selected: pineapple")).toBeVisible()
    )
    await expect(trigger).toHaveTextContent("Pineapple")
  })
})
