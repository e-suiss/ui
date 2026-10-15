import { waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import ResizableCards from "@/examples/resizable-cards"
import ResizableCardsVertical from "@/examples/resizable-cards-vertical"
import ResizableDemo from "@/examples/resizable-demo"
import ResizableNested from "@/examples/resizable-nested"
import ResizableVertical from "@/examples/resizable-vertical"
import ResizableWithHandle from "@/examples/resizable-with-handle"
import { renderExample } from "@/tests/render-example"

test("Default", async () => {
  const { canvas, step } = await renderExample(<ResizableDemo />)

  const handle = canvas.getByRole("separator")

  await step("starts split evenly", async () => {
    await expect(handle).toHaveAttribute("aria-valuenow", "50")
  })

  await step("resizes with the arrow keys", async () => {
    await userEvent.tab()
    await expect(handle).toHaveFocus()
    await userEvent.keyboard("{ArrowRight}")
    await expect(Number(handle.getAttribute("aria-valuenow"))).toBeGreaterThan(
      50
    )
    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}")
    await expect(Number(handle.getAttribute("aria-valuenow"))).toBeLessThan(50)
  })
})
test("With Handle", async () => {
  const { canvas, step } = await renderExample(<ResizableWithHandle />)

  const handle = canvas.getByRole("separator")

  await step("stops at the sidebar's minimum size", async () => {
    await expect(handle).toHaveAttribute("aria-valuenow", "30")
    handle.focus()
    await userEvent.keyboard("{Home}")
    await expect(handle).toHaveAttribute("aria-valuenow", "20")
  })
})
test("Vertical", async () => {
  const { canvas, step } = await renderExample(<ResizableVertical />)

  const handle = canvas.getByRole("separator")

  await step("resizes with the up and down keys", async () => {
    await expect(handle).toHaveAttribute("aria-orientation", "horizontal")
    handle.focus()
    await userEvent.keyboard("{ArrowDown}")
    await expect(Number(handle.getAttribute("aria-valuenow"))).toBeGreaterThan(
      30
    )
  })
})
test("Nested", async () => {
  const { canvas, step } = await renderExample(<ResizableNested />)

  const [outer, inner] = canvas.getAllByRole("separator")
  if (!outer || !inner) throw new Error("separators not rendered")

  await step("starts each group at its default split", async () => {
    await expect(outer).toHaveAttribute("aria-valuenow", "30")
    await expect(outer).toHaveAttribute("aria-orientation", "vertical")
    await expect(inner).toHaveAttribute("aria-valuenow", "65")
    await expect(inner).toHaveAttribute("aria-orientation", "horizontal")
  })

  await step("resizes the side panel with left and right", async () => {
    outer.focus()
    await userEvent.keyboard("{ArrowRight}")
    await expect(Number(outer.getAttribute("aria-valuenow"))).toBeGreaterThan(
      30
    )
    await expect(inner).toHaveAttribute("aria-valuenow", "65")
  })

  await step("resizes the nested panels with up and down", async () => {
    await userEvent.tab()
    await expect(inner).toHaveFocus()
    await userEvent.keyboard("{ArrowUp}")
    await expect(Number(inner.getAttribute("aria-valuenow"))).toBeLessThan(65)
  })
})
test("Cards", async () => {
  const { canvas, canvasElement, step } = await renderExample(
    <ResizableCards />
  )

  const handle = canvas.getByRole("separator")

  await step("reports each card's share", async () => {
    await waitFor(() => expect(canvas.getAllByText("50%")).toHaveLength(2))
  })

  await step("collapses the first card past its minimum", async () => {
    handle.focus()
    await userEvent.keyboard("{Home}")
    await waitFor(() => expect(canvas.getByText("100%")).toBeVisible())
    await expect(handle).toHaveAttribute("data-collapsed", "start")
  })

  await step("keeps the collapsed card out of the tab order", async () => {
    const collapsed = canvasElement.querySelector("#pos")
    await waitFor(() => expect(collapsed).toHaveAttribute("inert"))
    await userEvent.keyboard("{End}")
    await waitFor(() => expect(collapsed).not.toHaveAttribute("inert"))
    await userEvent.keyboard("{Home}")
    await waitFor(() => expect(collapsed).toHaveAttribute("inert"))
  })
})
test("Cards Vertical", async () => {
  const { canvas, step } = await renderExample(<ResizableCardsVertical />)

  const handle = canvas.getByRole("separator")

  await step("splits the cards evenly", async () => {
    await expect(handle).toHaveAttribute("aria-orientation", "horizontal")
    await expect(handle).toHaveAttribute("aria-valuenow", "50")
    await waitFor(() => expect(canvas.getAllByText("50%")).toHaveLength(2))
  })

  await step("resizes with the up and down keys", async () => {
    handle.focus()
    await userEvent.keyboard("{ArrowDown}")
    await waitFor(() =>
      expect(Number(handle.getAttribute("aria-valuenow"))).toBeGreaterThan(50)
    )
    await waitFor(() => expect(canvas.queryAllByText("50%")).toHaveLength(0))
    await userEvent.keyboard("{ArrowUp}{ArrowUp}")
    await expect(Number(handle.getAttribute("aria-valuenow"))).toBeLessThan(50)
  })
})
