import { screen, waitFor, within } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import PanelDemo from "@/examples/panel-demo"
import PanelOpenByDefault from "@/examples/panel-open-by-default"
import PanelSides from "@/examples/panel-sides"
import PanelWithCloseLabel from "@/examples/panel-with-close-label"
import PanelWithoutCloseButton from "@/examples/panel-without-close-button"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas, step } = await renderExample(<PanelDemo />)

  const trigger = canvas.getByRole("button", { name: "Edit profile" })

  await step("opens a named panel with its form", async () => {
    await userEvent.click(trigger)
    const panel = await screen.findByRole("dialog", { name: "Edit profile" })
    await expect(panel).toHaveAccessibleDescription(
      "Update your details and save when you are done."
    )
    await expect(screen.getByLabelText("Name")).toHaveValue("Jordan Lee")
  })

  await step(
    "closes with Escape and returns focus to the trigger",
    async () => {
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
      await expect(trigger).toHaveFocus()
    }
  )

  await step("closes from the cancel button", async () => {
    await userEvent.click(trigger)
    await userEvent.click(await screen.findByRole("button", { name: "Cancel" }))
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })
})
test("Open By Default", async () => {
  const { step } = await renderExample(<PanelOpenByDefault />)

  await step("starts open and closes from the close button", async () => {
    const panel = await screen.findByRole("dialog", { name: "Edit profile" })
    await userEvent.click(within(panel).getByRole("button", { name: "Close" }))
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })
})
test("Sides", async () => {
  const { canvas, step } = await renderExample(<PanelSides />)

  for (const side of ["Top", "Right", "Bottom", "Left"]) {
    await step(`opens and closes the ${side.toLowerCase()} panel`, async () => {
      await userEvent.click(canvas.getByRole("button", { name: side }))
      const panel = await screen.findByRole("dialog", {
        name: "Edit profile",
      })
      await waitFor(() => expect(panel).toBeVisible())
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    })
  }
})
test("With Close Label", async () => {
  const { canvas, step } = await renderExample(<PanelWithCloseLabel />)

  await step("closes from the labelled close button", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Edit profile" }))
    const panel = await screen.findByRole("dialog", { name: "Edit profile" })
    await userEvent.click(within(panel).getByRole("button", { name: "Done" }))
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })
})
test("Without Close Button", async () => {
  const { canvas, step } = await renderExample(<PanelWithoutCloseButton />)

  await step("omits the close button and closes from cancel", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Edit profile" }))
    const panel = await screen.findByRole("dialog", { name: "Edit profile" })
    await expect(
      within(panel).queryByRole("button", { name: "Close" })
    ).toBeNull()
    await userEvent.click(within(panel).getByRole("button", { name: "Cancel" }))
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })
})
