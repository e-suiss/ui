import { screen, waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import PromptInputDemo from "@/examples/prompt-input-demo"
import { renderExample } from "@/tests/render-example"

test("Prompt Input", async () => {
  const { canvas, step } = await renderExample(<PromptInputDemo />)

  await step("removes an attachment", async () => {
    await expect(canvas.getByText("settings-page.tsx")).toBeVisible()
    await userEvent.click(
      canvas.getByRole("button", { name: "Remove settings-page.tsx" })
    )
    await waitFor(() =>
      expect(canvas.queryByText("settings-page.tsx")).toBeNull()
    )
  })

  await step("picks a model", async () => {
    await userEvent.click(
      canvas.getByRole("button", { name: "Model: Claude Opus 5.5" })
    )
    await userEvent.click(
      await screen.findByRole("menuitemradio", { name: "GPT-5" })
    )
    await expect(
      await canvas.findByRole("button", { name: "Model: GPT-5" })
    ).toBeVisible()
  })

  await step("picks an effort", async () => {
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    await userEvent.click(
      canvas.getByRole("button", { name: "Effort: Medium" })
    )
    await userEvent.click(
      await screen.findByRole("menuitemradio", { name: "High" })
    )
    await expect(
      await canvas.findByRole("button", { name: "Effort: High" })
    ).toBeVisible()
  })

  await step("sends and clears the prompt", async () => {
    const textbox = canvas.getByRole("textbox", { name: "Message" })
    await expect(canvas.getByRole("button", { name: "Send" })).toBeDisabled()
    await userEvent.type(textbox, "Add a settings page")
    await userEvent.click(canvas.getByRole("button", { name: "Send" }))
    await expect(textbox).toHaveValue("")
  })
})
