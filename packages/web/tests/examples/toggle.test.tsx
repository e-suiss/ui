import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import ToggleDemo from "@/examples/toggle-demo"
import ToggleDisabled from "@/examples/toggle-disabled"
import TogglePressed from "@/examples/toggle-pressed"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas, step } = await renderExample(<ToggleDemo />)

  const toggle = canvas.getByRole("button", { name: "Toggle bold" })

  await step("presses on click", async () => {
    await expect(toggle).toHaveAttribute("aria-pressed", "false")
    await userEvent.click(toggle)
    await expect(toggle).toHaveAttribute("aria-pressed", "true")
  })

  await step("releases with Enter", async () => {
    await userEvent.keyboard("{Enter}")
    await expect(toggle).toHaveAttribute("aria-pressed", "false")
  })
})
test("Pressed", async () => {
  const { canvas, step } = await renderExample(<TogglePressed />)

  const toggle = canvas.getByRole("button", { name: "Toggle bold" })

  await step("starts pressed and releases with Space", async () => {
    await expect(toggle).toHaveAttribute("aria-pressed", "true")
    await userEvent.tab()
    await userEvent.keyboard(" ")
    await expect(toggle).toHaveAttribute("aria-pressed", "false")
  })
})
test("Disabled", async () => {
  const { canvas, step } = await renderExample(<ToggleDisabled />)

  const toggle = canvas.getByRole("button", { name: "Toggle bold" })

  await step("ignores clicks while disabled", async () => {
    await expect(toggle).toBeDisabled()
    await userEvent.click(toggle, { pointerEventsCheck: 0 })
    await expect(toggle).toHaveAttribute("aria-pressed", "false")
  })
})
