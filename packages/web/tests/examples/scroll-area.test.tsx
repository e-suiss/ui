import { waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import ScrollAreaDemo from "@/examples/scroll-area-demo"
import ScrollAreaHorizontal from "@/examples/scroll-area-horizontal"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvasElement, step } = await renderExample(<ScrollAreaDemo />)

  const viewport = canvasElement.querySelector<HTMLElement>(
    '[data-slot="scroll-area-viewport"]'
  )

  await step("scrolls the overflowing list vertically", async () => {
    await expect(viewport).not.toBeNull()
    if (!viewport) return
    await expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight)
    viewport.scrollTop = viewport.scrollHeight
    await waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(0))
  })

  await step("keeps the viewport reachable by keyboard", async () => {
    await userEvent.tab()
    await expect(viewport).toHaveFocus()
  })
})
test("Horizontal", async () => {
  const { canvas, canvasElement, step } = await renderExample(
    <ScrollAreaHorizontal />
  )

  await step("overflows horizontally with every album", async () => {
    const viewport = canvasElement.querySelector<HTMLElement>(
      '[data-slot="scroll-area-viewport"]'
    )
    await expect(viewport?.scrollWidth).toBeGreaterThan(
      viewport?.clientWidth ?? 0
    )
    await expect(canvas.getAllByRole("figure")).toHaveLength(7)
  })
})
