import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import {
  Island,
  IslandCompact,
  IslandExpanded,
  IslandProvider,
  IslandRing,
  useIsland,
} from "@/components/interactions/island"

function NotifyButtons() {
  const { notify, dismiss } = useIsland()
  return (
    <>
      <button
        type="button"
        onClick={() =>
          notify({
            icon: <span data-testid="notice-icon">i</span>,
            title: "Jordan Lee",
            description: "Are we still on?",
          })
        }
      >
        Message
      </button>
      <button
        type="button"
        onClick={() => notify({ title: "Quick", duration: 300 })}
      >
        Quick notice
      </button>
      <button type="button" onClick={dismiss}>
        Dismiss notice
      </button>
    </>
  )
}

function Activity({ onCancel }: { onCancel?: () => void }) {
  return (
    <>
      <IslandCompact aria-label="Downloading">
        <span>DL</span>
      </IslandCompact>
      <IslandExpanded aria-label="Download">
        <p>Design-Kit.zip</p>
        <button type="button" onClick={onCancel}>
          Cancel download
        </button>
      </IslandExpanded>
    </>
  )
}

function Harness({ activity = true }: { activity?: boolean }) {
  const [shown, setShown] = React.useState(activity)
  return (
    <IslandProvider>
      <Island>{shown && <Activity onCancel={() => setShown(false)} />}</Island>
      <div style={{ paddingTop: 200 }}>
        <NotifyButtons />
        <button type="button" onClick={() => setShown(true)}>
          Start
        </button>
        <button type="button" data-testid="outside">
          Outside
        </button>
      </div>
    </IslandProvider>
  )
}

function element(slot: string) {
  const node = document.querySelector<HTMLElement>(`[data-slot=${slot}]`)
  if (!node) throw new Error(`${slot} not rendered`)
  return node
}

const island = () => element("island")
const view = () => island().dataset.view
const size = () => [island().offsetWidth, island().offsetHeight]
const partSize = (slot: string) => [
  element(slot).offsetWidth,
  element(slot).offsetHeight,
]
const live = () =>
  document.querySelector("[aria-live=polite]")?.textContent ?? ""
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function pressOutside() {
  const target = page.getByTestId("outside").element()
  target.dispatchEvent(
    new PointerEvent("pointerdown", {
      pointerId: 1,
      bubbles: true,
      clientX: 10,
      clientY: 300,
    })
  )
}

describe("Island", () => {
  it("stays hidden at the resting pill size without an activity", async () => {
    await render(<Harness activity={false} />)
    expect(view()).toBe("hidden")
    await expect.poll(size, { timeout: 2000 }).toEqual([126, 36])
    expect(getComputedStyle(island()).visibility).toBe("hidden")
    expect(element("island-notice").getAttribute("aria-hidden")).toBe("true")
    expect(element("island-notice").tabIndex).toBe(-1)
  })

  it("shows the compact view sized to its content", async () => {
    await render(<Harness />)
    expect(view()).toBe("compact")
    const compact = page.getByRole("button", { name: "Downloading" })
    await expect.element(compact).toHaveAttribute("aria-expanded", "false")
    expect(element("island-compact").tabIndex).toBe(0)
    expect(element("island-expanded").inert).toBe(true)
    await expect
      .poll(size, { timeout: 2000 })
      .toEqual(partSize("island-compact"))
    expect(size()).toEqual([144, 36])
  })

  it("expands on press, focuses the first control and grows to the expanded size", async () => {
    await render(<Harness />)
    await page.getByRole("button", { name: "Downloading" }).click()
    expect(view()).toBe("expanded")
    expect(element("island-compact").getAttribute("aria-expanded")).toBe("true")
    expect(element("island-compact").tabIndex).toBe(-1)
    expect(element("island-expanded").inert).toBe(false)
    await expect
      .element(page.getByRole("button", { name: "Cancel download" }))
      .toHaveFocus()
    await expect
      .poll(size, { timeout: 2000 })
      .toEqual(partSize("island-expanded"))
    expect(size()[0]).toBe(384)
  })

  it("collapses on an outside press but not an inside one", async () => {
    await render(<Harness />)
    await page.getByRole("button", { name: "Downloading" }).click()
    element("island-expanded").dispatchEvent(
      new PointerEvent("pointerdown", { pointerId: 1, bubbles: true })
    )
    await wait(50)
    expect(view()).toBe("expanded")
    pressOutside()
    await expect.poll(view).toBe("compact")
    await expect.poll(size, { timeout: 2000 }).toEqual([144, 36])
  })

  it("collapses on Escape and returns focus to the compact pill", async () => {
    await render(<Harness />)
    await page.getByRole("button", { name: "Downloading" }).click()
    await expect
      .element(page.getByRole("button", { name: "Cancel download" }))
      .toHaveFocus()
    await userEvent.keyboard("{Escape}")
    await expect.poll(view).toBe("compact")
    await expect
      .element(page.getByRole("button", { name: "Downloading" }))
      .toHaveFocus()
  })

  it("collapses on Escape without stealing focus from outside", async () => {
    await render(<Harness />)
    await page.getByRole("button", { name: "Downloading" }).click()
    page.getByTestId("outside").element().focus()
    await userEvent.keyboard("{Escape}")
    await expect.poll(view).toBe("compact")
    await new Promise(requestAnimationFrame)
    await expect.element(page.getByTestId("outside")).toHaveFocus()
  })

  it("hides and resets when the activity ends", async () => {
    await render(<Harness />)
    await page.getByRole("button", { name: "Downloading" }).click()
    await page.getByRole("button", { name: "Cancel download" }).click()
    await expect.poll(view).toBe("hidden")
    await expect.poll(size, { timeout: 2000 }).toEqual([126, 36])
    await page.getByRole("button", { name: "Start" }).click()
    expect(view()).toBe("compact")
  })

  it("shows a notice over the activity and announces it", async () => {
    await render(<Harness />)
    await page.getByRole("button", { name: "Message" }).click()
    expect(view()).toBe("notice")
    const notice = element("island-notice")
    expect(notice.getAttribute("aria-hidden")).toBe("false")
    expect(notice.tabIndex).toBe(0)
    expect(notice.dataset.active).toBe("")
    expect(notice.textContent).toContain("Jordan Lee")
    expect(notice.textContent).toContain("Are we still on?")
    await expect.element(page.getByTestId("notice-icon")).toBeInTheDocument()
    expect(live()).toBe("Jordan Lee Are we still on?")
    await expect
      .poll(size, { timeout: 2000 })
      .toEqual(partSize("island-notice"))
    expect(size()[0]).toBe(384)
  })

  it("dismisses a notice after the default four seconds", async () => {
    await render(<Harness />)
    await page.getByRole("button", { name: "Message" }).click()
    await wait(3500)
    expect(view()).toBe("notice")
    await expect.poll(view, { timeout: 2000 }).toBe("compact")
    expect(live()).toBe("")
  }, 10000)

  it("honours a custom notice duration and returns to hidden", async () => {
    await render(<Harness activity={false} />)
    await page.getByRole("button", { name: "Quick notice" }).click()
    expect(view()).toBe("notice")
    const startedAt = performance.now()
    await expect.poll(view, { timeout: 2000 }).toBe("hidden")
    expect(performance.now() - startedAt).toBeLessThan(1500)
  })

  it("restarts the timer when a new notice replaces the current one", async () => {
    await render(<Harness activity={false} />)
    await page.getByRole("button", { name: "Quick notice" }).click()
    await page.getByRole("button", { name: "Message" }).click()
    await wait(600)
    expect(view()).toBe("notice")
    expect(element("island-notice").textContent).toContain("Jordan Lee")
  })

  it("dismisses a notice when it is pressed", async () => {
    await render(<Harness />)
    await page.getByRole("button", { name: "Message" }).click()
    element("island-notice").click()
    await expect.poll(view).toBe("compact")
  })

  it("dismisses a notice through the hook and cancels its timer", async () => {
    await render(<Harness activity={false} />)
    await page.getByRole("button", { name: "Message" }).click()
    await page.getByRole("button", { name: "Dismiss notice" }).click()
    expect(view()).toBe("hidden")
  })

  it("returns to the expanded view after a notice arrives while expanded", async () => {
    await render(<Harness />)
    await page.getByRole("button", { name: "Downloading" }).click()
    ;(
      page
        .getByRole("button", { name: "Quick notice" })
        .element() as HTMLElement
    ).click()
    await expect.poll(view).toBe("notice")
    expect(element("island-expanded").inert).toBe(true)
    await expect.poll(view, { timeout: 2000 }).toBe("expanded")
  })

  it("throws when used outside the provider", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined)
    await expect(render(<Island />)).rejects.toThrow(
      "useIsland must be used within an <Island />"
    )
    error.mockRestore()
  })
})

describe("IslandRing", () => {
  const offset = () => {
    const circles = document.querySelectorAll("[data-slot=island-ring] circle")
    return Number(circles[1]?.getAttribute("stroke-dashoffset"))
  }
  const circumference = 2 * Math.PI * 8

  it.each([
    [0, circumference],
    [0.25, circumference * 0.75],
    [1, 0],
    [-1, circumference],
    [2, 0],
  ])("draws %f as an offset of %f", async (value, expected) => {
    await render(<IslandRing value={value} />)
    expect(offset()).toBeCloseTo(expected, 5)
  })
})
