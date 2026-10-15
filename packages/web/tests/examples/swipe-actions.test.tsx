import { waitFor, within } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import SwipeActionsBothSides from "@/examples/swipe-actions-both-sides"
import SwipeActionsDemo from "@/examples/swipe-actions-demo"
import { MOUSE_POINTER_ID } from "@/tests/pointer"
import { renderExample } from "@/tests/render-example"

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
function swipe(content: HTMLElement, dx: number) {
  const rect = content.getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2
  pointer(content, "pointerdown", x, y)
  for (let step = 1; step <= 4; step++) {
    pointer(content, "pointermove", x + (dx * step) / 4, y)
  }
  pointer(content, "pointerup", x + dx, y)
}
function rowOf(element: HTMLElement) {
  const row = element.closest<HTMLElement>("[data-slot=swipe-actions]")
  const content = row?.querySelector<HTMLElement>(
    "[data-slot=swipe-actions-content]"
  )
  if (!row || !content) throw new Error("swipe row not found")
  return { row, content }
}

test("Default", async () => {
  const { canvas, step } = await renderExample(<SwipeActionsDemo />)

  const status = canvas.getByRole("status")

  await step("reveals the trailing actions with a swipe left", async () => {
    const { row, content } = rowOf(canvas.getByText("Acme Store"))
    swipe(content, -120)
    await waitFor(() => expect(row).toHaveAttribute("data-open", "trailing"))
    await expect(
      within(row).getByRole("button", { name: "Archive" })
    ).toBeVisible()
  })

  await step("runs the tapped action", async () => {
    const { row } = rowOf(canvas.getByText("Acme Store"))
    await userEvent.click(within(row).getByRole("button", { name: "Archive" }))
    await expect(status).toHaveTextContent("Archived message 1")
    await expect(canvas.queryByText("Acme Store")).toBeNull()
  })

  await step("deletes a message with a full swipe", async () => {
    const { content } = rowOf(canvas.getByText("Jordan Lee"))
    swipe(content, -content.offsetWidth * 0.8)
    await waitFor(() => expect(status).toHaveTextContent("Deleted message 2"))
    await expect(canvas.queryByText("Jordan Lee")).toBeNull()
  })

  await step("closes an open row when tapping it", async () => {
    const { row, content } = rowOf(canvas.getByText("Cloud Drive"))
    swipe(content, -120)
    await waitFor(() => expect(row).toHaveAttribute("data-open", "trailing"))
    await userEvent.click(content)
    await waitFor(() => expect(row).not.toHaveAttribute("data-open"))
    await expect(status).toHaveTextContent("Deleted message 2")
  })

  await step("restores every message with reset", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Reset" }))
    await expect(canvas.getByText("Acme Store")).toBeVisible()
    await expect(canvas.getByText("Jordan Lee")).toBeVisible()
  })
})
test("Both Sides", async () => {
  const { canvas, step } = await renderExample(<SwipeActionsBothSides />)

  const status = canvas.getByRole("status")
  const { row, content } = rowOf(canvas.getByText("Acme Store"))

  await step("reveals the leading action with a swipe right", async () => {
    swipe(content, 100)
    await waitFor(() => expect(row).toHaveAttribute("data-open", "leading"))
  })

  await step("toggles unread from the leading action", async () => {
    await userEvent.click(within(row).getByRole("button", { name: "Unread" }))
    await expect(status).toHaveTextContent("Toggled unread on message 1")
    await waitFor(() => expect(row).not.toHaveAttribute("data-open"))
  })

  await step("still reveals the trailing actions the other way", async () => {
    swipe(content, -120)
    await waitFor(() => expect(row).toHaveAttribute("data-open", "trailing"))
  })
})
