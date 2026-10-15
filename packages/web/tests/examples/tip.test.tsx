import { screen, waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import TipDemo from "@/examples/tip-demo"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas, step } = await renderExample(<TipDemo />)

  const showAgain = canvas.getByRole("button", { name: "Show tips again" })

  await step("starts the tour with the compose tip", async () => {
    await userEvent.click(showAgain)
    const popover = await screen.findByRole("dialog", {
      name: "Start a note fast",
    })
    await expect(popover).toHaveAccessibleDescription(
      "Tap here any time to begin a new note."
    )
    await expect(canvas.queryByRole("note")).toBeNull()
  })

  await step("using the anchored control dismisses its tip", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "New note" }))
    await expect(canvas.getByRole("status")).toHaveTextContent(
      "Started a new note"
    )
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })

  await step("the next tip in the group follows", async () => {
    const card = await canvas.findByRole("note")
    await expect(card).toHaveTextContent("Pin your favorites")
    await userEvent.click(canvas.getByRole("button", { name: "Dismiss tip" }))
    await waitFor(() => expect(canvas.queryByRole("note")).toBeNull())
  })

  await step("dismissed tips stay away until they are reset", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "New note" }))
    await expect(screen.queryByRole("dialog")).toBeNull()
    await userEvent.click(showAgain)
    await screen.findByRole("dialog", { name: "Start a note fast" })
  })
})
