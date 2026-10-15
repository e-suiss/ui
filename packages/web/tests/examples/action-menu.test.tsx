import { screen, waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import {
  ActionMenu,
  ActionMenuContent,
  ActionMenuItem,
  ActionMenuLabel,
  ActionMenuSeparator,
  ActionMenuTrigger,
} from "@/components/patterns/action-menu"
import { Button } from "@/components/ui/button"
import ActionMenuDemo from "@/examples/action-menu-demo"
import ActionMenuNotDismissible from "@/examples/action-menu-not-dismissible"
import ActionMenuWithIcons from "@/examples/action-menu-with-icons"
import { renderExample } from "@/tests/render-example"

function ActionMenuOpenByDefault() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <ActionMenu defaultOpen>
        <ActionMenuTrigger render={<Button variant="outline" />}>
          Order actions
        </ActionMenuTrigger>
        <ActionMenuContent>
          <ActionMenuLabel>Order #1042</ActionMenuLabel>
          <ActionMenuItem>Edit</ActionMenuItem>
          <ActionMenuItem>Duplicate</ActionMenuItem>
          <ActionMenuItem>Share</ActionMenuItem>
          <ActionMenuSeparator />
          <ActionMenuItem variant="destructive">Delete</ActionMenuItem>
        </ActionMenuContent>
      </ActionMenu>
    </div>
  )
}

test("Default", async () => {
  const { canvas, step } = await renderExample(<ActionMenuDemo />)

  const trigger = canvas.getByRole("button", { name: "Order actions" })

  await step("opens a menu of actions from the trigger", async () => {
    await userEvent.click(trigger)
    await screen.findByRole("menu")
    await waitFor(() => expect(screen.getByText("Order #1042")).toBeVisible())
    await expect(screen.getAllByRole("menuitem")).toHaveLength(4)
  })

  await step("Escape closes and returns focus", async () => {
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  await step("arrow to an action and run it with Enter", async () => {
    await userEvent.keyboard("{ArrowDown}")
    await screen.findByRole("menu")
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus()
    )
    await userEvent.keyboard("{ArrowDown}")
    await expect(
      screen.getByRole("menuitem", { name: "Duplicate" })
    ).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  await step("clicking an action closes the menu", async () => {
    await userEvent.click(trigger)
    await userEvent.click(
      await screen.findByRole("menuitem", { name: "Delete" })
    )
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
  })
})
test("With Icons", async () => {
  const { canvas, step } = await renderExample(<ActionMenuWithIcons />)

  const trigger = canvas.getByRole("button", { name: "Order actions" })

  await step("shows an icon beside every action", async () => {
    await userEvent.click(trigger)
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

  await step("arrow to an action and run it with Enter", async () => {
    await userEvent.keyboard("{ArrowDown}")
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus()
    )
    await userEvent.keyboard("{ArrowDown}")
    await expect(
      screen.getByRole("menuitem", { name: "Duplicate" })
    ).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
  })
})
test("Not Dismissible", async () => {
  const { canvas, step } = await renderExample(<ActionMenuNotDismissible />)

  const trigger = canvas.getByRole("button", { name: "Order actions" })

  await step("opens a menu of actions from the trigger", async () => {
    await userEvent.click(trigger)
    await screen.findByRole("menu")
    await waitFor(() => expect(screen.getByText("Order #1042")).toBeVisible())
    await expect(screen.getAllByRole("menuitem")).toHaveLength(4)
  })

  await step("Escape closes and returns focus", async () => {
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  await step("arrow to an action and run it with Enter", async () => {
    await userEvent.keyboard("{ArrowDown}")
    await screen.findByRole("menu")
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus()
    )
    await userEvent.keyboard("{ArrowDown}")
    await expect(
      screen.getByRole("menuitem", { name: "Duplicate" })
    ).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  await step("clicking an action closes the menu", async () => {
    await userEvent.click(trigger)
    await userEvent.click(
      await screen.findByRole("menuitem", { name: "Delete" })
    )
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
  })
})
test("Open By Default", async () => {
  const { step } = await renderExample(<ActionMenuOpenByDefault />)

  await step("renders open and closes when an action runs", async () => {
    await userEvent.click(
      await screen.findByRole("menuitem", { name: "Share" })
    )
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
  })
})
