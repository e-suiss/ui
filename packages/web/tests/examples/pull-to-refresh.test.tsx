import { waitFor, within } from "@testing-library/dom"
import { expect, test } from "vitest"
import PullToRefreshDemo from "@/examples/pull-to-refresh-demo"
import PullToRefreshEmptyList from "@/examples/pull-to-refresh-empty-list"
import { renderExample } from "@/tests/render-example"

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
function canCreateTouch() {
  try {
    return Boolean(new Touch({ identifier: 0, target: document.body }))
  } catch {
    return false
  }
}
function scrollerOf(element: HTMLElement) {
  const scroller = element.closest<HTMLElement>("[data-slot=pull-to-refresh]")
  if (!scroller) throw new Error("Pull to refresh is not rendered")
  return scroller
}
function touchAt(target: HTMLElement, clientY: number) {
  const { left, width } = target.getBoundingClientRect()
  return new Touch({
    identifier: 1,
    target,
    clientX: left + width / 2,
    clientY,
  })
}
async function dragDown(target: HTMLElement, distance: number) {
  const { top } = target.getBoundingClientRect()
  const start = touchAt(target, top + 10)
  const touch = (type: string, point: Touch) =>
    target.dispatchEvent(
      new TouchEvent(type, {
        bubbles: true,
        cancelable: true,
        touches: type === "touchend" ? [] : [point],
        changedTouches: [point],
      })
    )
  touch("touchstart", start)
  let last = start
  for (let step = 1; step <= 10; step += 1) {
    last = touchAt(target, top + 10 + (distance * step) / 10)
    touch("touchmove", last)
    await wait(16)
  }
  touch("touchend", last)
}
async function wheelDown(target: HTMLElement, distance: number) {
  for (let step = 0; step < 4; step += 1) {
    target.dispatchEvent(
      new WheelEvent("wheel", {
        bubbles: true,
        cancelable: true,
        deltaY: -distance / 4,
      })
    )
    await wait(16)
  }
}

test("Default", async () => {
  const { canvas, step } = await renderExample(<PullToRefreshDemo />)

  const heading = canvas.getByRole("heading", { name: "Inbox" })
  const scroller = scrollerOf(heading)
  if (!canCreateTouch()) return

  await step("ignores a short pull", async () => {
    await dragDown(heading, 60)
    await waitFor(() => expect(scroller).toHaveAttribute("data-phase", "idle"))
    await expect(scroller).toHaveAttribute("aria-busy", "false")
    await expect(
      canvas.getByText("Pull down from the top to refresh.")
    ).toBeInTheDocument()
  })

  await step("refreshes after dragging past the threshold", async () => {
    await dragDown(heading, 300)
    await expect(scroller).toHaveAttribute("aria-busy", "true")
    await expect(
      within(scroller).getByRole("status", { name: "Refreshing" })
    ).toBeInTheDocument()
    await expect(canvas.getByText("Refreshing…")).toBeInTheDocument()
  })

  await step("settles with the new message on top", async () => {
    await waitFor(
      () => expect(scroller).toHaveAttribute("data-phase", "idle"),
      { timeout: 4000 }
    )
    await expect(scroller).toHaveAttribute("aria-busy", "false")
    await expect(
      canvas.getByText("New message from Morgan Diaz")
    ).toBeInTheDocument()
    const [first] = within(scroller).getAllByRole("listitem")
    await expect(first).toHaveTextContent("Morgan Diaz")
  })
})
test("Empty List", async () => {
  const { canvas, step } = await renderExample(<PullToRefreshEmptyList />)

  const heading = canvas.getByRole("heading", { name: "Inbox" })
  const scroller = scrollerOf(heading)

  await step("refreshes from a trackpad pull", async () => {
    await expect(canvas.getByText("No messages yet.")).toBeInTheDocument()
    await wheelDown(heading, 300)
    await waitFor(() => expect(scroller).toHaveAttribute("aria-busy", "true"))
    await expect(
      within(scroller).getByRole("status", { name: "Refreshing" })
    ).toBeInTheDocument()
  })

  await step("fills the empty list once it settles", async () => {
    await waitFor(
      () => expect(scroller).toHaveAttribute("data-phase", "idle"),
      { timeout: 4000 }
    )
    await expect(canvas.queryByText("No messages yet.")).toBeNull()
    await expect(within(scroller).getAllByRole("listitem")).toHaveLength(1)
  })
})
