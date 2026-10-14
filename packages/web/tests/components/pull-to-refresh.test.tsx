import { afterEach, describe, expect, it, vi } from "vitest"
import { cdp, page } from "vitest/browser"
import { render } from "vitest-browser-react"

import { PullToRefresh } from "@/components/interactions/pull-to-refresh"

const messages = Array.from({ length: 30 }, (_, index) => `Message ${index}`)

function Inbox({
  onRefresh,
  rows = 30,
}: {
  onRefresh: () => Promise<unknown> | unknown
  rows?: number
}) {
  return (
    <PullToRefresh onRefresh={onRefresh} style={{ height: 300, width: 320 }}>
      <ul>
        {messages.slice(0, rows).map((message) => (
          <li key={message} style={{ height: 40 }}>
            {message}
          </li>
        ))}
      </ul>
    </PullToRefresh>
  )
}

function element(slot: string) {
  const node = document.querySelector<HTMLElement>(`[data-slot=${slot}]`)
  if (!node) throw new Error(`${slot} not rendered`)
  return node
}

const root = () => element("pull-to-refresh")
const phase = () => root().dataset.phase
const pull = () =>
  Number.parseFloat(root().style.getPropertyValue("--pull") || "0")
const progress = () =>
  Number(root().style.getPropertyValue("--pull-progress") || "0")
const spokeOpacities = () =>
  Array.from(
    element("pull-to-refresh-indicator").querySelectorAll("rect"),
    (rect) => Number(getComputedStyle(rect).opacity)
  )
const contentOffset = () =>
  Math.round(
    element("pull-to-refresh-content").getBoundingClientRect().top -
      root().getBoundingClientRect().top
  )
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const resist = (distance: number) =>
  128 * (1 - Math.exp(-distance / (128 * 1.6)))

function touch(type: string, ys: number[]) {
  const target = root()
  const touches = ys.map(
    (y, index) =>
      new Touch({ identifier: index, target, clientX: 100, clientY: y })
  )
  const event = new TouchEvent(type, {
    touches: type === "touchend" || type === "touchcancel" ? [] : touches,
    changedTouches: touches,
    bubbles: true,
    cancelable: true,
  })
  target.dispatchEvent(event)
  return event
}

function pullBy(distance: number, release = true) {
  touch("touchstart", [100])
  touch("touchmove", [100 + distance / 2])
  const event = touch("touchmove", [100 + distance])
  if (release) touch("touchend", [100 + distance])
  return event
}

function wheel(deltaY: number, init: WheelEventInit = {}) {
  const event = new WheelEvent("wheel", {
    deltaY,
    bubbles: true,
    cancelable: true,
    ...init,
  })
  root().dispatchEvent(event)
  return event
}

function deferred() {
  let resolve: () => void = () => undefined
  const promise = new Promise<void>((done) => {
    resolve = done
  })
  return { promise, resolve }
}

const unhandled: unknown[] = []
const onUnhandled = (event: PromiseRejectionEvent) => {
  event.preventDefault()
  unhandled.push(event.reason)
}

afterEach(async () => {
  await cdp().send("Emulation.setEmulatedMedia", { features: [] })
  window.removeEventListener("unhandledrejection", onUnhandled)
  unhandled.length = 0
})

describe("PullToRefresh", () => {
  it("rests idle with the indicator collapsed", async () => {
    await render(<Inbox onRefresh={() => undefined} />)
    expect(phase()).toBe("idle")
    expect(root().getAttribute("aria-busy")).toBe("false")
    expect(element("pull-to-refresh-indicator").offsetHeight).toBe(0)
    expect(spokeOpacities()).toEqual([0, 0, 0, 0, 0, 0, 0, 0])
  })

  it("follows a touch pull with resistance and lights the spokes", async () => {
    await render(<Inbox onRefresh={() => undefined} />)
    const event = pullBy(40, false)
    expect(event.defaultPrevented).toBe(true)
    expect(phase()).toBe("pulling")
    expect(pull()).toBeCloseTo(resist(40), 3)
    expect(progress()).toBeCloseTo(resist(40) / 64, 3)
    await expect.poll(contentOffset).toBe(Math.round(resist(40)))
    const lit = spokeOpacities()
    expect(lit[0]).toBe(1)
    expect(lit[7]).toBe(0)
    touch("touchend", [])
  })

  it("never pulls further than the maximum", async () => {
    await render(<Inbox onRefresh={() => undefined} />)
    pullBy(2000, false)
    expect(pull()).toBeLessThanOrEqual(128)
    expect(pull()).toBeGreaterThan(120)
    expect(progress()).toBe(1)
    expect(spokeOpacities()).toEqual([1, 1, 1, 1, 1, 1, 1, 1])
    touch("touchend", [])
  })

  it("springs back without refreshing when released under the threshold", async () => {
    const onRefresh = vi.fn()
    await render(<Inbox onRefresh={onRefresh} />)
    pullBy(70)
    expect(resist(70)).toBeLessThan(64)
    expect(phase()).toBe("idle")
    expect(pull()).toBe(0)
    await wait(100)
    expect(onRefresh).not.toHaveBeenCalled()
  })

  it("refreshes past the threshold, holds the spinner, then settles back to idle", async () => {
    const pending = deferred()
    const onRefresh = vi.fn(() => pending.promise)
    await render(<Inbox onRefresh={onRefresh} />)
    pullBy(150)
    expect(onRefresh).toHaveBeenCalledOnce()
    expect(phase()).toBe("refreshing")
    expect(pull()).toBe(52)
    await expect
      .element(page.getByRole("status", { name: "Refreshing" }))
      .toBeInTheDocument()
    await expect.poll(() => root().getAttribute("aria-busy")).toBe("true")
    await expect.poll(contentOffset, { timeout: 2000 }).toBe(52)
    await wait(900)
    expect(phase()).toBe("refreshing")
    pending.resolve()
    await expect.poll(phase).toBe("settling")
    expect(pull()).toBe(0)
    expect(root().getAttribute("aria-busy")).toBe("false")
    await expect.poll(phase, { timeout: 2000 }).toBe("idle")
    await expect.poll(contentOffset, { timeout: 2000 }).toBe(0)
  })

  it("keeps the spinner for at least 600ms after a quick refresh", async () => {
    const onRefresh = vi.fn()
    await render(<Inbox onRefresh={onRefresh} />)
    const startedAt = performance.now()
    pullBy(150)
    expect(phase()).toBe("refreshing")
    await expect.poll(phase, { timeout: 2000 }).toBe("settling")
    expect(performance.now() - startedAt).toBeGreaterThanOrEqual(580)
    const settledAt = performance.now()
    await expect.poll(phase, { timeout: 2000 }).toBe("idle")
    expect(performance.now() - settledAt).toBeGreaterThanOrEqual(350)
  })

  it("ignores new pulls while refreshing", async () => {
    const pending = deferred()
    const onRefresh = vi.fn(() => pending.promise)
    await render(<Inbox onRefresh={onRefresh} />)
    pullBy(150)
    pullBy(150)
    wheel(-200)
    expect(onRefresh).toHaveBeenCalledOnce()
    expect(pull()).toBe(52)
    pending.resolve()
    await expect.poll(phase, { timeout: 2000 }).toBe("idle")
  })

  it("settles even when the refresh fails", async () => {
    window.addEventListener("unhandledrejection", onUnhandled)
    await render(
      <Inbox onRefresh={() => Promise.reject(new Error("offline"))} />
    )
    pullBy(150)
    await expect.poll(phase, { timeout: 2000 }).toBe("settling")
    await expect.poll(phase, { timeout: 2000 }).toBe("idle")
    expect(unhandled).toEqual([])
  })

  it("settles when the refresh throws synchronously", async () => {
    window.addEventListener("unhandledrejection", onUnhandled)
    await render(
      <Inbox
        onRefresh={() => {
          throw new Error("offline")
        }}
      />
    )
    pullBy(150)
    await expect.poll(phase, { timeout: 2000 }).toBe("idle")
    expect(unhandled).toEqual([])
  })

  it("does not pull when the list is scrolled down", async () => {
    const onRefresh = vi.fn()
    await render(<Inbox onRefresh={onRefresh} />)
    root().scrollTop = 200
    const event = pullBy(150)
    expect(event.defaultPrevented).toBe(false)
    expect(phase()).toBe("idle")
    expect(onRefresh).not.toHaveBeenCalled()
  })

  it("lets an upward swipe scroll instead of pulling", async () => {
    await render(<Inbox onRefresh={() => undefined} />)
    touch("touchstart", [200])
    const up = touch("touchmove", [180])
    const down = touch("touchmove", [300])
    expect(up.defaultPrevented).toBe(false)
    expect(down.defaultPrevented).toBe(false)
    expect(phase()).toBe("idle")
  })

  it("keeps pulling when the finger moves back up past the start", async () => {
    await render(<Inbox onRefresh={() => undefined} />)
    pullBy(60, false)
    touch("touchmove", [80])
    expect(phase()).toBe("pulling")
    expect(pull()).toBe(0)
    touch("touchend", [])
    expect(phase()).toBe("idle")
  })

  it("ignores multi-finger touches", async () => {
    await render(<Inbox onRefresh={() => undefined} />)
    touch("touchstart", [100, 120])
    touch("touchmove", [250, 270])
    expect(phase()).toBe("idle")
  })

  it("treats a cancelled touch like a release", async () => {
    const onRefresh = vi.fn()
    await render(<Inbox onRefresh={onRefresh} />)
    pullBy(150, false)
    touch("touchcancel", [])
    expect(onRefresh).toHaveBeenCalledOnce()
    expect(phase()).toBe("refreshing")
  })

  it("pulls with an upward wheel at the top and refreshes after the wheel stops", async () => {
    const onRefresh = vi.fn()
    await render(<Inbox onRefresh={onRefresh} />)
    const first = wheel(-60)
    expect(first.defaultPrevented).toBe(true)
    expect(phase()).toBe("pulling")
    wheel(-60)
    wheel(-60)
    expect(pull()).toBeCloseTo(resist(180), 3)
    await wait(100)
    expect(onRefresh).not.toHaveBeenCalled()
    await expect
      .poll(() => onRefresh.mock.calls.length, { timeout: 1000 })
      .toBe(1)
    expect(phase()).toBe("refreshing")
    await expect.poll(phase, { timeout: 3000 }).toBe("idle")
  })

  it("lets the wheel push the pull back down while pulling", async () => {
    const onRefresh = vi.fn()
    await render(<Inbox onRefresh={onRefresh} />)
    wheel(-120)
    wheel(80)
    expect(pull()).toBeCloseTo(resist(40), 3)
    await expect.poll(phase, { timeout: 1000 }).toBe("idle")
    expect(onRefresh).not.toHaveBeenCalled()
  })

  it("scales line based wheel deltas", async () => {
    await render(<Inbox onRefresh={() => undefined} />)
    wheel(-3, { deltaMode: 1 })
    expect(pull()).toBeCloseTo(resist(48), 3)
  })

  it("ignores pinch zoom, downward scrolling and wheels that started below the top", async () => {
    const onRefresh = vi.fn()
    await render(<Inbox onRefresh={onRefresh} />)
    expect(wheel(-100, { ctrlKey: true }).defaultPrevented).toBe(false)
    expect(wheel(100).defaultPrevented).toBe(false)
    expect(wheel(-100).defaultPrevented).toBe(false)
    expect(phase()).toBe("idle")
    await wait(300)
    root().scrollTop = 100
    wheel(-100)
    root().scrollTop = 0
    expect(wheel(-100).defaultPrevented).toBe(false)
    expect(phase()).toBe("idle")
    await wait(300)
    expect(onRefresh).not.toHaveBeenCalled()
  })

  it("moves the content without easing when motion is reduced", async () => {
    await cdp().send("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-reduced-motion", value: "reduce" }],
    })
    await render(<Inbox onRefresh={() => undefined} />)
    pullBy(150)
    await expect.poll(contentOffset, { timeout: 150, interval: 10 }).toBe(52)
    expect(element("pull-to-refresh-indicator").offsetHeight).toBe(52)
    await expect.poll(phase, { timeout: 2000 }).toBe("settling")
    await expect.poll(contentOffset, { timeout: 150, interval: 10 }).toBe(0)
  })

  it("uses the latest onRefresh callback", async () => {
    const first = vi.fn()
    const second = vi.fn()
    const { rerender } = await render(<Inbox onRefresh={first} />)
    await rerender(<Inbox onRefresh={second} />)
    pullBy(150)
    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledOnce()
  })
})
