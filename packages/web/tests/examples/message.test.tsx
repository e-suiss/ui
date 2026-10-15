import { expect, test } from "vitest"
import MessageAlignEnd from "@/examples/message-align-end"
import MessageDemo from "@/examples/message-demo"
import MessageWithHeaderAndFooter from "@/examples/message-with-header-and-footer"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas, step } = await renderExample(<MessageDemo />)

  await step("shows the avatar and the message text", async () => {
    await expect(canvas.getByText("MK")).toBeVisible()
    await expect(
      canvas.getByText("Are we still on for lunch tomorrow?")
    ).toBeVisible()
  })
})
test("Align End", async () => {
  const { canvasElement, step } = await renderExample(<MessageAlignEnd />)

  await step("aligns the message to the end", async () => {
    await expect(
      canvasElement.querySelector('[data-slot="message"]')
    ).toHaveAttribute("data-align", "end")
  })
})
test("With Header And Footer", async () => {
  const { canvas, step } = await renderExample(<MessageWithHeaderAndFooter />)

  await step("shows the sender and timestamp", async () => {
    await expect(canvas.getByText("Jordan Lee")).toBeVisible()
    await expect(canvas.getByText("9:41 AM")).toBeVisible()
  })
})
