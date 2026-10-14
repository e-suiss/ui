import { afterEach, describe, expect, it, vi } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"

import { LogLive } from "@/components/blocks/log-live"

const TOGGLE = /^(Pause|Resume)$/
const CLOCK = /^\d{1,2}:\d{2} (AM|PM)$/

afterEach(() => {
  vi.useRealTimers()
  window.history.replaceState(null, "", window.location.pathname)
})

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const toggle = () => page.getByRole("button", { name: TOGGLE })
const status = () =>
  page.getByRole("heading", { name: "Live activity" }).element()
    .nextElementSibling?.textContent
const live = () => page.getByText("Live", { exact: true })

function stat(label: string) {
  const term = page.getByText(label, { exact: true }).element()
  return term.nextElementSibling?.textContent
}

function entries() {
  return Array.from(
    document.querySelectorAll<HTMLElement>("ul[aria-live] > li"),
    (item) => item.querySelector(".truncate.text-sm")?.textContent
  )
}

async function frames(count = 3) {
  for (let index = 0; index < count; index++) {
    await new Promise(requestAnimationFrame)
  }
}

describe("LogLive", () => {
  it("shows the first event right away", async () => {
    await render(<LogLive />)
    await expect.poll(entries).toEqual(["Jamie Rivera signed in"])
    expect(stat("This session")).toBe("1 event")
    expect(stat("Active users")).toBe("14")
    expect(stat("Avg. response")).toBe("182 ms")
    expect(status()).toBe("Events appear as they happen")
    await expect.element(live()).toBeVisible()
    await expect.element(toggle()).toHaveAccessibleName("Pause")
  })

  it("adds new events to the top as they happen", async () => {
    await render(<LogLive />)
    await expect.poll(entries).toHaveLength(1)
    await expect
      .poll(entries, { timeout: 4000 })
      .toEqual(["System finished a backup", "Jamie Rivera signed in"])
    expect(stat("This session")).toBe("2 events")
    const time = document.querySelector("ul[aria-live] > li .tabular-nums")
    expect(time?.textContent).toMatch(CLOCK)
  })

  it("pauses and resumes the feed where it left off", async () => {
    await render(<LogLive />)
    await expect.poll(entries).toHaveLength(1)
    await toggle().click()
    await expect.element(toggle()).toHaveAccessibleName("Resume")
    expect(status()).toBe("Paused")
    await expect.element(live()).not.toBeInTheDocument()

    await wait(2600)
    expect(entries()).toEqual(["Jamie Rivera signed in"])
    expect(stat("This session")).toBe("1 event")

    await toggle().click()
    await expect.element(toggle()).toHaveAccessibleName("Pause")
    expect(status()).toBe("Events appear as they happen")
    await expect.element(live()).toBeVisible()
    expect(entries()).toHaveLength(1)
    await expect
      .poll(entries, { timeout: 4000 })
      .toEqual(["System finished a backup", "Jamie Rivera signed in"])
    expect(stat("This session")).toBe("2 events")
  })

  it("keeps the seven newest events while counting all of them", async () => {
    vi.useFakeTimers({ toFake: ["setInterval", "clearInterval"] })
    await render(<LogLive />)
    await expect.poll(entries).toHaveLength(1)
    vi.advanceTimersByTime(2200 * 9)
    await frames()
    await expect.poll(() => stat("This session")).toBe("10 events")
    expect(entries()).toEqual([
      "Riley Chen answered a ticket",
      "Morgan Lee updated a product",
      "System finished a backup",
      "Jamie Rivera signed in",
      "Jordan Park approved an order",
      "System raised a warning",
      "Riley Chen answered a ticket",
    ])
  })

  it("flags warnings in the feed", async () => {
    vi.useFakeTimers({ toFake: ["setInterval", "clearInterval"] })
    await render(<LogLive />)
    await expect.poll(entries).toHaveLength(1)
    vi.advanceTimersByTime(2200 * 4)
    await expect.poll(entries).toHaveLength(5)
    const items = document.querySelectorAll("ul[aria-live] > li")
    expect(items[0]?.querySelector("[data-warning]")).not.toBeNull()
    expect(items[3]?.querySelector("[data-warning]")).toBeNull()
  })
})
