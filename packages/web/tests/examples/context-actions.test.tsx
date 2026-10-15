import { screen, waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import ContextActionsDemo from "@/examples/context-actions-demo"
import ContextActionsNotDismissible from "@/examples/context-actions-not-dismissible"
import ContextActionsWithIcons from "@/examples/context-actions-with-icons"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas, step } = await renderExample(<ContextActionsDemo />)

  const target = canvas.getByText("Right click or long press")

  await step("right click opens the actions", async () => {
    await userEvent.pointer({ keys: "[MouseRight]", target })
    await screen.findByRole("menu")
    await waitFor(() => expect(screen.getByText("Photo.jpg")).toBeVisible())
    await expect(screen.getAllByRole("menuitem")).toHaveLength(4)
  })

  await step("Escape closes the actions", async () => {
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
  })

  await step("arrow to an action and run it with Enter", async () => {
    await userEvent.pointer({ keys: "[MouseRight]", target })
    const menu = await screen.findByRole("menu")
    await waitFor(() => expect(menu).toHaveFocus())
    await userEvent.keyboard("{ArrowDown}")
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus()
    )
    await userEvent.keyboard("{Enter}")
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
  })

  await step("clicking an action closes the menu", async () => {
    await userEvent.pointer({ keys: "[MouseRight]", target })
    await userEvent.click(
      await screen.findByRole("menuitem", { name: "Share" })
    )
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
  })
})
test("With Icons", async () => {
  const { canvas, step } = await renderExample(<ContextActionsWithIcons />)

  const target = canvas.getByText("Right click or long press")

  await step("right click opens actions with icons", async () => {
    await userEvent.pointer({ keys: "[MouseRight]", target })
    await screen.findByRole("menu")
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: "Edit" })).toBeVisible()
    )
    const actions = screen.getAllByRole("menuitem")
    await expect(actions).toHaveLength(4)
    for (const action of actions) {
      await expect(action.querySelector("svg")).not.toBeNull()
    }
  })

  await step("clicking an action closes the menu", async () => {
    await userEvent.click(screen.getByRole("menuitem", { name: "Delete" }))
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
  })
})
test("Not Dismissible", async () => {
  const { canvas, step } = await renderExample(<ContextActionsNotDismissible />)

  const target = canvas.getByText("Right click or long press")

  await step("right click opens the actions", async () => {
    await userEvent.pointer({ keys: "[MouseRight]", target })
    await screen.findByRole("menu")
    await waitFor(() => expect(screen.getByText("Photo.jpg")).toBeVisible())
    await expect(screen.getAllByRole("menuitem")).toHaveLength(4)
  })

  await step("Escape closes the actions", async () => {
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
  })

  await step("arrow to an action and run it with Enter", async () => {
    await userEvent.pointer({ keys: "[MouseRight]", target })
    const menu = await screen.findByRole("menu")
    await waitFor(() => expect(menu).toHaveFocus())
    await userEvent.keyboard("{ArrowDown}")
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus()
    )
    await userEvent.keyboard("{Enter}")
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
  })

  await step("clicking an action closes the menu", async () => {
    await userEvent.pointer({ keys: "[MouseRight]", target })
    await userEvent.click(
      await screen.findByRole("menuitem", { name: "Share" })
    )
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
  })
})
