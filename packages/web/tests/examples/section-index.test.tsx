import { waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import SectionIndexCompact from "@/examples/section-index-compact"
import SectionIndexDemo from "@/examples/section-index-demo"
import { MOUSE_POINTER_ID } from "@/tests/pointer"
import { renderExample } from "@/tests/render-example"

function sectionTop(canvasElement: HTMLElement, letter: string) {
  const section = canvasElement.querySelector<HTMLElement>(
    `[data-slot=section-index-section][data-value="${letter}"]`
  )
  const viewport = section?.closest<HTMLElement>(
    "[data-slot=scroll-area-viewport]"
  )
  if (!section || !viewport) throw new Error(`section ${letter} not found`)
  return Math.round(
    section.getBoundingClientRect().top - viewport.getBoundingClientRect().top
  )
}
function tapLetter(bar: HTMLElement, fraction: number) {
  const rect = bar.getBoundingClientRect()
  const init = {
    pointerId: MOUSE_POINTER_ID,
    pointerType: "mouse",
    isPrimary: true,
    button: 0,
    clientX: rect.left + rect.width / 2,
    clientY: rect.top + rect.height * fraction,
    bubbles: true,
    cancelable: true,
  }
  bar.dispatchEvent(new PointerEvent("pointerdown", { ...init, buttons: 1 }))
  bar.dispatchEvent(new PointerEvent("pointerup", { ...init, buttons: 0 }))
}

test("Default", async () => {
  const { canvas, canvasElement, step } = await renderExample(
    <SectionIndexDemo />
  )

  const bar = canvas.getByRole("slider", { name: "Section index" })
  const status = canvas.getByRole("status")

  await step("jumps to a section when a letter is typed", async () => {
    bar.focus()
    await userEvent.keyboard("m")
    await expect(bar).toHaveAttribute("aria-valuetext", "M")
    await expect(status).toHaveTextContent("Jumped to M")
    await waitFor(() => expect(sectionTop(canvasElement, "M")).toBe(0))
  })

  await step("moves letter by letter with the arrow keys", async () => {
    await userEvent.keyboard("{ArrowDown}")
    await expect(bar).toHaveAttribute("aria-valuetext", "N")
    await waitFor(() => expect(sectionTop(canvasElement, "N")).toBe(0))
  })

  await step("Home and End reach the first and last sections", async () => {
    await userEvent.keyboard("{End}")
    await expect(status).toHaveTextContent("Jumped to #")
    await userEvent.keyboard("{Home}")
    await expect(status).toHaveTextContent("Jumped to A")
    await waitFor(() => expect(sectionTop(canvasElement, "A")).toBe(0))
  })

  await step("tapping a letter on the bar jumps there", async () => {
    tapLetter(bar, 4.5 / 27)
    await waitFor(() => expect(status).toHaveTextContent("Jumped to E"))
    await expect(bar).toHaveAttribute("aria-valuetext", "E")
    await waitFor(() => expect(sectionTop(canvasElement, "E")).toBe(0))
  })
})
test("Compact", async () => {
  const { canvas, canvasElement, step } = await renderExample(
    <SectionIndexCompact />
  )

  const bar = canvas.getByRole("slider", { name: "Section index" })
  const status = canvas.getByRole("status")

  await step("collapses the letters to fit the short list", async () => {
    await waitFor(() => expect(bar).toHaveTextContent("•"))
  })

  await step("still jumps to any letter from the bar", async () => {
    tapLetter(bar, 6.5 / 27)
    await waitFor(() => expect(status).toHaveTextContent("Jumped to G"))
    await waitFor(() => expect(sectionTop(canvasElement, "G")).toBe(0))
    bar.focus()
    await userEvent.keyboard("{PageDown}")
    await expect(bar).toHaveAttribute("aria-valuetext", "L")
  })
})
