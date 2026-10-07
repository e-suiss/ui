import { afterEach, describe, expect, it, vi } from "vitest"
import { cdp, page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import {
  SwipeAction,
  SwipeActions,
  SwipeActionsActions,
  SwipeActionsContent,
  useSwipeActions,
} from "@/components/interactions/swipe-actions"

type Handlers = {
  onArchive?: () => void
  onDelete?: () => void
  onUnread?: () => void
  onOpen?: () => void
}

function Row({
  name = "Message",
  leading = true,
  trailing = true,
  onArchive,
  onDelete,
  onUnread,
  onOpen,
}: Handlers & { name?: string; leading?: boolean; trailing?: boolean }) {
  return (
    <SwipeActions data-testid={name}>
      {leading && (
        <SwipeActionsActions side="leading">
          <SwipeAction onClick={onUnread}>Unread</SwipeAction>
        </SwipeActionsActions>
      )}
      <SwipeActionsContent style={{ height: 60 }} onClick={onOpen}>
        {name} content
      </SwipeActionsContent>
      {trailing && (
        <SwipeActionsActions>
          <SwipeAction variant="archive" onClick={onArchive}>
            Archive
          </SwipeAction>
          <SwipeAction variant="destructive" fullSwipe onClick={onDelete}>
            Delete
          </SwipeAction>
        </SwipeActionsActions>
      )}
    </SwipeActions>
  )
}

function List({ dir, ...handlers }: Handlers & { dir?: "rtl" }) {
  return (
    <div style={{ width: 400 }} dir={dir}>
      <Row name="First" {...handlers} />
      <Row name="Second" />
      <button type="button">Outside</button>
    </div>
  )
}

function rootOf(name: string) {
  return page.getByTestId(name).element() as HTMLElement
}

function contentOf(name: string) {
  const node = rootOf(name).querySelector<HTMLElement>(
    "[data-slot=swipe-actions-content]"
  )
  if (!node) throw new Error("content not rendered")
  return node
}

function actionsOf(name: string, side: "leading" | "trailing") {
  return rootOf(name).querySelector<HTMLElement>(
    `[data-slot=swipe-actions-actions][data-side=${side}]`
  )
}

const offset = (name = "First") =>
  Number.parseFloat(
    rootOf(name).style.getPropertyValue("--swipe-actions-offset") || "0"
  )
const open = (name = "First") => rootOf(name).dataset.open
const actionsWidth = (side: "leading" | "trailing", name = "First") =>
  actionsOf(name, side)?.style.width
const translateX = (name = "First") =>
  Math.round(
    contentOf(name).getBoundingClientRect().left -
      rootOf(name).getBoundingClientRect().left
  )
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function pointer(
  target: EventTarget,
  type: string,
  x: number,
  y: number,
  button = 0
) {
  target.dispatchEvent(
    new PointerEvent(type, {
      pointerId: 1,
      pointerType: "touch",
      isPrimary: true,
      button,
      buttons: type === "pointerup" ? 0 : 1,
      clientX: x,
      clientY: y,
      bubbles: true,
      cancelable: true,
    })
  )
}

function drag(
  dx: number,
  dy = 0,
  { name = "First", release = true, steps = 4 } = {}
) {
  const target = contentOf(name)
  const rect = target.getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2
  pointer(target, "pointerdown", x, y)
  for (let step = 1; step <= steps; step++) {
    pointer(
      target,
      "pointermove",
      x + (dx * step) / steps,
      y + (dy * step) / steps
    )
  }
  if (release) pointer(target, "pointerup", x + dx, y + dy)
}

function reduceMotion(reduce: boolean) {
  return cdp().send("Emulation.setEmulatedMedia", {
    features: reduce
      ? [{ name: "prefers-reduced-motion", value: "reduce" }]
      : [],
  })
}

afterEach(async () => {
  await reduceMotion(false)
})

describe("SwipeActions", () => {
  it("starts closed with the actions collapsed", async () => {
    await render(<List />)
    expect(open()).toBeUndefined()
    expect(offset()).toBe(0)
    expect(actionsOf("First", "trailing")?.offsetWidth).toBe(0)
    expect(actionsOf("First", "leading")?.offsetWidth).toBe(0)
    await expect.element(page.getByRole("group").first()).toBeInTheDocument()
  })

  it("follows the finger and reveals trailing actions while dragging", async () => {
    await render(<List />)
    drag(-100, 0, { release: false })
    expect(offset()).toBe(-100)
    expect(actionsWidth("trailing")).toBe("100px")
    expect(actionsWidth("leading")).toBe("0px")
    expect(open()).toBe("trailing")
    expect(rootOf("First").hasAttribute("data-animating")).toBe(false)
    await expect.poll(() => translateX()).toBe(-100)
    pointer(window, "pointerup", 0, 0)
  })

  it("snaps open past half the actions width", async () => {
    await render(<List />)
    drag(-80)
    expect(offset()).toBe(-144)
    expect(actionsWidth("trailing")).toBe("144px")
    expect(open()).toBe("trailing")
    expect(rootOf("First").hasAttribute("data-animating")).toBe(true)
    await expect.poll(() => translateX(), { timeout: 2000 }).toBe(-144)
    await expect
      .poll(() => actionsOf("First", "trailing")?.offsetWidth)
      .toBe(144)
  })

  it("snaps back closed under half the actions width", async () => {
    await render(<List />)
    drag(-60)
    expect(offset()).toBe(0)
    expect(open()).toBeUndefined()
    await expect.poll(() => translateX(), { timeout: 2000 }).toBe(0)
  })

  it("opens leading actions with a drag the other way", async () => {
    await render(<List />)
    drag(50)
    expect(offset()).toBe(72)
    expect(open()).toBe("leading")
    expect(actionsWidth("leading")).toBe("72px")
    expect(actionsWidth("trailing")).toBe("0px")
    await expect
      .element(page.getByRole("button", { name: "Unread" }).first())
      .toBeVisible()
  })

  it("does not move toward a side without actions", async () => {
    await render(
      <div style={{ width: 400 }}>
        <Row name="First" leading={false} />
      </div>
    )
    drag(150)
    expect(offset()).toBe(0)
    expect(open()).toBeUndefined()
  })

  it("resists dragging past the actions without a full swipe action", async () => {
    await render(<List />)
    drag(200, 0, { release: false })
    expect(offset()).toBeGreaterThan(72)
    expect(offset()).toBeLessThan(72 + 40)
    pointer(window, "pointerup", 0, 0)
    expect(offset()).toBe(72)
  })

  it("closes again from the open position with a drag back", async () => {
    await render(<List />)
    drag(-100)
    expect(offset()).toBe(-144)
    drag(100)
    expect(offset()).toBe(0)
    expect(open()).toBeUndefined()
  })

  it("leaves vertical drags to the page", async () => {
    await render(<List />)
    drag(-30, 60)
    expect(offset()).toBe(0)
    drag(-100, 0)
    expect(offset()).toBe(-144)
  })

  it("ignores movement inside the axis lock and presses with other buttons", async () => {
    const onOpen = vi.fn()
    await render(<List onOpen={onOpen} />)
    drag(-6)
    expect(offset()).toBe(0)
    const target = contentOf("First")
    pointer(target, "pointerdown", 200, 30, 2)
    pointer(target, "pointermove", 50, 30, 2)
    pointer(target, "pointerup", 50, 30, 2)
    expect(offset()).toBe(0)
  })

  it("marks a full swipe past 60% of the row and runs the full swipe action", async () => {
    const onDelete = vi.fn()
    const onArchive = vi.fn()
    await render(<List onDelete={onDelete} onArchive={onArchive} />)
    const target = contentOf("First")
    pointer(target, "pointerdown", 390, 30)
    pointer(target, "pointermove", 380, 30)
    pointer(target, "pointermove", 160, 30)
    expect(offset()).toBe(-230)
    expect(rootOf("First").dataset.full).toBeUndefined()
    pointer(target, "pointermove", 130, 30)
    expect(rootOf("First").dataset.full).toBe("trailing")
    expect(offset()).toBe(-260)
    pointer(target, "pointerup", 130, 30)
    expect(offset()).toBe(-400)
    expect(rootOf("First").hasAttribute("data-removing")).toBe(true)
    expect(rootOf("First").style.height).toBe("60px")
    await expect.poll(() => rootOf("First").style.height).toBe("0px")
    expect(onDelete).not.toHaveBeenCalled()
    await expect
      .poll(() => onDelete.mock.calls.length, { timeout: 2000 })
      .toBe(1)
    expect(onArchive).not.toHaveBeenCalled()
    await expect
      .poll(() => rootOf("First").hasAttribute("data-removing"))
      .toBe(false)
    expect(rootOf("First").style.height).toBe("")
    expect(offset()).toBe(0)
    expect(open()).toBeUndefined()
    expect(rootOf("First").dataset.full).toBeUndefined()
  })

  it("cancels the full swipe when dragged back under the threshold", async () => {
    const onDelete = vi.fn()
    await render(<List onDelete={onDelete} />)
    const target = contentOf("First")
    pointer(target, "pointerdown", 380, 30)
    pointer(target, "pointermove", 370, 30)
    pointer(target, "pointermove", 100, 30)
    expect(rootOf("First").dataset.full).toBe("trailing")
    pointer(target, "pointermove", 250, 30)
    expect(rootOf("First").dataset.full).toBeUndefined()
    pointer(target, "pointerup", 250, 30)
    expect(offset()).toBe(-144)
    await wait(600)
    expect(onDelete).not.toHaveBeenCalled()
  })

  it("ignores new drags while a full swipe is removing the row", async () => {
    await render(<List />)
    drag(-300)
    expect(rootOf("First").hasAttribute("data-removing")).toBe(true)
    drag(100)
    expect(offset()).toBe(-400)
  })

  it("swallows the click that ends a drag", async () => {
    const onOpen = vi.fn()
    await render(<List onOpen={onOpen} />)
    drag(-100)
    contentOf("First").click()
    expect(onOpen).not.toHaveBeenCalled()
    expect(offset()).toBe(-144)
  })

  it("closes instead of opening when the content is tapped while open", async () => {
    const onOpen = vi.fn()
    await render(<List onOpen={onOpen} />)
    drag(-100)
    contentOf("First").dispatchEvent(
      new PointerEvent("pointerdown", { bubbles: true })
    )
    pointer(window, "pointerup", 0, 0)
    contentOf("First").click()
    expect(onOpen).not.toHaveBeenCalled()
    expect(offset()).toBe(0)
    contentOf("First").click()
    expect(onOpen).toHaveBeenCalledOnce()
  })

  it("runs an action and closes the row when it is tapped", async () => {
    const onArchive = vi.fn()
    await render(<List onArchive={onArchive} />)
    drag(-100)
    await expect.poll(() => translateX(), { timeout: 2000 }).toBe(-144)
    await page.getByRole("button", { name: "Archive" }).first().click()
    expect(onArchive).toHaveBeenCalledOnce()
    expect(offset()).toBe(0)
    expect(open()).toBeUndefined()
  })

  it("closes when another row opens", async () => {
    await render(<List />)
    drag(-100)
    expect(open("First")).toBe("trailing")
    drag(-100, 0, { name: "Second" })
    expect(open("Second")).toBe("trailing")
    expect(open("First")).toBeUndefined()
    expect(offset("First")).toBe(0)
  })

  it("closes on a press outside the row", async () => {
    await render(<List />)
    drag(-100)
    page
      .getByRole("button", { name: "Outside" })
      .element()
      .dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }))
    expect(offset()).toBe(0)
  })

  it("closes on Escape", async () => {
    await render(<List />)
    drag(-100)
    ;(
      page
        .getByRole("button", { name: "Archive" })
        .first()
        .element() as HTMLElement
    ).focus()
    await userEvent.keyboard("{Escape}")
    expect(offset()).toBe(0)
  })

  it("opens the side that receives keyboard focus and closes when focus leaves", async () => {
    const onUnread = vi.fn()
    await render(<List onUnread={onUnread} />)
    ;(
      page
        .getByRole("button", { name: "Unread" })
        .first()
        .element() as HTMLElement
    ).focus()
    expect(open()).toBe("leading")
    expect(offset()).toBe(72)
    await userEvent.keyboard("{Enter}")
    expect(onUnread).toHaveBeenCalledOnce()
    expect(offset()).toBe(0)
    ;(
      page
        .getByRole("button", { name: "Delete" })
        .first()
        .element() as HTMLElement
    ).focus()
    expect(open()).toBe("trailing")
    expect(offset()).toBe(-144)
    ;(
      page.getByRole("button", { name: "Outside" }).element() as HTMLElement
    ).focus()
    expect(offset()).toBe(0)
  })

  it("mirrors the drag direction in right-to-left layouts", async () => {
    await render(<List dir="rtl" />)
    drag(100)
    expect(open()).toBe("trailing")
    expect(
      rootOf("First").style.getPropertyValue("--swipe-actions-offset")
    ).toBe("144px")
    await expect.poll(() => translateX(), { timeout: 2000 }).toBe(144)
    drag(-100)
    expect(open()).toBeUndefined()
    drag(-50)
    expect(open()).toBe("leading")
    await expect.poll(() => translateX(), { timeout: 2000 }).toBe(-72)
  })

  it("closes from a custom part through the hook", async () => {
    function CloseButton() {
      const { close } = useSwipeActions()
      return (
        <button type="button" onClick={close}>
          Close row
        </button>
      )
    }
    await render(
      <div style={{ width: 400 }}>
        <SwipeActions data-testid="First">
          <SwipeActionsContent style={{ height: 60 }}>
            Content
          </SwipeActionsContent>
          <SwipeActionsActions>
            <SwipeAction>Flag</SwipeAction>
            <CloseButton />
          </SwipeActionsActions>
        </SwipeActions>
      </div>
    )
    drag(-100)
    expect(open()).toBe("trailing")
    ;(
      page.getByRole("button", { name: "Close row" }).element() as HTMLElement
    ).click()
    expect(offset()).toBe(0)
  })

  it("snaps without sliding when motion is reduced", async () => {
    await reduceMotion(true)
    await render(<List />)
    const duration = () =>
      Number.parseFloat(getComputedStyle(contentOf("First")).transitionDuration)
    drag(-100)
    expect(duration()).toBeLessThan(0.001)
    await expect
      .poll(() => translateX(), { timeout: 150, interval: 10 })
      .toBe(-144)
    drag(100)
    await expect
      .poll(() => translateX(), { timeout: 150, interval: 10 })
      .toBe(0)
  })

  it("throws when its parts are used outside the row", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined)
    await expect(render(<SwipeActionsContent />)).rejects.toThrow(
      "useSwipeActions must be used within a <SwipeActions />"
    )
    error.mockRestore()
  })
})

describe("SwipeAction", () => {
  it.each([
    ["default", "--accent"],
    ["destructive", "--danger"],
  ] as const)("paints the %s variant", async (variant, token) => {
    await render(
      <SwipeActions>
        <SwipeAction variant={variant}>Action</SwipeAction>
        <span data-testid="swatch" style={{ background: `var(${token})` }} />
      </SwipeActions>
    )
    const button = page.getByRole("button", { name: "Action" }).element()
    const swatch = page.getByTestId("swatch").element()
    expect(getComputedStyle(button).backgroundColor).toBe(
      getComputedStyle(swatch).backgroundColor
    )
  })

  it("gives archive and neutral their own colors", async () => {
    await render(
      <SwipeActions>
        <SwipeAction variant="archive">Archive</SwipeAction>
        <SwipeAction variant="neutral">Mute</SwipeAction>
        <SwipeAction>Flag</SwipeAction>
      </SwipeActions>
    )
    const colors = ["Archive", "Mute", "Flag"].map(
      (name) =>
        getComputedStyle(page.getByRole("button", { name }).element())
          .backgroundColor
    )
    expect(new Set(colors).size).toBe(3)
  })
})
