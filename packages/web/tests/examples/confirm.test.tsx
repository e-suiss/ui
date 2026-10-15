import { screen, waitFor, within } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import {
  Confirm,
  ConfirmAction,
  ConfirmCancel,
  ConfirmContent,
  ConfirmDescription,
  ConfirmFooter,
  ConfirmHeader,
  ConfirmTitle,
  ConfirmTrigger,
} from "@/components/patterns/confirm"
import { Button } from "@/components/ui/button"
import ConfirmDemo from "@/examples/confirm-demo"
import { renderExample } from "@/tests/render-example"

function ConfirmOpenByDefault() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Confirm defaultOpen>
        <ConfirmTrigger render={<Button variant="outline" />}>
          Delete order
        </ConfirmTrigger>
        <ConfirmContent>
          <ConfirmHeader>
            <ConfirmTitle>Delete order?</ConfirmTitle>
            <ConfirmDescription>
              Order #1042 will be permanently deleted. This action cannot be
              undone.
            </ConfirmDescription>
          </ConfirmHeader>
          <ConfirmFooter>
            <ConfirmCancel>Cancel</ConfirmCancel>
            <ConfirmAction variant="destructive">Delete</ConfirmAction>
          </ConfirmFooter>
        </ConfirmContent>
      </Confirm>
    </div>
  )
}

test("Default", async () => {
  const { canvas, step } = await renderExample(<ConfirmDemo />)

  const trigger = canvas.getByRole("button", { name: "Delete order" })

  await step("opens a named confirmation and moves focus in", async () => {
    await userEvent.click(trigger)
    const dialog = await screen.findByRole("alertdialog", {
      name: "Delete order?",
    })
    await expect(dialog).toHaveAccessibleDescription(
      "Order #1042 will be permanently deleted. This action cannot be undone."
    )
    await waitFor(() =>
      expect(dialog).toContainElement(document.activeElement as HTMLElement)
    )
  })

  await step("cancel closes and returns focus to the trigger", async () => {
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }))
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  await step("confirming with the action closes the dialog", async () => {
    await userEvent.click(trigger)
    const dialog = await screen.findByRole("alertdialog")
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Delete" })
    )
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull())
  })

  await step("is not dismissed by clicking outside", async () => {
    await userEvent.click(trigger)
    const dialog = await screen.findByRole("alertdialog")
    await waitFor(() => expect(dialog).toBeVisible())
    await userEvent.click(document.body, { pointerEventsCheck: 0 })
    await expect(dialog).toHaveAttribute("data-open")
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull())
  })
})
test("Open By Default", async () => {
  const { step } = await renderExample(<ConfirmOpenByDefault />)

  await step("renders open and closes from cancel", async () => {
    await screen.findByRole("alertdialog", { name: "Delete order?" })
    await userEvent.click(await screen.findByRole("button", { name: "Cancel" }))
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull())
  })
})
