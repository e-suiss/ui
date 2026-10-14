import * as React from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerIndent,
  DrawerIndentBackground,
  DrawerProvider,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"

type DrawerProps = React.ComponentProps<typeof Drawer>
type ContentProps = React.ComponentProps<typeof DrawerContent>

afterEach(async () => {
  await page.viewport(1280, 800)
})

const trigger = () => page.getByRole("button", { name: "Open drawer" })
const dialog = () => page.getByRole("dialog", { name: "Move goal" })
const cancel = () => page.getByRole("button", { name: "Cancel" })
const outside = () => page.getByRole("button", { name: "Outside" })

function popup() {
  const node = document.querySelector<HTMLElement>("[data-slot=drawer-popup]")
  if (!node) throw new Error("drawer popup not rendered")
  return node
}

const overlay = () =>
  document.querySelector<HTMLElement>("[data-slot=drawer-overlay]")
const indent = () =>
  document.querySelector<HTMLElement>("[data-slot=drawer-indent]")
const handle = () =>
  document.querySelector<HTMLElement>("[data-slot=drawer-swipe-handle]")

const frame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

const wait = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms))

async function settled(element: () => HTMLElement) {
  let last = ""
  let still = 0
  while (still < 6) {
    await frame()
    const rect = element().getBoundingClientRect()
    const current = `${rect.left},${rect.top},${rect.width},${rect.height}`
    still = current === last ? still + 1 : 0
    last = current
  }
  return element().getBoundingClientRect()
}

function pointer(target: HTMLElement, type: string, x: number, y: number) {
  target.dispatchEvent(
    new PointerEvent(type, {
      pointerId: 1,
      pointerType: "mouse",
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

async function swipe(dx: number, dy: number) {
  const target = handle() ?? popup()
  const rect = target.getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + Math.min(rect.height / 2, 6)
  pointer(target, "pointerdown", x, y)
  const steps = 8
  for (let step = 1; step <= steps; step++) {
    await frame()
    pointer(
      target,
      "pointermove",
      x + (dx * step) / steps,
      y + (dy * step) / steps
    )
  }
  await frame()
  pointer(target, "pointerup", x + dx, y + dy)
}

function Example({
  content,
  ...props
}: DrawerProps & { content?: ContentProps }) {
  return (
    <div className="p-8">
      <button type="button">Outside</button>
      <Drawer {...props}>
        <DrawerTrigger>Open drawer</DrawerTrigger>
        <DrawerContent {...content}>
          <DrawerHeader>
            <DrawerTitle>Move goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4">350 calories per day</div>
          <DrawerFooter>
            <button type="button">Save goal</button>
            <DrawerClose>Cancel</DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}

function Controlled({
  onOpenChange,
}: {
  onOpenChange: DrawerProps["onOpenChange"]
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <span>{open ? "Drawer is open" : "Drawer is closed"}</span>
      <button type="button" onClick={() => setOpen(true)}>
        Open from outside
      </button>
      <Example
        open={open}
        onOpenChange={(next, details) => {
          setOpen(next)
          onOpenChange?.(next, details)
        }}
      />
    </>
  )
}

function Indented(props: DrawerProps) {
  return (
    <DrawerProvider>
      <DrawerIndentBackground />
      <DrawerIndent>
        <Example {...props} />
      </DrawerIndent>
    </DrawerProvider>
  )
}

async function open() {
  await trigger().click()
  await expect.element(dialog()).toBeVisible()
  return settled(popup)
}

describe("Drawer opening and closing", () => {
  it("opens from the trigger as a labelled dialog", async () => {
    await render(<Example />)
    await expect.element(dialog()).not.toBeInTheDocument()
    await expect.element(trigger()).toHaveAttribute("aria-expanded", "false")
    const button = trigger().element()
    const behind = outside().element()
    await open()
    expect(button.getAttribute("aria-expanded")).toBe("true")
    await expect
      .element(dialog())
      .toHaveAccessibleDescription("Set your daily activity goal.")
    expect(behind.closest("[aria-hidden=true], [inert]")).not.toBeNull()
  })

  it("closes with the close part and returns focus to the trigger", async () => {
    await render(<Example />)
    await open()
    await cancel().click()
    await expect.element(dialog()).not.toBeInTheDocument()
    await expect.element(trigger()).toHaveFocus()
  })

  it("closes with Escape and returns focus to the trigger", async () => {
    await render(<Example />)
    await open()
    await expect.poll(() => popup().contains(document.activeElement)).toBe(true)
    await userEvent.keyboard("{Escape}")
    await expect.element(dialog()).not.toBeInTheDocument()
    await expect.element(trigger()).toHaveFocus()
  })

  it("closes when the overlay is clicked", async () => {
    await render(<Example />)
    await open()
    const scrim = overlay()
    expect(scrim).not.toBeNull()
    await userEvent.click(document.body, { position: { x: 20, y: 20 } })
    await expect.element(dialog()).not.toBeInTheDocument()
  })

  it("keeps keyboard focus inside while open", async () => {
    await render(<Example />)
    await open()
    for (let step = 0; step < 6; step++) {
      await userEvent.tab()
      expect(popup().contains(document.activeElement)).toBe(true)
    }
  })

  it("starts open with defaultOpen", async () => {
    await render(<Example defaultOpen />)
    await expect.element(dialog()).toBeVisible()
    await cancel().click()
    await expect.element(dialog()).not.toBeInTheDocument()
  })

  it("follows a controlled open state and reports changes", async () => {
    const onOpenChange = vi.fn()
    await render(<Controlled onOpenChange={onOpenChange} />)
    await page.getByRole("button", { name: "Open from outside" }).click()
    await expect.element(dialog()).toBeVisible()
    await expect.element(page.getByText("Drawer is open")).toBeVisible()
    await settled(popup)
    await cancel().click()
    await expect.element(dialog()).not.toBeInTheDocument()
    await expect.element(page.getByText("Drawer is closed")).toBeVisible()
    expect(onOpenChange).toHaveBeenCalledTimes(1)
    expect(onOpenChange.mock.lastCall?.[0]).toBe(false)
    await trigger().click()
    await expect.element(dialog()).toBeVisible()
    expect(onOpenChange.mock.lastCall?.[0]).toBe(true)
  })

  it("does not close a controlled drawer that ignores the change", async () => {
    await render(<Example open />)
    await expect.element(dialog()).toBeVisible()
    await settled(popup)
    await cancel().click()
    await userEvent.keyboard("{Escape}")
    await wait(500)
    await expect.element(dialog()).toBeVisible()
  })
})

describe("Drawer placement", () => {
  it.each([
    ["down", "bottom"],
    ["up", "top"],
    ["left", "left"],
    ["right", "right"],
  ] as const)("slides in from the %s edge", async (direction, edge) => {
    await render(<Example swipeDirection={direction} />)
    const rect = await open()
    const { innerWidth, innerHeight } = window
    expect(popup().dataset.swipeDirection).toBe(direction)
    if (edge === "bottom") {
      expect(Math.round(rect.bottom)).toBe(innerHeight)
      expect(rect.width).toBe(innerWidth)
    }
    if (edge === "top") {
      expect(rect.top).toBe(0)
      expect(rect.width).toBe(innerWidth)
    }
    if (edge === "left") {
      expect(rect.left).toBe(0)
      expect(rect.height).toBe(innerHeight)
      expect(rect.width).toBe(384)
    }
    if (edge === "right") {
      expect(Math.round(rect.right)).toBe(innerWidth)
      expect(rect.height).toBe(innerHeight)
      expect(rect.width).toBe(384)
    }
  })

  it("takes three quarters of a phone screen when sliding from the side", async () => {
    await page.viewport(390, 844)
    await render(<Example swipeDirection="left" />)
    const rect = await open()
    expect(rect.width).toBe(390 * 0.75)
  })

  it("floats away from the edges with an inset", async () => {
    await render(<Example floating />)
    const rect = await open()
    expect(Math.round(window.innerHeight - rect.bottom)).toBe(8)
    expect(rect.left).toBe(8)
    expect(Math.round(window.innerWidth - rect.right)).toBe(8)
    expect(getComputedStyle(popup()).borderBottomLeftRadius).not.toBe("0px")
  })

  it("squares the corners that touch the screen edge", async () => {
    await render(<Example />)
    await open()
    const style = getComputedStyle(popup())
    expect(style.borderBottomLeftRadius).toBe("0px")
    expect(style.borderTopLeftRadius).not.toBe("0px")
  })

  it("starts off screen and slides into view", async () => {
    await render(<Example />)
    await trigger().click()
    await expect.element(dialog()).toBeInTheDocument()
    const start = popup().getBoundingClientRect().top
    const end = (await settled(popup)).top
    expect(start).toBeGreaterThan(end)
    expect(Math.round(end + popup().offsetHeight)).toBe(window.innerHeight)
  })
})

describe("Drawer options", () => {
  it("shows a swipe handle only when asked", async () => {
    await render(<Example />)
    await open()
    expect(handle()).toBeNull()
  })

  it("renders a hidden swipe handle above the content", async () => {
    await render(<Example showSwipeHandle />)
    await open()
    const grip = handle()
    expect(grip).not.toBeNull()
    expect(grip?.getAttribute("aria-hidden")).toBe("true")
    const title = page.getByText("Move goal").element().getBoundingClientRect()
    expect(grip?.getBoundingClientRect().bottom).toBeLessThanOrEqual(title.top)
  })

  it("adds an icon close button labelled Close", async () => {
    await render(<Example content={{ showCloseButton: true }} />)
    await open()
    const close = page.getByRole("button", { name: "Close", exact: true })
    await expect.element(close).toBeVisible()
    await close.click()
    await expect.element(dialog()).not.toBeInTheDocument()
    await expect.element(trigger()).toHaveFocus()
  })

  it("uses a text close button when a label is given", async () => {
    await render(
      <Example content={{ showCloseButton: true, closeLabel: "Done" }} />
    )
    await open()
    const done = page.getByRole("button", { name: "Done" })
    await expect.element(done).toHaveTextContent("Done")
    await expect
      .element(page.getByRole("button", { name: "Close", exact: true }))
      .not.toBeInTheDocument()
    await done.click()
    await expect.element(dialog()).not.toBeInTheDocument()
  })

  it("keeps the page usable when not modal", async () => {
    const onOutside = vi.fn()
    await render(
      <div>
        <button
          type="button"
          className="fixed top-4 left-4"
          onClick={onOutside}
        >
          Behind
        </button>
        <Example modal={false} />
      </div>
    )
    await open()
    expect(overlay()).toBeNull()
    await expect.element(outside()).toBeVisible()
    await page.getByRole("button", { name: "Behind" }).click()
    expect(onOutside).toHaveBeenCalledTimes(1)
  })

  it("dims the page behind a modal drawer", async () => {
    await render(<Example />)
    await open()
    const scrim = overlay()
    expect(scrim).not.toBeNull()
    await expect
      .poll(() => (scrim ? getComputedStyle(scrim).opacity : ""))
      .toBe("1")
    expect(scrim?.getBoundingClientRect().height).toBe(window.innerHeight)
  })
})

describe("Drawer swiping", () => {
  it("closes when swiped down", async () => {
    await render(<Example showSwipeHandle />)
    await open()
    await swipe(0, 400)
    await expect.element(dialog()).not.toBeInTheDocument()
  })

  it("springs back after a short swipe", async () => {
    await render(<Example showSwipeHandle />)
    const before = await open()
    await swipe(0, 12)
    await wait(300)
    await expect.element(dialog()).toBeVisible()
    const after = await settled(popup)
    expect(after.top).toBe(before.top)
  })

  it("ignores a swipe against the closing direction", async () => {
    await render(<Example showSwipeHandle />)
    await open()
    await swipe(0, -300)
    await wait(300)
    await expect.element(dialog()).toBeVisible()
  })

  it("closes a side drawer when swiped toward its edge", async () => {
    await render(<Example swipeDirection="right" showSwipeHandle />)
    await open()
    await swipe(400, 0)
    await expect.element(dialog()).not.toBeInTheDocument()
  })
})

describe("Drawer snap points", () => {
  it("opens at the first snap point and expands to the next", async () => {
    await render(<Example snapPoints={[0.5, 1]} showSwipeHandle />)
    const half = await open()
    expect(popup().dataset.snapPoints).toBe("")
    expect(Math.round(window.innerHeight - half.top)).toBe(
      Math.round(window.innerHeight * 0.5)
    )
    await swipe(0, -300)
    const full = await settled(popup)
    expect(full.top).toBeLessThan(half.top)
    expect(Math.round(full.top)).toBe(96)
  })

  it("reopens at the first snap point", async () => {
    const onSnapPointChange = vi.fn()
    await render(
      <Example
        snapPoints={[0.5, 1]}
        showSwipeHandle
        onSnapPointChange={onSnapPointChange}
      />
    )
    const half = await open()
    await swipe(0, -300)
    await expect.poll(() => onSnapPointChange.mock.lastCall?.[0]).toBe(1)
    await settled(popup)
    await cancel().click()
    await expect.element(dialog()).not.toBeInTheDocument()
    const reopened = await open()
    expect(reopened.top).toBe(half.top)
  })
})

describe("Drawer indent", () => {
  it("raises the page behind an open drawer", async () => {
    await render(<Indented />)
    expect(indent()?.hasAttribute("data-raised")).toBe(false)
    await open()
    await expect.poll(() => indent()?.hasAttribute("data-raised")).toBe(true)
    const raised = await settled(() => indent() ?? document.body)
    expect(raised.width).toBeLessThan(window.innerWidth)
    await cancel().click()
    await expect.poll(() => indent()?.hasAttribute("data-raised")).toBe(false)
  })

  it("does not raise the page for a floating drawer", async () => {
    await render(<Indented floating />)
    await open()
    await wait(100)
    expect(indent()?.hasAttribute("data-raised")).toBe(false)
  })

  it("does not raise the page for a side drawer", async () => {
    await render(<Indented swipeDirection="left" />)
    await open()
    await wait(100)
    expect(indent()?.hasAttribute("data-raised")).toBe(false)
  })

  it("raises the page only at the last snap point", async () => {
    await render(<Indented snapPoints={[0.5, 1]} showSwipeHandle />)
    await open()
    await wait(100)
    expect(indent()?.hasAttribute("data-raised")).toBe(false)
    await swipe(0, -300)
    await expect.poll(() => indent()?.hasAttribute("data-raised")).toBe(true)
  })
})
