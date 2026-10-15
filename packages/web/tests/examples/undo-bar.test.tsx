import { waitFor, within } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import UndoBarDemo from "@/examples/undo-bar-demo"
import UndoBarLongerTimeout from "@/examples/undo-bar-longer-timeout"
import UndoBarWithSwipeActions from "@/examples/undo-bar-with-swipe-actions"
import { MOUSE_POINTER_ID } from "@/tests/pointer"
import { renderExample } from "@/tests/render-example"

const GROCERIES_FIRST = /^Groceries/
const DELETED = /deleted/
function pointer(target: EventTarget, type: string, x: number, y: number) {
  target.dispatchEvent(
    new PointerEvent(type, {
      pointerId: MOUSE_POINTER_ID,
      pointerType: "touch",
      isPrimary: true,
      button: 0,
      buttons: type === "pointerup" ? 0 : 1,
      clientX: x,
      clientY: y,
      bubbles: true,
      cancelable: true,
    })
  )
}
function swipeLeft(content: HTMLElement, distance: number) {
  const rect = content.getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2
  pointer(content, "pointerdown", x, y)
  for (let step = 1; step <= 4; step++) {
    pointer(content, "pointermove", x - (distance * step) / 4, y)
  }
  pointer(content, "pointerup", x - distance, y)
}
function contentOf(element: HTMLElement) {
  const content = element.closest<HTMLElement>(
    "[data-slot=swipe-actions-content]"
  )
  if (!content) throw new Error("swipe content not found")
  return content
}

test("Default", async () => {
  const { canvas, step } = await renderExample(<UndoBarDemo />)

  const status = canvas.getByRole("status")

  await step("deleting a note offers to undo it", async () => {
    await userEvent.click(
      canvas.getByRole("button", { name: "Delete Groceries" })
    )
    await expect(canvas.queryByText("Groceries")).toBeNull()
    const bar = await canvas.findByRole("group", {
      name: "“Groceries” deleted",
    })
    await waitFor(() => expect(bar).toBeVisible())
  })

  await step("undo restores the note in its place", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Undo" }))
    await expect(status).toHaveTextContent("Restored “Groceries”")
    await expect(canvas.getByRole("list").textContent).toMatch(GROCERIES_FIRST)
    await waitFor(() =>
      expect(canvas.queryByRole("group", { name: DELETED })).toBeNull()
    )
  })

  await step("Ctrl+Z undoes the latest deletion", async () => {
    await userEvent.click(
      canvas.getByRole("button", { name: "Delete Book list" })
    )
    await canvas.findByRole("group", { name: "“Book list” deleted" })
    await userEvent.keyboard("{Control>}z{/Control}")
    await expect(status).toHaveTextContent("Restored “Book list”")
    await expect(canvas.getByText("Book list")).toBeVisible()
  })

  await step("the deletion commits once the timer runs out", async () => {
    await userEvent.click(
      canvas.getByRole("button", { name: "Delete Trip ideas" })
    )
    await waitFor(
      () =>
        expect(status).toHaveTextContent("Deleted “Trip ideas” permanently"),
      { timeout: 8000 }
    )
    await waitFor(() =>
      expect(canvas.queryByRole("group", { name: DELETED })).toBeNull()
    )
    await expect(canvas.queryByText("Trip ideas")).toBeNull()
  })
})
test("Longer Timeout", async () => {
  const { canvas, step } = await renderExample(<UndoBarLongerTimeout />)

  const status = canvas.getByRole("status")

  await step("keeps the bar past the default five seconds", async () => {
    await userEvent.click(
      canvas.getByRole("button", { name: "Delete Meeting notes" })
    )
    await new Promise((resolve) => setTimeout(resolve, 6000))
    await expect(
      canvas.getByRole("group", { name: "“Meeting notes” deleted" })
    ).toBeVisible()
    await expect(status).toHaveTextContent("Removed “Meeting notes”")
  })

  await step("still restores the note late in the window", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Undo" }))
    await expect(status).toHaveTextContent("Restored “Meeting notes”")
    await expect(canvas.getByText("Meeting notes")).toBeVisible()
  })
})
test("With Swipe Actions", async () => {
  const { canvas, step } = await renderExample(<UndoBarWithSwipeActions />)

  const status = canvas.getByRole("status")

  await step("swiping and tapping Delete removes the note", async () => {
    const content = contentOf(canvas.getByText("Groceries"))
    swipeLeft(content, 100)
    const row = content.parentElement
    if (!row) throw new Error("swipe row not found")
    await userEvent.click(within(row).getByRole("button", { name: "Delete" }))
    await expect(canvas.queryByText("Groceries")).toBeNull()
    await canvas.findByRole("group", { name: "“Groceries” deleted" })
  })

  await step("undo brings the swiped note back", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Undo" }))
    await expect(status).toHaveTextContent("Restored “Groceries”")
    await expect(canvas.getByText("Groceries")).toBeVisible()
  })

  await step("a full swipe deletes and can be undone too", async () => {
    const content = contentOf(canvas.getByText("Trip ideas"))
    swipeLeft(content, content.offsetWidth * 0.8)
    await canvas.findByRole("group", { name: "“Trip ideas” deleted" })
    await userEvent.click(canvas.getByRole("button", { name: "Undo" }))
    await expect(canvas.getByText("Trip ideas")).toBeVisible()
  })
})
