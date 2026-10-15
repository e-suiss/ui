import { waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import MessageScrollerDemo from "@/examples/message-scroller-demo"
import MessageScrollerStartAtTop from "@/examples/message-scroller-start-at-top"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas, step } = await renderExample(<MessageScrollerDemo />)

  const viewport = canvas.getByRole("region", { name: "Messages" })
  const button = canvas.getByRole("button", {
    name: "Scroll to end",
    hidden: true,
  })

  await step("opens at the latest message inside a log", async () => {
    await expect(canvas.getByRole("log")).toBeInTheDocument()
    await waitFor(() =>
      expect(
        viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop
      ).toBeLessThan(2)
    )
    await expect(button).toHaveAttribute("data-active", "false")
  })

  await step("offers the scroll button once scrolled up", async () => {
    viewport.scrollTop = 0
    viewport.dispatchEvent(new WheelEvent("wheel", { deltaY: -500 }))
    await waitFor(() => expect(button).toHaveAttribute("data-active", "true"))
  })

  await step("returns to the end from the button", async () => {
    await userEvent.click(button)
    await waitFor(() =>
      expect(
        viewport.scrollHeight - viewport.clientHeight - viewport.scrollTop
      ).toBeLessThan(2)
    )
    await waitFor(() => expect(button).toHaveAttribute("data-active", "false"))
  })
})
test("Start At Top", async () => {
  const { canvas, step } = await renderExample(<MessageScrollerStartAtTop />)

  const viewport = canvas.getByRole("region", { name: "Messages" })
  const toStart = canvas.getByRole("button", {
    name: "Scroll to start",
    hidden: true,
  })
  const toEnd = canvas.getByRole("button", {
    name: "Scroll to end",
    hidden: true,
  })

  await step("opens at the first message", async () => {
    await waitFor(() => expect(toEnd).toHaveAttribute("data-active", "true"))
    await expect(viewport.scrollTop).toBe(0)
    await expect(toStart).toHaveAttribute("data-active", "false")
  })

  await step("jumps to the end and back", async () => {
    await userEvent.click(toEnd)
    await waitFor(() => expect(toStart).toHaveAttribute("data-active", "true"))
    await userEvent.click(toStart)
    await waitFor(() => expect(viewport.scrollTop).toBe(0))
  })
})
