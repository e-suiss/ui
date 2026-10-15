import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import KbdDemo from "@/examples/kbd-demo"
import KbdGroupExample from "@/examples/kbd-group"
import KbdInInputGroup from "@/examples/kbd-in-input-group"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvasElement, step } = await renderExample(<KbdDemo />)

  await step("renders the shortcut inside a kbd element", async () => {
    const kbd = canvasElement.querySelector("kbd")
    await expect(kbd).not.toBeNull()
    await expect(kbd).toHaveTextContent("K")
    await expect(kbd?.textContent?.length).toBeGreaterThan(1)
  })
})
test("Group", async () => {
  const { canvasElement, step } = await renderExample(<KbdGroupExample />)

  await step("nests each key inside its group", async () => {
    const groups = canvasElement.querySelectorAll('[data-slot="kbd-group"]')
    await expect(groups).toHaveLength(2)
    await expect(groups[0]?.querySelectorAll('[data-slot="kbd"]')).toHaveLength(
      2
    )
    await expect(groups[1]?.querySelectorAll('[data-slot="kbd"]')).toHaveLength(
      3
    )
  })
})
test("In Input Group", async () => {
  const { canvas, canvasElement, step } = await renderExample(
    <KbdInInputGroup />
  )

  const input = canvas.getByPlaceholderText("Search...")
  const kbd = canvasElement.querySelector<HTMLElement>('[data-slot="kbd"]')
  const addon = kbd?.closest<HTMLElement>('[data-slot="input-group-addon"]')

  await step("shows the shortcut in the trailing addon", async () => {
    await expect(kbd).toHaveTextContent("K")
    await expect(addon).toHaveAttribute("data-align", "inline-end")
  })

  await step("focuses the input from the hint and accepts text", async () => {
    if (addon) await userEvent.click(addon)
    await expect(input).toHaveFocus()
    await userEvent.keyboard("dialog")
    await expect(input).toHaveValue("dialog")
  })
})
