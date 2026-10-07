import { describe, expect, it, vi } from "vitest"
import { render } from "vitest-browser-react"

import { Widget, type WidgetSize } from "@/components/ui/widget"

function element(slot: string) {
  const node = document.querySelector<HTMLElement>(`[data-slot=${slot}]`)
  if (!node) throw new Error(`${slot} not rendered`)
  return node
}

const widget = () => element("widget")
const handle = () => element("widget-handle")
const preview = () =>
  document.querySelector<HTMLElement>("[data-slot=widget-preview]")

const box = (node: HTMLElement) => [node.offsetWidth, node.offsetHeight]

async function frames(count = 3) {
  for (let index = 0; index < count; index++) {
    await new Promise(requestAnimationFrame)
  }
}

function pointer(type: string, x: number, y: number) {
  handle().dispatchEvent(
    new PointerEvent(type, {
      pointerId: 1,
      pointerType: "mouse",
      button: 0,
      buttons: type === "pointerup" ? 0 : 1,
      clientX: x,
      clientY: y,
      bubbles: true,
      cancelable: true,
    })
  )
}

async function dragBy(dx: number, dy: number, release = true) {
  const rect = handle().getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2
  pointer("pointerdown", x, y)
  pointer("pointermove", x + dx / 2, y + dy / 2)
  pointer("pointermove", x + dx, y + dy)
  await frames()
  if (release) {
    pointer("pointerup", x + dx, y + dy)
    await frames()
  }
}

function doubleClickHandle() {
  handle().dispatchEvent(new MouseEvent("dblclick", { bubbles: true }))
}

describe("Widget", () => {
  it.each([
    ["small", 168, 168],
    ["medium", 352, 168],
    ["large", 352, 352],
    ["extra-large", 720, 352],
  ] as [WidgetSize, number, number][])(
    "renders the %s size at %ix%i",
    async (size, width, height) => {
      await render(<Widget size={size}>Content</Widget>)
      await expect.poll(() => box(widget())).toEqual([width, height])
      expect(widget().dataset.size).toBe(size)
    }
  )

  it("fills its parent at the auto size", async () => {
    await render(
      <div style={{ width: 240, height: 120 }}>
        <Widget>Content</Widget>
      </div>
    )
    await expect.poll(() => box(widget())).toEqual([240, 120])
    expect(widget().dataset.size).toBe("auto")
    expect(document.querySelector("[data-slot=widget-handle]")).toBeNull()
    expect(document.querySelector("[data-slot=widget-container]")).toBeNull()
  })

  it("starts small when resizable without a default size", async () => {
    await render(<Widget resizable>Content</Widget>)
    await expect.poll(() => box(widget())).toEqual([168, 168])
    expect(widget().dataset.size).toBe("small")
  })

  it("previews the nearest size while dragging and snaps to it on release", async () => {
    const onSizeChange = vi.fn()
    await render(
      <Widget resizable onSizeChange={onSizeChange}>
        Content
      </Widget>
    )
    await expect.poll(() => box(widget())).toEqual([168, 168])

    await dragBy(170, 10, false)
    expect(widget().dataset.resizing).toBe("snap")
    expect(handle().dataset.dragging).toBe("")
    const shown = preview()
    expect(shown).not.toBeNull()
    expect(shown?.style.width).toBe("352px")
    expect(shown?.style.height).toBe("168px")
    expect(box(widget())).toEqual([338, 178])
    expect(onSizeChange).not.toHaveBeenCalled()

    const rect = handle().getBoundingClientRect()
    pointer("pointerup", rect.left, rect.top)
    await frames()
    expect(preview()).toBeNull()
    expect(widget().dataset.resizing).toBeUndefined()
    expect(handle().dataset.dragging).toBeUndefined()
    expect(onSizeChange).toHaveBeenCalledExactlyOnceWith("medium")
    expect(widget().dataset.size).toBe("medium")
    await expect.poll(() => box(widget())).toEqual([352, 168])
  })

  it("updates the preview as the drag passes other sizes", async () => {
    await render(<Widget resizable>Content</Widget>)
    await expect.poll(() => box(widget())).toEqual([168, 168])
    const rect = handle().getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    pointer("pointerdown", x, y)
    pointer("pointermove", x + 184, y + 184)
    await frames()
    expect(preview()?.style.width).toBe("352px")
    expect(preview()?.style.height).toBe("352px")
    pointer("pointermove", x + 552, y + 184)
    await frames()
    expect(preview()?.style.width).toBe("720px")
    expect(preview()?.style.height).toBe("352px")
    pointer("pointerup", x + 552, y + 184)
    await frames()
    expect(widget().dataset.size).toBe("extra-large")
    await expect.poll(() => box(widget())).toEqual([720, 352])
  })

  it("only snaps to the sizes it is given", async () => {
    await render(
      <Widget resizable sizes={["small", "large"]}>
        Content
      </Widget>
    )
    await expect.poll(() => box(widget())).toEqual([168, 168])
    await dragBy(184, 32, false)
    expect(preview()?.style.width).toBe("352px")
    expect(preview()?.style.height).toBe("352px")
    const rect = handle().getBoundingClientRect()
    pointer("pointerup", rect.left, rect.top)
    await frames()
    expect(widget().dataset.size).toBe("large")
    await expect.poll(() => box(widget())).toEqual([352, 352])
  })

  it("caps the live size just past the largest allowed size while snapping", async () => {
    await render(
      <Widget resizable sizes={["small", "medium"]}>
        Content
      </Widget>
    )
    await expect.poll(() => box(widget())).toEqual([168, 168])
    await dragBy(900, 900, false)
    expect(box(widget())).toEqual([400, 216])
    await dragBy(0, 0)
  })

  it("never shrinks below the small size", async () => {
    await render(
      <Widget resizable defaultSize="medium">
        Content
      </Widget>
    )
    await expect.poll(() => box(widget())).toEqual([352, 168])
    await dragBy(-400, -400, false)
    expect(box(widget())).toEqual([168, 168])
    expect(preview()?.style.width).toBe("168px")
    const rect = handle().getBoundingClientRect()
    pointer("pointerup", rect.left, rect.top)
    await frames()
    expect(widget().dataset.size).toBe("small")
  })

  it("keeps its size when released nearest to the current size", async () => {
    const onSizeChange = vi.fn()
    await render(
      <Widget resizable defaultSize="large" onSizeChange={onSizeChange}>
        Content
      </Widget>
    )
    await expect.poll(() => box(widget())).toEqual([352, 352])
    await dragBy(20, -20)
    expect(onSizeChange).not.toHaveBeenCalled()
    expect(widget().dataset.size).toBe("large")
    await expect.poll(() => box(widget())).toEqual([352, 352])
  })

  it("reports the snapped size without changing when controlled", async () => {
    const onSizeChange = vi.fn()
    await render(
      <Widget resizable size="small" onSizeChange={onSizeChange}>
        Content
      </Widget>
    )
    await expect.poll(() => box(widget())).toEqual([168, 168])
    await dragBy(184, 184)
    expect(onSizeChange).toHaveBeenCalledExactlyOnceWith("large")
    expect(widget().dataset.size).toBe("small")
    await expect.poll(() => box(widget())).toEqual([168, 168])
  })

  it("resets to the default size on double-click", async () => {
    const onSizeChange = vi.fn()
    await render(
      <Widget resizable defaultSize="medium" onSizeChange={onSizeChange}>
        Content
      </Widget>
    )
    await expect.poll(() => box(widget())).toEqual([352, 168])
    await dragBy(0, 184)
    expect(widget().dataset.size).toBe("large")
    doubleClickHandle()
    await frames()
    expect(widget().dataset.size).toBe("medium")
    expect(onSizeChange).toHaveBeenLastCalledWith("medium")
    await expect.poll(() => box(widget())).toEqual([352, 168])
  })

  it("returns to auto on double-click when it started at auto", async () => {
    const onSizeChange = vi.fn()
    await render(
      <div style={{ width: 400, height: 240 }}>
        <Widget resizable defaultSize="auto" onSizeChange={onSizeChange}>
          Content
        </Widget>
      </div>
    )
    await expect.poll(() => box(widget())).toEqual([400, 240])
    await dragBy(-232, -72)
    expect(widget().dataset.size).toBe("small")
    expect(onSizeChange).toHaveBeenLastCalledWith("small")
    doubleClickHandle()
    await frames()
    expect(widget().dataset.size).toBe("auto")
    expect(onSizeChange).toHaveBeenLastCalledWith("auto")
    await expect.poll(() => box(widget())).toEqual([400, 240])
  })

  it("keeps the dragged size in free mode", async () => {
    const onSizeChange = vi.fn()
    await render(
      <Widget resizable="free" onSizeChange={onSizeChange}>
        Content
      </Widget>
    )
    await expect.poll(() => box(widget())).toEqual([168, 168])
    await dragBy(90, 50, false)
    expect(widget().dataset.resizing).toBe("free")
    expect(preview()).toBeNull()
    expect(box(widget())).toEqual([258, 218])
    const rect = handle().getBoundingClientRect()
    pointer("pointerup", rect.left, rect.top)
    await frames(6)
    expect(widget().dataset.resizing).toBeUndefined()
    expect(box(widget())).toEqual([258, 218])
    expect(onSizeChange).not.toHaveBeenCalled()
  })

  it("does not shrink below the small size in free mode", async () => {
    await render(
      <Widget resizable="free" defaultSize="large">
        Content
      </Widget>
    )
    await expect.poll(() => box(widget())).toEqual([352, 352])
    await dragBy(-500, -500)
    expect(box(widget())).toEqual([168, 168])
  })

  it("does not grow past the extra-large size in free mode", async () => {
    await render(
      <Widget resizable="free" defaultSize="large">
        Content
      </Widget>
    )
    await expect.poll(() => box(widget())).toEqual([352, 352])
    await dragBy(2000, 2000)
    expect(box(widget())).toEqual([720, 352])
  })

  it("does not grow past the largest of its sizes in free mode", async () => {
    await render(
      <Widget resizable="free" sizes={["small", "medium"]}>
        Content
      </Widget>
    )
    await expect.poll(() => box(widget())).toEqual([168, 168])
    await dragBy(500, 500)
    expect(box(widget())).toEqual([352, 168])
  })

  it("returns to the default size on double-click in free mode", async () => {
    await render(
      <Widget resizable="free" defaultSize="medium">
        Content
      </Widget>
    )
    await expect.poll(() => box(widget())).toEqual([352, 168])
    await dragBy(40, 70)
    expect(box(widget())).toEqual([392, 238])
    doubleClickHandle()
    await expect.poll(() => box(widget())).toEqual([352, 168])
  })

  it("ignores drags with a button other than the primary one", async () => {
    await render(<Widget resizable>Content</Widget>)
    await expect.poll(() => box(widget())).toEqual([168, 168])
    const rect = handle().getBoundingClientRect()
    handle().dispatchEvent(
      new PointerEvent("pointerdown", {
        pointerId: 1,
        button: 2,
        clientX: rect.left,
        clientY: rect.top,
        bubbles: true,
      })
    )
    pointer("pointermove", rect.left + 200, rect.top + 200)
    await frames()
    expect(widget().dataset.resizing).toBeUndefined()
    expect(preview()).toBeNull()
    expect(box(widget())).toEqual([168, 168])
  })

  it("places the handle inside the corner", async () => {
    await render(
      <Widget resizable handle="inside">
        Content
      </Widget>
    )
    await expect.poll(() => box(widget())).toEqual([168, 168])
    const outer = widget().getBoundingClientRect()
    const corner = handle().getBoundingClientRect()
    expect(handle().dataset.placement).toBe("inside")
    expect(corner.right).toBe(outer.right)
    expect(corner.bottom).toBe(outer.bottom)
    expect(corner.width).toBe(28)
  })

  it("places the handle outside the corner by default", async () => {
    await render(<Widget resizable>Content</Widget>)
    await expect.poll(() => box(widget())).toEqual([168, 168])
    const outer = widget().getBoundingClientRect()
    const corner = handle().getBoundingClientRect()
    expect(handle().dataset.placement).toBe("outside")
    expect(corner.right).toBe(outer.right + 6)
    expect(corner.bottom).toBe(outer.bottom + 6)
    expect(corner.width).toBe(34)
  })
})
