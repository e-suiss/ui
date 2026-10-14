import { describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import { Textarea } from "@/components/ui/textarea"

function element(slot: string) {
  const node = document.querySelector<HTMLElement>(`[data-slot=${slot}]`)
  if (!node) throw new Error(`${slot} not rendered`)
  return node
}

const field = () => element("textarea")
const handle = () => element("textarea-handle")

function pointer(type: string, x: number, y: number, button = 0) {
  handle().dispatchEvent(
    new PointerEvent(type, {
      pointerId: 1,
      pointerType: "mouse",
      button,
      buttons: type === "pointerup" ? 0 : 1,
      clientX: x,
      clientY: y,
      bubbles: true,
      cancelable: true,
    })
  )
}

async function dragBy(dy: number, release = true) {
  const rect = handle().getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2
  pointer("pointerdown", x, y)
  pointer("pointermove", x + 30, y + dy / 2)
  pointer("pointermove", x + 60, y + dy)
  if (release) pointer("pointerup", x + 60, y + dy)
  await new Promise(requestAnimationFrame)
}

function Field(props: React.ComponentProps<typeof Textarea>) {
  return (
    <div style={{ width: 320 }}>
      <Textarea aria-label="Notes" {...props} />
    </div>
  )
}

describe("Textarea", () => {
  it("has no handle unless resizable", async () => {
    await render(<Field />)
    await expect.element(page.getByRole("textbox")).toBeVisible()
    expect(document.querySelector("[data-slot=textarea-handle]")).toBeNull()
    expect(document.querySelector("[data-slot=textarea-container]")).toBeNull()
    expect(getComputedStyle(field()).resize).toBe("none")
  })

  it("grows with its content when not resizable", async () => {
    await render(<Field />)
    const before = field().offsetHeight
    await page.getByRole("textbox").fill("one\ntwo\nthree\nfour\nfive\nsix")
    await expect.poll(() => field().offsetHeight).toBeGreaterThan(before)
  })

  it("keeps a fixed height when resizable", async () => {
    await render(<Field resizable="inside" />)
    await expect.poll(() => field().offsetHeight).toBe(96)
    await page.getByRole("textbox").fill("one\ntwo\nthree\nfour\nfive\nsix")
    await new Promise(requestAnimationFrame)
    expect(field().offsetHeight).toBe(96)
  })

  it.each(["inside", "outside"] as const)(
    "grows and shrinks by dragging the %s handle",
    async (placement) => {
      await render(<Field resizable={placement} />)
      await expect.poll(() => field().offsetHeight).toBe(96)
      expect(handle().dataset.placement).toBe(placement)

      await dragBy(80, false)
      expect(handle().dataset.dragging).toBe("")
      expect(field().offsetHeight).toBe(176)
      expect(field().offsetWidth).toBe(320)
      pointer("pointerup", 0, 0)
      expect(handle().dataset.dragging).toBeUndefined()

      await dragBy(-40)
      expect(field().offsetHeight).toBe(136)
    }
  )

  it("stops following the pointer after release", async () => {
    await render(<Field resizable="inside" />)
    await dragBy(50)
    expect(field().offsetHeight).toBe(146)
    pointer("pointermove", 0, 900)
    await new Promise(requestAnimationFrame)
    expect(field().offsetHeight).toBe(146)
  })

  it("does not shrink below its minimum height", async () => {
    await render(<Field resizable="outside" />)
    await expect.poll(() => field().offsetHeight).toBe(96)
    await dragBy(-300)
    expect(field().offsetHeight).toBe(96)
  })

  it("ignores drags with a button other than the primary one", async () => {
    await render(<Field resizable="inside" />)
    const rect = handle().getBoundingClientRect()
    pointer("pointerdown", rect.left, rect.top, 2)
    pointer("pointermove", rect.left, rect.top + 100)
    await new Promise(requestAnimationFrame)
    expect(field().offsetHeight).toBe(96)
    expect(handle().dataset.dragging).toBeUndefined()
  })

  it("resets the height on double-click", async () => {
    await render(<Field resizable="inside" />)
    await dragBy(120)
    expect(field().offsetHeight).toBe(216)
    await userEvent.dblClick(handle())
    expect(field().style.height).toBe("")
    expect(field().offsetHeight).toBe(96)
  })

  it("places the inside handle within the field", async () => {
    await render(<Field resizable="inside" />)
    const box = field().getBoundingClientRect()
    const corner = handle().getBoundingClientRect()
    expect(corner.right).toBe(box.right - 4)
    expect(corner.bottom).toBe(box.bottom - 4)
  })

  it("places the outside handle over the corner", async () => {
    await render(<Field resizable="outside" />)
    const box = field().getBoundingClientRect()
    const corner = handle().getBoundingClientRect()
    expect(corner.right).toBe(box.right + 6)
    expect(corner.bottom).toBe(box.bottom + 6)
  })

  it("hides the handle when disabled", async () => {
    await render(<Field resizable="inside" disabled />)
    await expect.element(page.getByRole("textbox")).toBeDisabled()
    expect(getComputedStyle(handle()).display).toBe("none")
  })

  it("shows the handle again once enabled", async () => {
    const screen = await render(<Field resizable="outside" disabled />)
    expect(getComputedStyle(handle()).display).toBe("none")
    await screen.rerender(<Field resizable="outside" />)
    expect(getComputedStyle(handle()).display).not.toBe("none")
  })
})
