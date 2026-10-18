import { screen, waitFor, within } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import SelectDemo from "@/examples/select-demo"
import SelectDisabled from "@/examples/select-disabled"
import SelectGrouped from "@/examples/select-grouped"
import SelectInvalid from "@/examples/select-invalid"
import SelectOpen from "@/examples/select-open"
import SelectSmall from "@/examples/select-small"
import SelectWithIcons from "@/examples/select-with-icons"
import SelectWithValue from "@/examples/select-with-value"
import { base, byBase } from "@/tests/base"
import { renderExample } from "@/tests/render-example"

const TRIGGER = byBase({ base: "combobox", radix: "combobox", aria: "button" })

const INVALID = byBase({
  base: "aria-invalid",
  radix: "aria-invalid",
  aria: "data-invalid",
})

function triggerName(label: string) {
  return byBase<string | RegExp>({
    base: label,
    radix: label,
    aria: new RegExp(`${label}$`),
  })
}

test("Default", async () => {
  const { canvas, step } = await renderExample(<SelectDemo />)

  const trigger = canvas.getByRole(TRIGGER, { name: triggerName("Fruit") })

  await step("opens the list and picks an option", async () => {
    await expect(trigger).toHaveTextContent("Select a fruit")
    await userEvent.click(trigger)
    await screen.findByRole("listbox")
    await userEvent.click(await screen.findByRole("option", { name: "Banana" }))
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull())
    await expect(trigger).toHaveTextContent("Banana")
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  await step("marks the chosen option as selected", async () => {
    await userEvent.click(trigger)
    await expect(
      await screen.findByRole("option", { name: "Banana" })
    ).toHaveAttribute("aria-selected", "true")
  })

  await step("closes with Escape and keeps the value", async () => {
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
    await expect(trigger).toHaveTextContent("Banana")
  })
})
test("Open", async () => {
  const { canvas, step } = await renderExample(<SelectOpen />)

  await step("opens on mount with the value selected", async () => {
    await expect(
      await screen.findByRole("option", { name: "Banana" })
    ).toHaveAttribute("aria-selected", "true")
  })

  await step("picks another option from the keyboard", async () => {
    await waitFor(() =>
      expect(screen.getByRole("option", { name: "Banana" })).toHaveFocus()
    )
    await userEvent.keyboard("{ArrowDown}{Enter}")
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull())
    await expect(
      canvas.getByRole(TRIGGER, { name: triggerName("Fruit") })
    ).toHaveTextContent("Blueberry")
  })
})
test("With Value", async () => {
  const { canvas, step } = await renderExample(<SelectWithValue />)

  await step("shows the default value's label", async () => {
    await expect(
      canvas.getByRole(TRIGGER, { name: triggerName("Fruit") })
    ).toHaveTextContent("Blueberry")
  })
})
test("Small", async () => {
  const { canvas, step } = await renderExample(<SelectSmall />)

  const trigger = canvas.getByRole(TRIGGER, { name: triggerName("Fruit") })

  await step("opens the list and picks an option", async () => {
    await expect(trigger).toHaveAttribute("data-size", "sm")
    await userEvent.click(trigger)
    await userEvent.click(await screen.findByRole("option", { name: "Grapes" }))
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull())
    await expect(trigger).toHaveTextContent("Grapes")
  })
})
test("Grouped", async () => {
  const { canvas, step } = await renderExample(<SelectGrouped />)

  await step("labels each group of options", async () => {
    await expect(
      canvas.getByRole(TRIGGER, { name: triggerName("Timezone") })
    ).toHaveTextContent("Central European Time")
    await userEvent.click(
      canvas.getByRole(TRIGGER, { name: triggerName("Timezone") })
    )
    const europe = await screen.findByRole("group", { name: "Europe" })
    await expect(within(europe).getAllByRole("option")).toHaveLength(3)
    await expect(
      screen.getByRole("group", { name: "North America" })
    ).toBeInTheDocument()
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull())
  })
})
test("With Icons", async () => {
  const { canvas, step } = await renderExample(<SelectWithIcons />)

  const trigger = canvas.getByRole(TRIGGER, { name: triggerName("Theme") })

  await step("shows the default value", async () => {
    await expect(trigger).toHaveTextContent("System")
  })

  await step("opens the list and picks an option", async () => {
    await userEvent.click(trigger)
    const dark = await screen.findByRole("option", { name: "Dark" })
    await expect(dark.querySelector("svg")).toBeInTheDocument()
    await userEvent.click(dark)
    await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull())
    await expect(trigger).toHaveTextContent("Dark")
  })
})
test("Disabled", async () => {
  const { canvas, step } = await renderExample(<SelectDisabled />)

  const trigger = canvas.getByRole(TRIGGER, { name: triggerName("Fruit") })

  await step("does not open while disabled", async () => {
    await expect(trigger).toHaveAttribute("data-disabled")
    await userEvent.click(trigger, { pointerEventsCheck: 0 })
    await expect(screen.queryByRole("listbox")).toBeNull()
  })
})
test("Invalid", async () => {
  const { canvas, step } = await renderExample(<SelectInvalid />)

  await step("flags the trigger as invalid", async () => {
    const trigger = canvas.getByRole(TRIGGER, { name: triggerName("Fruit") })
    await expect(
      base === "aria" ? trigger.closest("[data-slot=select]") : trigger
    ).toHaveAttribute(INVALID, "true")
  })
})
