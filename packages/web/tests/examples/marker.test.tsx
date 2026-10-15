import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import MarkerDemo from "@/examples/marker-demo"
import MarkerWithIcon from "@/examples/marker-with-icon"
import MarkerWithLink from "@/examples/marker-with-link"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas, step } = await renderExample(<MarkerDemo />)

  await step("renders the marker text", async () => {
    await expect(canvas.getByText("Conversation started")).toBeVisible()
  })
})
test("With Icon", async () => {
  const { canvasElement, step } = await renderExample(<MarkerWithIcon />)

  await step("hides the decorative icons from assistive tech", async () => {
    const icons = canvasElement.querySelectorAll('[data-slot="marker-icon"]')
    await expect(icons).toHaveLength(2)
    for (const icon of icons) {
      await expect(icon).toHaveAttribute("aria-hidden", "true")
    }
  })
})
test("With Link", async () => {
  const { canvas, step } = await renderExample(<MarkerWithLink />)

  await step("keeps the inline link reachable by keyboard", async () => {
    const link = canvas.getByRole("link", { name: "Restore it" })
    await userEvent.tab()
    await expect(link).toHaveFocus()
  })
})
