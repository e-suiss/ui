import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import SwitchChecked from "@/examples/switch-checked"
import SwitchDemo from "@/examples/switch-demo"
import SwitchDisabled from "@/examples/switch-disabled"
import SwitchInvalid from "@/examples/switch-invalid"
import SwitchWithLabel from "@/examples/switch-with-label"
import { byBase } from "@/tests/base"
import { renderExample } from "@/tests/render-example"

const DISABLED = byBase({
  base: { name: "aria-disabled", value: "true" },
  radix: { name: "disabled", value: "" },
})

test("Default", async () => {
  const { canvas, step } = await renderExample(<SwitchDemo />)

  const control = canvas.getByRole("switch", { name: "Wi-Fi" })

  await step("toggles on click", async () => {
    await expect(control).toHaveAttribute("aria-checked", "false")
    await userEvent.click(control)
    await expect(control).toHaveAttribute("aria-checked", "true")
  })

  await step("toggles back with Space", async () => {
    await expect(control).toHaveFocus()
    await userEvent.keyboard(" ")
    await expect(control).toHaveAttribute("aria-checked", "false")
  })
})
test("Checked", async () => {
  const { canvas, step } = await renderExample(<SwitchChecked />)

  const control = canvas.getByRole("switch", { name: "Wi-Fi" })

  await step("starts on and turns off on click", async () => {
    await expect(control).toHaveAttribute("aria-checked", "true")
    await userEvent.click(control)
    await expect(control).toHaveAttribute("aria-checked", "false")
  })
})
test("With Label", async () => {
  const { canvas, step } = await renderExample(<SwitchWithLabel />)

  const control = canvas.getByRole("switch", { name: "Airplane mode" })

  await step("toggles from the label text", async () => {
    await userEvent.click(canvas.getByText("Airplane mode"))
    await expect(control).toHaveAttribute("aria-checked", "true")
  })
})
test("Disabled", async () => {
  const { canvas, step } = await renderExample(<SwitchDisabled />)

  const [off, on] = canvas.getAllByRole("switch") as [HTMLElement, HTMLElement]

  await step("ignores clicks while disabled", async () => {
    await expect(off).toHaveAttribute(DISABLED.name, DISABLED.value)
    await userEvent.click(off, { pointerEventsCheck: 0 })
    await expect(off).toHaveAttribute("aria-checked", "false")
    await expect(on).toHaveAttribute("aria-checked", "true")
  })
})
test("Invalid", async () => {
  const { canvas, step } = await renderExample(<SwitchInvalid />)

  const control = canvas.getByRole("switch", { name: "Accept terms" })

  await step("flags the switch as invalid", async () => {
    await expect(control).toBeInvalid()
    await expect(control).toHaveAttribute("aria-checked", "false")
  })

  await step("still toggles on click", async () => {
    await userEvent.click(control)
    await expect(control).toHaveAttribute("aria-checked", "true")
    await expect(control).toBeInvalid()
  })
})
