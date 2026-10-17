import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import MessagePattern from "@/examples/message-pattern"
import { renderExample } from "@/tests/render-example"

test("Message", async () => {
  const { canvas, step } = await renderExample(<MessagePattern />)

  await step("renders the prompt and the reply", async () => {
    await expect(
      canvas.getByText(
        "How do I add a settings dialog? It should open from the gear icon in the header."
      )
    ).toBeVisible()
    await expect(
      canvas.getByText("npx @esuiss/ui@latest add dialog")
    ).toBeVisible()
  })

  await step("toggles feedback", async () => {
    const like = canvas.getByRole("button", { name: "Good response" })
    await expect(like).toHaveAttribute("aria-pressed", "false")
    await userEvent.click(like)
    await expect(like).toHaveAttribute("aria-pressed", "true")
    await userEvent.click(like)
    await expect(like).toHaveAttribute("aria-pressed", "false")
  })

  await step("confirms the copy", async () => {
    const [, copy] = canvas.getAllByRole("button", { name: "Copy" })
    await userEvent.click(copy as HTMLElement)
    await expect(
      await canvas.findByRole("button", { name: "Copied" })
    ).toBeVisible()
  })
})
