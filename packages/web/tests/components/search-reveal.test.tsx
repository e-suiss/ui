import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import {
  SearchReveal,
  SearchRevealContent,
  SearchRevealField,
} from "@/components/interactions/search-reveal"

const notes = Array.from({ length: 20 }, (_, index) => `Note ${index + 1}`)

function Notes({
  count = 20,
  initialQuery = "",
  placeholder,
  onFocus,
  onQuery,
}: {
  count?: number
  initialQuery?: string
  placeholder?: string
  onFocus?: () => void
  onQuery?: (query: string) => void
}) {
  const [query, setQuery] = React.useState(initialQuery)
  return (
    <SearchReveal style={{ height: 300, width: 320 }}>
      <SearchRevealField
        value={query}
        onValueChange={(next) => {
          setQuery(next)
          onQuery?.(next)
        }}
        {...(placeholder ? { placeholder } : {})}
        {...(onFocus ? { onFocus } : {})}
      />
      <SearchRevealContent>
        <ul>
          {notes.slice(0, count).map((note) => (
            <li key={note} style={{ height: 40 }}>
              {note}
            </li>
          ))}
        </ul>
      </SearchRevealContent>
    </SearchReveal>
  )
}

function element(slot: string) {
  const node = document.querySelector<HTMLElement>(`[data-slot=${slot}]`)
  if (!node) throw new Error(`${slot} not rendered`)
  return node
}

const root = () => element("search-reveal")
const field = () => element("search-reveal-field")
const reveal = () => Number(root().style.getPropertyValue("--search-reveal"))
const opacity = () => Number(getComputedStyle(field()).opacity)
const top = () => Math.round(root().scrollTop)
const input = () => page.getByRole("searchbox", { name: "Search" })
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function scrollTo(value: number) {
  root().scrollTop = value
}

function touch(type: "touchstart" | "touchend" | "touchcancel") {
  const target = root()
  const point = new Touch({ identifier: 0, target, clientX: 10, clientY: 10 })
  target.dispatchEvent(
    new TouchEvent(type, {
      touches: type === "touchstart" ? [point] : [],
      changedTouches: [point],
      bubbles: true,
    })
  )
}

describe("SearchReveal", () => {
  it("starts with the field tucked above the list", async () => {
    await render(<Notes />)
    expect(field().offsetHeight).toBe(44)
    expect(top()).toBe(44)
    expect(reveal()).toBe(0)
    expect(opacity()).toBe(0)
  })

  it("tucks the field away even when the list is short", async () => {
    await render(<Notes count={2} />)
    expect(top()).toBe(44)
    expect(reveal()).toBe(0)
  })

  it("starts revealed when there is already a query", async () => {
    await render(<Notes initialQuery="Note 3" />)
    expect(top()).toBe(0)
    expect(reveal()).toBe(1)
    expect(opacity()).toBe(1)
  })

  it("fades the field with the scroll position", async () => {
    await render(<Notes />)
    scrollTo(33)
    await expect.poll(reveal).toBeCloseTo(0.25, 5)
    await expect.poll(opacity).toBeCloseTo(0.25, 2)
    scrollTo(0)
    await expect.poll(reveal).toBe(1)
    scrollTo(200)
    await expect.poll(reveal).toBe(0)
  })

  it("snaps open when stopped less than halfway hidden", async () => {
    await render(<Notes />)
    scrollTo(15)
    await expect.poll(top, { timeout: 2000 }).toBe(0)
    await expect.poll(reveal).toBe(1)
  })

  it("snaps closed when stopped more than halfway hidden", async () => {
    await render(<Notes />)
    scrollTo(30)
    await expect.poll(top, { timeout: 2000 }).toBe(44)
    await expect.poll(reveal).toBe(0)
  })

  it("does not snap once the field is fully scrolled away", async () => {
    await render(<Notes />)
    scrollTo(120)
    await wait(500)
    expect(top()).toBe(120)
  })

  it("snaps open whenever a query is present", async () => {
    await render(<Notes initialQuery="Note" />)
    scrollTo(35)
    await expect.poll(top, { timeout: 2000 }).toBe(0)
  })

  it("waits for the finger to lift before snapping", async () => {
    await render(<Notes />)
    touch("touchstart")
    scrollTo(30)
    await wait(400)
    expect(top()).toBe(30)
    touch("touchend")
    await expect.poll(top, { timeout: 2000 }).toBe(44)
  })

  it("snaps after a cancelled touch", async () => {
    await render(<Notes />)
    touch("touchstart")
    scrollTo(10)
    await wait(300)
    expect(top()).toBe(10)
    touch("touchcancel")
    await expect.poll(top, { timeout: 2000 }).toBe(0)
  })

  it("scrolls the field into view when it is focused", async () => {
    const onFocus = vi.fn()
    await render(<Notes onFocus={onFocus} />)
    expect(top()).toBe(44)
    ;(input().element() as HTMLInputElement).focus({ preventScroll: true })
    await expect.poll(top, { timeout: 2000 }).toBe(0)
    expect(onFocus).toHaveBeenCalledOnce()
  })

  it("reports typing and offers a clear button that refocuses the field", async () => {
    const onQuery = vi.fn()
    await render(<Notes onQuery={onQuery} />)
    expect(document.querySelector("[aria-label='Clear search']")).toBeNull()
    await input().fill("trip")
    expect(onQuery).toHaveBeenLastCalledWith("trip")
    await expect.element(input()).toHaveValue("trip")
    const clear = page.getByRole("button", { name: "Clear search" })
    await expect.element(clear).toBeVisible()
    await clear.click()
    expect(onQuery).toHaveBeenLastCalledWith("")
    await expect.element(input()).toHaveValue("")
    await expect.element(input()).toHaveFocus()
    expect(document.querySelector("[aria-label='Clear search']")).toBeNull()
  })

  it("uses the placeholder as the accessible name", async () => {
    await render(<Notes placeholder="Search notes" />)
    const custom = page.getByRole("searchbox", { name: "Search notes" })
    await expect.element(custom).toHaveAttribute("placeholder", "Search notes")
  })

  it("keeps working after typing with the keyboard", async () => {
    await render(<Notes />)
    await input().click()
    await userEvent.keyboard("abc")
    await expect.element(input()).toHaveValue("abc")
    await expect.poll(top, { timeout: 2000 }).toBe(0)
    scrollTo(40)
    await expect.poll(top, { timeout: 2000 }).toBe(0)
  })
})
