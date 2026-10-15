import { screen, waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import {
  AlertSheet,
  AlertSheetAction,
  AlertSheetCancel,
  AlertSheetContent,
  AlertSheetDescription,
  AlertSheetGroup,
  AlertSheetHeader,
  AlertSheetTitle,
  AlertSheetTrigger,
} from "@/components/ui/alert-sheet"
import { Button } from "@/components/ui/button"
import AlertSheetDemo from "@/examples/alert-sheet-demo"
import AlertSheetNotDismissible from "@/examples/alert-sheet-not-dismissible"
import { renderExample } from "@/tests/render-example"

function AlertSheetOpenByDefault() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <AlertSheet defaultOpen>
        <AlertSheetTrigger render={<Button variant="outline" />}>
          Delete order
        </AlertSheetTrigger>
        <AlertSheetContent>
          <AlertSheetGroup>
            <AlertSheetHeader>
              <AlertSheetTitle className="sr-only">
                Delete order
              </AlertSheetTitle>
              <AlertSheetDescription>
                Order #1042 will be permanently deleted. This action cannot be
                undone.
              </AlertSheetDescription>
            </AlertSheetHeader>
            <AlertSheetAction variant="destructive">
              Delete Order
            </AlertSheetAction>
          </AlertSheetGroup>
          <AlertSheetCancel>Cancel</AlertSheetCancel>
        </AlertSheetContent>
      </AlertSheet>
    </div>
  )
}
function AlertSheetWithTitleOpen() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <AlertSheet defaultOpen>
        <AlertSheetTrigger render={<Button variant="outline" />}>
          Sign out
        </AlertSheetTrigger>
        <AlertSheetContent>
          <AlertSheetGroup>
            <AlertSheetHeader>
              <AlertSheetTitle>Sign out of your account?</AlertSheetTitle>
              <AlertSheetDescription>
                You will need to sign in again to access your projects.
              </AlertSheetDescription>
            </AlertSheetHeader>
            <AlertSheetAction variant="destructive">Sign Out</AlertSheetAction>
          </AlertSheetGroup>
          <AlertSheetCancel>Cancel</AlertSheetCancel>
        </AlertSheetContent>
      </AlertSheet>
    </div>
  )
}
function AlertSheetMultipleActionsOpen() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <AlertSheet defaultOpen>
        <AlertSheetTrigger render={<Button variant="outline" />}>
          Close draft
        </AlertSheetTrigger>
        <AlertSheetContent>
          <AlertSheetGroup>
            <AlertSheetHeader>
              <AlertSheetTitle>Save changes to this draft?</AlertSheetTitle>
            </AlertSheetHeader>
            <AlertSheetAction>Save Draft</AlertSheetAction>
            <AlertSheetAction variant="destructive">
              Delete Draft
            </AlertSheetAction>
          </AlertSheetGroup>
          <AlertSheetCancel>Cancel</AlertSheetCancel>
        </AlertSheetContent>
      </AlertSheet>
    </div>
  )
}

test("Default", async () => {
  const { canvas, step } = await renderExample(<AlertSheetDemo />)

  const trigger = canvas.getByRole("button", { name: "Delete order" })

  await step("opens a named sheet with focus on cancel", async () => {
    await userEvent.click(trigger)
    const sheet = await screen.findByRole("dialog", { name: "Delete order" })
    await expect(sheet).toHaveAccessibleDescription(
      "Order #1042 will be permanently deleted. This action cannot be undone."
    )
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus()
    )
  })

  await step("closes with Escape and returns focus", async () => {
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  await step("closes from the action", async () => {
    await userEvent.click(trigger)
    await userEvent.click(
      await screen.findByRole("button", { name: "Delete Order" })
    )
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })
})
test("Open By Default", async () => {
  const { step } = await renderExample(<AlertSheetOpenByDefault />)

  await step("renders a named sheet open on mount", async () => {
    const sheet = await screen.findByRole("dialog", { name: "Delete order" })
    await waitFor(() => expect(sheet).toBeVisible())
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus()
    )
  })

  await step("closes from cancel", async () => {
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }))
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })
})
test("Not Dismissible", async () => {
  const { canvas, step } = await renderExample(<AlertSheetNotDismissible />)

  await userEvent.click(canvas.getByRole("button", { name: "Delete order" }))

  await step("opens as an alert dialog", async () => {
    await expect(
      await screen.findByRole("alertdialog", { name: "Delete order" })
    ).toBeVisible()
  })

  await step("closes from cancel", async () => {
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }))
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull())
  })
})
test("With Title", async () => {
  const { step } = await renderExample(<AlertSheetWithTitleOpen />)

  await step("names the sheet from its visible title", async () => {
    const sheet = await screen.findByRole("dialog", {
      name: "Sign out of your account?",
    })
    await expect(sheet).toHaveAccessibleDescription(
      "You will need to sign in again to access your projects."
    )
    await expect(screen.getByText("Sign out of your account?")).toBeVisible()
  })

  await step("closes from the action", async () => {
    await userEvent.click(screen.getByRole("button", { name: "Sign Out" }))
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })
})
test("Multiple Actions", async () => {
  await renderExample(<AlertSheetMultipleActionsOpen />)

  const sheet = await screen.findByRole("dialog", {
    name: "Save changes to this draft?",
  })
  await expect(sheet).toContainElement(
    screen.getByRole("button", { name: "Save Draft" })
  )
  await expect(sheet).toContainElement(
    screen.getByRole("button", { name: "Delete Draft" })
  )
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus()
  )
})
