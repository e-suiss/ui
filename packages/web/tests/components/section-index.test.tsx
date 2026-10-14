import { describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import {
  SectionIndex,
  SectionIndexBar,
  SectionIndexHeader,
  SectionIndexSection,
} from "@/components/interactions/section-index"

const ALL = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ", "#"]
const present = ALL.filter((letter) => letter !== "D" && letter !== "X")

function Contacts({
  height = 500,
  letters,
  onValueChange,
}: {
  height?: number
  letters?: string[]
  onValueChange?: (value: string) => void
}) {
  return (
    <SectionIndex style={{ height, width: 360 }}>
      <div data-testid="scroller" style={{ height: "100%", overflowY: "auto" }}>
        {(letters ?? present).map((letter) => (
          <SectionIndexSection key={letter} value={letter}>
            <SectionIndexHeader>{letter}</SectionIndexHeader>
            <ul>
              <li style={{ height: 40 }}>{letter} one</li>
              <li style={{ height: 40 }}>{letter} two</li>
            </ul>
          </SectionIndexSection>
        ))}
      </div>
      <SectionIndexBar
        {...(letters ? { letters } : {})}
        {...(onValueChange ? { onValueChange } : {})}
      />
    </SectionIndex>
  )
}

const slider = () => page.getByRole("slider", { name: "Section index" })
const bar = () => slider().element() as HTMLElement
const scroller = () => page.getByTestId("scroller").element() as HTMLElement
const bubble = () =>
  document.querySelector<HTMLElement>("[data-slot=section-index-bubble]")
const labels = () =>
  Array.from(
    bar().querySelectorAll("span:not([data-slot])"),
    (node) => node.textContent
  )

function sectionTopOffset(letter: string) {
  const section = document.querySelector<HTMLElement>(
    `[data-slot=section-index-section][data-value="${letter}"]`
  )
  if (!section) throw new Error(`section ${letter} missing`)
  return Math.round(
    section.getBoundingClientRect().top - scroller().getBoundingClientRect().top
  )
}

function yFor(index: number, count = ALL.length) {
  const rect = bar().getBoundingClientRect()
  return rect.top + ((index + 0.5) * rect.height) / count
}

function pointer(type: string, y: number, button = 0) {
  const rect = bar().getBoundingClientRect()
  bar().dispatchEvent(
    new PointerEvent(type, {
      pointerId: 1,
      pointerType: "mouse",
      button,
      buttons: type === "pointerup" ? 0 : 1,
      clientX: rect.left + rect.width / 2,
      clientY: y,
      bubbles: true,
      cancelable: true,
    })
  )
}

describe("SectionIndex", () => {
  it("exposes a vertical slider over every letter", async () => {
    await render(<Contacts />)
    await expect
      .element(slider())
      .toHaveAttribute("aria-orientation", "vertical")
    await expect.element(slider()).toHaveAttribute("aria-valuemin", "0")
    await expect.element(slider()).toHaveAttribute("aria-valuemax", "26")
    await expect.element(slider()).toHaveAttribute("aria-valuenow", "0")
    await expect.element(slider()).toHaveAttribute("aria-valuetext", "A")
    expect(labels()).toEqual(ALL)
  })

  it("jumps to the tapped letter's section", async () => {
    const onValueChange = vi.fn()
    await render(<Contacts onValueChange={onValueChange} />)
    pointer("pointerdown", yFor(12))
    pointer("pointerup", yFor(12))
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith("M")
    expect(sectionTopOffset("M")).toBe(0)
    expect(scroller().scrollTop).toBeGreaterThan(0)
    await expect.element(slider()).toHaveAttribute("aria-valuenow", "12")
    await expect.element(slider()).toHaveAttribute("aria-valuetext", "M")
  })

  it("lands on the next section when a letter has none", async () => {
    const onValueChange = vi.fn()
    await render(<Contacts onValueChange={onValueChange} />)
    pointer("pointerdown", yFor(3))
    pointer("pointerup", yFor(3))
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith("D")
    expect(sectionTopOffset("E")).toBe(0)
    await expect.element(slider()).toHaveAttribute("aria-valuetext", "D")
  })

  it("scrolls as far as possible for the last letters", async () => {
    await render(<Contacts />)
    pointer("pointerdown", yFor(26))
    pointer("pointerup", yFor(26))
    const max = scroller().scrollHeight - scroller().clientHeight
    expect(Math.round(scroller().scrollTop)).toBe(max)
  })

  it("shows a bubble and follows the finger while dragging", async () => {
    const onValueChange = vi.fn()
    await render(<Contacts onValueChange={onValueChange} />)
    pointer("pointerdown", yFor(1))
    await expect.poll(() => bubble()?.textContent).toBe("B")
    expect(bar().dataset.dragging).toBe("")
    pointer("pointermove", yFor(1) + 2)
    pointer("pointermove", yFor(4))
    await expect.poll(() => bubble()?.textContent).toBe("E")
    pointer("pointermove", yFor(7))
    await expect.poll(() => bubble()?.textContent).toBe("H")
    const barTop = bar().getBoundingClientRect().top
    expect(Number.parseFloat(bubble()?.style.top ?? "")).toBeCloseTo(
      yFor(7) - barTop,
      0
    )
    expect(sectionTopOffset("H")).toBe(0)
    expect(onValueChange.mock.calls).toEqual([["B"], ["E"], ["H"]])
    pointer("pointerup", yFor(7))
    await expect.poll(bubble).toBeNull()
    expect(bar().dataset.dragging).toBeUndefined()
  })

  it("clamps drags above and below the bar", async () => {
    const onValueChange = vi.fn()
    await render(<Contacts onValueChange={onValueChange} />)
    const rect = bar().getBoundingClientRect()
    pointer("pointerdown", yFor(5))
    await expect.poll(() => bubble()?.textContent).toBe("F")
    pointer("pointermove", rect.bottom + 200)
    await expect.poll(() => bubble()?.textContent).toBe("#")
    expect(bubble()?.style.top).toBe(`${rect.height}px`)
    pointer("pointermove", rect.top - 200)
    await expect.poll(() => bubble()?.textContent).toBe("A")
    expect(bubble()?.style.top).toBe("0px")
    pointer("pointercancel", rect.top)
    await expect.poll(bubble).toBeNull()
    expect(onValueChange.mock.calls).toEqual([["F"], ["#"], ["A"]])
  })

  it("ignores moves without a press and presses with other buttons", async () => {
    const onValueChange = vi.fn()
    await render(<Contacts onValueChange={onValueChange} />)
    pointer("pointermove", yFor(10))
    pointer("pointerdown", yFor(10), 2)
    expect(onValueChange).not.toHaveBeenCalled()
    expect(bubble()).toBeNull()
    expect(scroller().scrollTop).toBe(0)
  })

  it("moves with the keyboard", async () => {
    const onValueChange = vi.fn()
    await render(<Contacts onValueChange={onValueChange} />)
    bar().focus()
    await userEvent.keyboard("{ArrowDown}")
    await expect.element(slider()).toHaveAttribute("aria-valuetext", "B")
    await userEvent.keyboard("{ArrowRight}")
    await expect.element(slider()).toHaveAttribute("aria-valuetext", "C")
    await userEvent.keyboard("{ArrowUp}")
    await expect.element(slider()).toHaveAttribute("aria-valuetext", "B")
    await userEvent.keyboard("{ArrowLeft}")
    await expect.element(slider()).toHaveAttribute("aria-valuetext", "A")
    await userEvent.keyboard("{ArrowUp}")
    await expect.element(slider()).toHaveAttribute("aria-valuetext", "A")
    await userEvent.keyboard("{PageDown}")
    await expect.element(slider()).toHaveAttribute("aria-valuetext", "F")
    await userEvent.keyboard("{PageUp}")
    await expect.element(slider()).toHaveAttribute("aria-valuetext", "A")
    await userEvent.keyboard("{End}")
    await expect.element(slider()).toHaveAttribute("aria-valuetext", "#")
    await userEvent.keyboard("{ArrowDown}")
    await expect.element(slider()).toHaveAttribute("aria-valuetext", "#")
    await userEvent.keyboard("{Home}")
    await expect.element(slider()).toHaveAttribute("aria-valuetext", "A")
    await userEvent.keyboard("s")
    await expect.element(slider()).toHaveAttribute("aria-valuetext", "S")
    expect(sectionTopOffset("S")).toBe(0)
    expect(onValueChange.mock.lastCall).toEqual(["S"])
  })

  it("leaves unrelated keys alone", async () => {
    const onValueChange = vi.fn()
    let prevented: boolean | null = null
    const listener = (event: KeyboardEvent) => {
      prevented = event.defaultPrevented
    }
    document.addEventListener("keydown", listener)
    await render(<Contacts onValueChange={onValueChange} />)
    bar().focus()
    await userEvent.keyboard("1")
    expect(prevented).toBe(false)
    await userEvent.keyboard("{Enter}")
    expect(prevented).toBe(false)
    await userEvent.keyboard("{ArrowDown}")
    expect(prevented).toBe(true)
    document.removeEventListener("keydown", listener)
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith("B")
  })

  it("collapses letters into dots when the list is short but still reaches every letter", async () => {
    const onValueChange = vi.fn()
    await render(<Contacts height={256} onValueChange={onValueChange} />)
    await expect.poll(() => labels().length).toBe(15)
    const shown = labels()
    expect(shown[0]).toBe("A")
    expect(shown.at(-1)).toBe("#")
    expect(shown.filter((label) => label === "•")).toHaveLength(7)
    expect(
      shown
        .filter((_, index) => index % 2 === 1)
        .every((label) => label === "•")
    ).toBe(true)
    expect(bar().offsetHeight).toBe(240)
    pointer("pointerdown", yFor(3))
    pointer("pointerup", yFor(3))
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith("D")
  })

  it("restores every letter when the list grows", async () => {
    const { rerender } = await render(<Contacts height={256} />)
    await expect.poll(() => labels().length).toBe(15)
    await rerender(<Contacts height={500} />)
    await expect.poll(labels).toEqual(ALL)
  })

  it("uses custom letters", async () => {
    const onValueChange = vi.fn()
    const letters = ["Α", "Β", "Γ"]
    await render(<Contacts letters={letters} onValueChange={onValueChange} />)
    expect(labels()).toEqual(letters)
    await expect.element(slider()).toHaveAttribute("aria-valuemax", "2")
    pointer("pointerdown", yFor(2, 3))
    pointer("pointerup", yFor(2, 3))
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith("Γ")
  })

  it("scrolls the page when the sections are not in a scroll container", async () => {
    await render(
      <SectionIndex style={{ width: 360 }}>
        {present.map((letter) => (
          <SectionIndexSection
            key={letter}
            value={letter}
            style={{ height: 200 }}
          >
            <SectionIndexHeader>{letter}</SectionIndexHeader>
          </SectionIndexSection>
        ))}
        <SectionIndexBar />
      </SectionIndex>
    )
    const scrolling = document.scrollingElement as HTMLElement
    scrolling.scrollTop = 0
    bar().focus({ preventScroll: true })
    await userEvent.keyboard("k")
    const section = document.querySelector<HTMLElement>(
      '[data-slot=section-index-section][data-value="K"]'
    )
    expect(Math.round(section?.getBoundingClientRect().top ?? -1)).toBe(0)
    scrolling.scrollTop = 0
  })
})
