import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import {
  PreviewMenu,
  PreviewMenuContent,
  PreviewMenuItem,
  PreviewMenuSeparator,
  PreviewMenuTrigger,
  usePreviewMenu,
} from "@/components/interactions/preview-menu"

type Actions = {
  onCopy?: () => void
  onDelete?: () => void
  onFavorite?: () => void
}

function Photo({
  open,
  defaultOpen,
  onOpenChange,
  aspectRatio,
  preview,
  size = { width: 120, height: 120 },
  disabledFavorite = false,
  onCopy,
  onDelete,
  onFavorite,
}: Actions & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  aspectRatio?: number
  preview?: React.ReactNode
  size?: { width: number; height: number }
  disabledFavorite?: boolean
}) {
  return (
    <div style={{ padding: 100 }}>
      <PreviewMenu
        {...(open !== undefined ? { open } : {})}
        {...(defaultOpen ? { defaultOpen } : {})}
        {...(onOpenChange ? { onOpenChange } : {})}
        {...(aspectRatio ? { aspectRatio } : {})}
      >
        <PreviewMenuTrigger
          data-testid="trigger"
          className="rounded-2xl"
          style={size}
        >
          <div
            role="img"
            aria-label="Sunset"
            style={{ width: "100%", height: "100%" }}
          >
            Sunset photo
          </div>
        </PreviewMenuTrigger>
        <PreviewMenuContent {...(preview !== undefined ? { preview } : {})}>
          <PreviewMenuItem onClick={onCopy}>Copy</PreviewMenuItem>
          <PreviewMenuItem disabled={disabledFavorite} onClick={onFavorite}>
            Favorite
          </PreviewMenuItem>
          <PreviewMenuSeparator />
          <PreviewMenuItem variant="destructive" onClick={onDelete}>
            Delete
          </PreviewMenuItem>
        </PreviewMenuContent>
      </PreviewMenu>
      <button type="button">Elsewhere</button>
    </div>
  )
}

const trigger = () => page.getByTestId("trigger")
const triggerElement = () => trigger().element() as HTMLElement
const menu = () => page.getByRole("menu")
const menuElement = () =>
  document.querySelector<HTMLElement>("[data-slot=preview-menu-content]")
const preview = () =>
  document.querySelector<HTMLElement>("[data-slot=preview-menu-preview]")
const backdrop = () =>
  document.querySelector<HTMLElement>("[data-slot=preview-menu-backdrop]")
const frame = () => {
  const node = preview()
  return node
    ? [
        node.style.top,
        node.style.left,
        node.style.width,
        node.style.height,
      ].map((value) => Math.round(Number.parseFloat(value)))
    : null
}
const expectedFrame = (width = 360, height = 360) => {
  const rect = triggerElement().getBoundingClientRect()
  const centered = rect.top + rect.height / 2 - height / 2
  const top = Math.min(Math.max(centered, 16), Math.max(16, 800 - 260 - height))
  return [
    Math.round(top),
    Math.round((1280 - width) / 2),
    Math.round(width),
    Math.round(height),
  ]
}
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function touch(type: string, dx = 0, dy = 0, fingers = 1) {
  const target = triggerElement()
  const rect = target.getBoundingClientRect()
  const touches = Array.from(
    { length: fingers },
    (_, index) =>
      new Touch({
        identifier: index,
        target,
        clientX: rect.left + 20 + dx + index * 30,
        clientY: rect.top + 20 + dy,
      })
  )
  target.dispatchEvent(
    new TouchEvent(type, {
      touches: type === "touchend" ? [] : touches,
      changedTouches: touches,
      bubbles: true,
      cancelable: true,
    })
  )
}

async function openWithRightClick() {
  await trigger().click({ button: "right" })
  await expect.element(menu()).toBeVisible()
}

describe("PreviewMenu", () => {
  it("opens on right click with a lifted preview and a menu below it", async () => {
    await render(<Photo />)
    expect(preview()).toBeNull()
    await openWithRightClick()
    expect(triggerElement().dataset.previewing).toBe("")
    expect(triggerElement().dataset.lifted).toBe("")
    expect(getComputedStyle(triggerElement()).visibility).toBe("hidden")
    expect(backdrop()).not.toBeNull()
    expect(frame()).toEqual(expectedFrame())
    expect(preview()?.getAttribute("aria-hidden")).toBe("true")
    expect(preview()?.textContent).toBe("Sunset photo")
    await expect
      .poll(
        () =>
          (menuElement()?.getBoundingClientRect().top ?? 0) -
          (expectedFrame()[0] ?? 0) -
          360,
        {
          timeout: 2000,
        }
      )
      .toBeGreaterThanOrEqual(11)
    await expect
      .element(page.getByRole("menuitem", { name: "Copy" }))
      .toBeVisible()
  })

  it("animates the preview from the trigger's place", async () => {
    await render(<Photo />)
    await openWithRightClick()
    const node = preview()
    if (!node) throw new Error("preview missing")
    const from = node.style.getPropertyValue("--preview-menu-from")
    const scale = 120 / 360
    const rect = triggerElement().getBoundingClientRect()
    const dx = rect.left + 60 - (460 + (360 * scale) / 2)
    const dy = rect.top + 60 - ((expectedFrame()[0] ?? 0) + (360 * scale) / 2)
    expect(from).toBe(`translate(${dx}px, ${dy}px) scale(${scale})`)
    expect(node.style.getPropertyValue("--preview-menu-clip")).toBe(
      `inset(0px 0px round ${Number.parseFloat(getComputedStyle(triggerElement()).borderTopLeftRadius) / scale}px)`
    )
    await expect
      .poll(() => getComputedStyle(node).transform, { timeout: 2000 })
      .toBe("none")
  })

  it("follows the given aspect ratio and keeps tall previews within the screen", async () => {
    const { rerender } = await render(<Photo aspectRatio={4 / 3} />)
    await openWithRightClick()
    expect(frame()).toEqual(expectedFrame(360, 270))
    await userEvent.keyboard("{Escape}")
    await expect.poll(menuElement, { timeout: 2000 }).toBeNull()
    await rerender(<Photo size={{ width: 100, height: 400 }} />)
    await openWithRightClick()
    expect(frame()).toEqual(expectedFrame(127, 508))
  })

  it("opens on a long press and not on a short one", async () => {
    const onOpenChange = vi.fn()
    await render(<Photo onOpenChange={onOpenChange} />)
    touch("touchstart")
    await wait(300)
    touch("touchend")
    await wait(400)
    expect(onOpenChange).not.toHaveBeenCalled()
    touch("touchstart")
    await expect.element(menu()).toBeVisible()
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true)
    expect(frame()).toEqual(expectedFrame())
  })

  it("cancels a long press when the finger moves or a second finger lands", async () => {
    const onOpenChange = vi.fn()
    await render(<Photo onOpenChange={onOpenChange} />)
    touch("touchstart")
    touch("touchmove", 4, 4)
    touch("touchmove", 30, 0)
    await wait(700)
    expect(onOpenChange).not.toHaveBeenCalled()
    touch("touchend")
    touch("touchstart", 0, 0, 2)
    await wait(700)
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it("runs an action and closes, putting the trigger back", async () => {
    const onCopy = vi.fn()
    const onOpenChange = vi.fn()
    await render(<Photo onCopy={onCopy} onOpenChange={onOpenChange} />)
    await openWithRightClick()
    await page.getByRole("menuitem", { name: "Copy" }).click()
    expect(onCopy).toHaveBeenCalledOnce()
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
    expect(triggerElement().dataset.previewing).toBeUndefined()
    expect(preview()?.dataset.closed).toBe("")
    await expect.poll(menuElement, { timeout: 2000 }).toBeNull()
    await expect
      .poll(() => triggerElement().dataset.lifted, { timeout: 2000 })
      .toBeUndefined()
    expect(getComputedStyle(triggerElement()).visibility).toBe("visible")
  })

  it("does not run disabled items", async () => {
    const onFavorite = vi.fn()
    await render(<Photo disabledFavorite onFavorite={onFavorite} />)
    await openWithRightClick()
    const favorite = page.getByRole("menuitem", { name: "Favorite" })
    await expect.element(favorite).toHaveAttribute("aria-disabled", "true")
    ;(favorite.element() as HTMLElement).click()
    expect(onFavorite).not.toHaveBeenCalled()
    await expect.element(menu()).toBeVisible()
  })

  it("supports keyboard navigation and Escape", async () => {
    const onDelete = vi.fn()
    await render(<Photo onDelete={onDelete} />)
    await openWithRightClick()
    await userEvent.keyboard("{ArrowDown}")
    await expect
      .element(page.getByRole("menuitem", { name: "Copy" }))
      .toHaveAttribute("data-highlighted")
    await userEvent.keyboard("{ArrowDown}{ArrowDown}")
    await expect
      .element(page.getByRole("menuitem", { name: "Delete" }))
      .toHaveAttribute("data-highlighted")
    await userEvent.keyboard("{Enter}")
    expect(onDelete).toHaveBeenCalledOnce()
    await expect.poll(menuElement, { timeout: 2000 }).toBeNull()
    await openWithRightClick()
    await userEvent.keyboard("{Escape}")
    await expect.poll(menuElement, { timeout: 2000 }).toBeNull()
  })

  it("closes when the backdrop is pressed", async () => {
    const onOpenChange = vi.fn()
    await render(<Photo onOpenChange={onOpenChange} />)
    await openWithRightClick()
    await page
      .elementLocator(backdrop() as HTMLElement)
      .click({ position: { x: 20, y: 20 } })
    await expect.poll(() => onOpenChange.mock.lastCall).toEqual([false])
    await expect.poll(menuElement, { timeout: 2000 }).toBeNull()
  })

  it("paints the destructive item in the danger color", async () => {
    await render(<Photo />)
    await openWithRightClick()
    const remove = page.getByRole("menuitem", { name: "Delete" }).element()
    const copy = page.getByRole("menuitem", { name: "Copy" }).element()
    expect(remove.getAttribute("data-variant")).toBe("destructive")
    expect(getComputedStyle(remove).color).not.toBe(
      getComputedStyle(copy).color
    )
    expect(
      document.querySelector("[data-slot=preview-menu-separator]")
    ).not.toBeNull()
  })

  it("shows a custom preview over a snapshot of the trigger", async () => {
    await render(
      <Photo preview={<div data-testid="custom">Trip to the coast</div>} />
    )
    await openWithRightClick()
    await expect.element(page.getByTestId("custom")).toBeInTheDocument()
    const snapshot = preview()?.querySelector<HTMLElement>("[inert] > *")
    expect(snapshot?.textContent).toBe("Sunset photo")
    expect(snapshot?.hasAttribute("data-slot")).toBe(false)
    expect(snapshot?.hasAttribute("data-lifted")).toBe(false)
    expect(snapshot?.style.width).toBe("100%")
    const holder = snapshot?.parentElement
    expect(holder?.style.width).toBe("120px")
    expect(holder?.style.transform).toBe(
      `translate(-50%, -50%) scale(${360 / 120})`
    )
  })

  it("opens from defaultOpen and from a controlled prop", async () => {
    function Controlled() {
      const [open, setOpen] = React.useState(false)
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Open preview
          </button>
          <Photo open={open} onOpenChange={setOpen} />
        </>
      )
    }
    const first = await render(<Photo defaultOpen />)
    await expect.element(menu()).toBeVisible()
    await expect.poll(frame).toEqual(expectedFrame())
    await first.unmount()
    await render(<Controlled />)
    expect(document.querySelector("[role=menu]")).toBeNull()
    await page.getByRole("button", { name: "Open preview" }).click()
    await expect.element(menu()).toBeVisible()
    await expect.poll(frame).toEqual(expectedFrame())
    await userEvent.keyboard("{Escape}")
    await expect.poll(menuElement, { timeout: 2000 }).toBeNull()
  })

  it("stays closed while the controlled prop says so", async () => {
    const onOpenChange = vi.fn()
    await render(<Photo open={false} onOpenChange={onOpenChange} />)
    await trigger().click({ button: "right" })
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true)
    await wait(100)
    expect(document.querySelector("[role=menu]")).toBeNull()
  })

  it("throws when its parts are used outside the menu", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined)
    function Orphan() {
      usePreviewMenu()
      return null
    }
    await expect(render(<Orphan />)).rejects.toThrow(
      "usePreviewMenu must be used within a <PreviewMenu />"
    )
    error.mockRestore()
  })
})
