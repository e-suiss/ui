import { screen, waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import ModelSelectorDemo from "@/examples/model-selector-demo"
import { renderExample } from "@/tests/render-example"

test("Model Selector", async () => {
  const { canvas, step } = await renderExample(<ModelSelectorDemo />)

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
