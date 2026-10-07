import { afterEach, describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

type Layout = Record<string, number>

function Split({
  orientation = "horizontal",
  variant,
  collapsible = false,
  onLayoutChange,
}: {
  orientation?: "horizontal" | "vertical"
  variant?: "default" | "cards"
  collapsible?: boolean
  onLayoutChange?: (layout: Layout) => void
}) {
  const collapse = collapsible
    ? {
        collapsible: true,
        collapsedSize: "0%",
        collapsedThreshold: "1%",
        minSize: "25%",
      }
    : {}
  return (
    <div style={{ width: 600, height: 300 }}>
      <ResizablePanelGroup
        orientation={orientation}
        {...(variant ? { variant } : {})}
        {...(onLayoutChange ? { onLayoutChange } : {})}
      >
        <ResizablePanel id="first" defaultSize="50%" {...collapse}>
          First
        </ResizablePanel>
        <ResizableHandle aria-label="Resize" />
        <ResizablePanel id="second" defaultSize="50%" {...collapse}>
          Second
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}

function panel(id: string) {
  const node = document.getElementById(id)
  if (!node) throw new Error(`panel ${id} not rendered`)
  return node
}

function separator() {
  const node = document.querySelector<HTMLElement>(
    "[data-slot=resizable-handle]"
  )
  if (!node) throw new Error("handle not rendered")
  return node
}

const width = (id: string) => Math.round(panel(id).offsetWidth)
const share = () => Number(separator().getAttribute("aria-valuenow"))
const running = (id: string) => panel(id).getAnimations().length

async function focusSeparator() {
  await page.getByRole("separator").click()
  await expect.element(page.getByRole("separator")).toHaveFocus()
}

async function finishAnimations() {
  for (const id of ["first", "second"]) {
    for (const animation of panel(id).getAnimations()) animation.finish()
  }
  await new Promise(requestAnimationFrame)
}

const realMatchMedia = window.matchMedia.bind(window)

afterEach(() => {
  vi.restoreAllMocks()
})

describe("Resizable", () => {
  it("splits the space by the default sizes", async () => {
    await render(<Split />)
    await expect.poll(share).toBe(50)
    expect(Math.abs(width("first") - width("second"))).toBeLessThanOrEqual(1)
    await expect
      .element(page.getByRole("separator"))
      .toHaveAttribute("aria-valuenow", "50")
  })

  it("resizes panels with the arrow keys on the separator", async () => {
    const onLayoutChange = vi.fn()
    await render(<Split onLayoutChange={onLayoutChange} />)
    await expect.poll(share).toBe(50)
    await focusSeparator()
    await userEvent.keyboard("{ArrowRight}")
    await expect.poll(share).toBe(55)
    expect(onLayoutChange).toHaveBeenLastCalledWith({ first: 55, second: 45 })
    expect(width("first")).toBeGreaterThan(width("second"))
    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}")
    await expect.poll(share).toBe(45)
    expect(width("first")).toBeLessThan(width("second"))
  })

  it("resizes vertical groups with the up and down keys", async () => {
    await render(<Split orientation="vertical" />)
    await expect.poll(share).toBe(50)
    await focusSeparator()
    await userEvent.keyboard("{ArrowDown}")
    await expect.poll(share).toBe(55)
    expect(panel("first").offsetHeight).toBeGreaterThan(
      panel("second").offsetHeight
    )
    await userEvent.keyboard("{ArrowRight}{ArrowLeft}")
    await new Promise(requestAnimationFrame)
    expect(share()).toBe(55)
  })

  it("does not animate small steps", async () => {
    await render(<Split />)
    await expect.poll(share).toBe(50)
    await focusSeparator()
    await userEvent.keyboard("{ArrowRight}")
    await expect.poll(share).toBe(55)
    expect(running("first")).toBe(0)
    expect(running("second")).toBe(0)
  })

  it("animates jumps larger than eight percent", async () => {
    await render(<Split />)
    await expect.poll(share).toBe(50)
    await focusSeparator()
    await userEvent.keyboard("{End}")
    expect(running("first")).toBe(1)
    expect(running("second")).toBe(1)
    await finishAnimations()
    await expect.poll(share).toBe(100)
    await expect.poll(() => width("second")).toBe(0)
  })

  it("skips the jump animation when reduced motion is preferred", async () => {
    vi.spyOn(window, "matchMedia").mockImplementation((query) => {
      const result = realMatchMedia(query)
      if (!query.includes("prefers-reduced-motion")) return result
      return Object.create(result, { matches: { value: true } })
    })
    await render(<Split />)
    await expect.poll(share).toBe(50)
    await focusSeparator()
    await userEvent.keyboard("{End}")
    expect(running("first")).toBe(0)
    expect(running("second")).toBe(0)
    await expect.poll(share).toBe(100)
    await expect.poll(() => width("second")).toBe(0)
  })

  it("collapses the start panel and marks the handle", async () => {
    const onLayoutChange = vi.fn()
    await render(<Split collapsible onLayoutChange={onLayoutChange} />)
    await expect.poll(share).toBe(50)
    expect(separator().dataset.collapsed).toBeUndefined()
    await focusSeparator()
    await userEvent.keyboard("{Home}")
    await expect.poll(() => separator().dataset.collapsed).toBe("start")
    expect(onLayoutChange).toHaveBeenLastCalledWith({ first: 0, second: 100 })
    await finishAnimations()
    await expect.poll(() => width("first")).toBe(0)
  })

  it("collapses the end panel and marks the handle", async () => {
    await render(<Split collapsible />)
    await expect.poll(share).toBe(50)
    await focusSeparator()
    await userEvent.keyboard("{End}")
    await expect.poll(() => separator().dataset.collapsed).toBe("end")
    await finishAnimations()
    await expect.poll(() => width("second")).toBe(0)
  })

  it("collapses once a panel is pushed below its minimum size", async () => {
    await render(<Split collapsible />)
    await expect.poll(share).toBe(50)
    await focusSeparator()
    await userEvent.keyboard(
      "{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}{ArrowLeft}"
    )
    await expect.poll(share).toBe(25)
    expect(separator().dataset.collapsed).toBeUndefined()
    await userEvent.keyboard("{ArrowLeft}")
    await expect.poll(() => separator().dataset.collapsed).toBe("start")
    expect(share()).toBe(0)
  })

  it("clears the collapsed mark when the panel opens again", async () => {
    await render(<Split collapsible />)
    await expect.poll(share).toBe(50)
    await focusSeparator()
    await userEvent.keyboard("{Home}")
    await expect.poll(() => separator().dataset.collapsed).toBe("start")
    await userEvent.keyboard("{Enter}")
    await expect.poll(() => separator().dataset.collapsed).toBeUndefined()
    await finishAnimations()
    await expect.poll(share).toBe(50)
    expect(width("first")).toBeGreaterThan(0)
  })

  it("draws card panels with a wider transparent gutter", async () => {
    await render(<Split variant="cards" />)
    await expect
      .poll(() => Math.round(separator().getBoundingClientRect().width))
      .toBe(14)
    const group = document.querySelector<HTMLElement>(
      "[data-slot=resizable-panel-group]"
    )
    expect(group?.dataset.variant).toBe("cards")
    expect(getComputedStyle(separator()).backgroundColor).toBe(
      "rgba(0, 0, 0, 0)"
    )
    expect(getComputedStyle(panel("first")).borderTopLeftRadius).not.toBe("0px")
    expect(getComputedStyle(panel("first")).backgroundColor).not.toBe(
      "rgba(0, 0, 0, 0)"
    )
  })

  it("draws a hairline separator by default", async () => {
    await render(<Split />)
    await expect.poll(() => separator().getBoundingClientRect().width).toBe(1)
    expect(getComputedStyle(panel("first")).borderTopLeftRadius).toBe("0px")
  })

  it("hides the cards gutter once a panel collapses", async () => {
    await render(<Split variant="cards" collapsible />)
    await expect.poll(() => width("first")).toBeGreaterThan(0)
    await focusSeparator()
    await userEvent.keyboard("{Home}")
    await expect.poll(() => separator().dataset.collapsed).toBe("start")
    await expect.poll(() => separator().getBoundingClientRect().width).toBe(0)
  })
})
