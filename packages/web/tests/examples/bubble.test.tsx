import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import BubbleDemo from "@/examples/bubble-demo"
import BubbleInteractive from "@/examples/bubble-interactive"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas } = await renderExample(<BubbleDemo />)

  await expect(
    canvas.getByText("Are we still on for lunch tomorrow?")
  ).toBeVisible()
  await expect(canvas.queryByRole("button")).toBeNull()
})
test("Interactive", async () => {
  const { canvas } = await renderExample(<BubbleInteractive />)

  const bubble = canvas.getByRole("button", {
    name: "Show me the latest release notes",
  })
  await userEvent.tab()
  await expect(bubble).toHaveFocus()
})
