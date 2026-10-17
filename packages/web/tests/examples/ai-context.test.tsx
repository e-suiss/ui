import { screen, waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import ContextDemo from "@/examples/context-demo"
import { renderExample } from "@/tests/render-example"

const CONTEXT = /% context/

test("Default", async () => {
  const { canvas, step } = await renderExample(<ContextDemo />)

  const trigger = canvas.getByRole("button", { name: CONTEXT })

  await step("shows the share of the context window used", async () => {
    await expect(trigger).toHaveTextContent("8% context")
  })

  await step("opens the breakdown on hover", async () => {
    await userEvent.hover(trigger)
    await waitFor(() =>
      expect(
        screen.getByRole("progressbar", { name: "Context used" })
      ).toBeVisible()
    )
    await waitFor(() => expect(screen.getByText("Reasoning")).toBeVisible())
  })
})
