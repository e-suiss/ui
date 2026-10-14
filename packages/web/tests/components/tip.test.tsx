import * as React from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { cdp, page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import {
  resetTips,
  Tip,
  TipAnchor,
  TipCard,
  TipClose,
  TipContent,
  TipDescription,
  TipGroup,
  TipPopover,
  TipTitle,
  useTip,
} from "@/components/interactions/tip"

function CardTip({
  id,
  title,
  delay,
  onDismiss,
}: {
  id: string
  title: string
  delay?: number
  onDismiss?: () => void
}) {
  return (
    <Tip
      id={id}
      {...(delay ? { delay } : {})}
      {...(onDismiss ? { onDismiss } : {})}
    >
      <TipCard>
        <TipContent>
          <TipTitle>{title}</TipTitle>
          <TipDescription>{title} description</TipDescription>
        </TipContent>
        <TipClose />
      </TipCard>
    </Tip>
  )
}

function PopoverTip({
  id = "compose",
  delay,
  onDismiss,
  onCompose,
}: {
  id?: string
  delay?: number
  onDismiss?: () => void
  onCompose?: () => void
}) {
  return (
    <Tip
      id={id}
      {...(delay ? { delay } : {})}
      {...(onDismiss ? { onDismiss } : {})}
    >
      <TipAnchor>
        <button type="button" onClick={onCompose}>
          New note
        </button>
      </TipAnchor>
      <TipPopover side="bottom" align="end">
        <TipContent>
          <TipTitle>Start a note fast</TipTitle>
          <TipDescription>Tap here any time.</TipDescription>
        </TipContent>
        <TipClose />
      </TipPopover>
    </Tip>
  )
}

const frames = () =>
  document.querySelectorAll<HTMLElement>("[data-slot=tip-card-frame]")
const popover = () =>
  document.querySelector<HTMLElement>("[data-slot=tip-popover]")
const note = (name: string) => page.getByRole("note").filter({ hasText: name })
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

beforeEach(() => {
  localStorage.clear()
})

afterEach(async () => {
  await cdp().send("Emulation.setEmulatedMedia", { features: [] })
})

describe("Tip card", () => {
  it("shows immediately with its title and description", async () => {
    await render(<CardTip id="pin" title="Pin your favorites" />)
    await expect.element(note("Pin your favorites")).toBeVisible()
    await expect
      .element(page.getByText("Pin your favorites description"))
      .toBeVisible()
    expect(frames()[0]?.dataset.closed).toBeUndefined()
  })

  it("waits for the delay before showing", async () => {
    await render(<CardTip id="pin" title="Pin" delay={400} />)
    await wait(250)
    expect(frames()).toHaveLength(0)
    await expect.poll(() => frames().length, { timeout: 2000 }).toBe(1)
  })

  it("dismisses, collapses, unmounts and remembers the dismissal", async () => {
    const onDismiss = vi.fn()
    await render(<CardTip id="pin" title="Pin" onDismiss={onDismiss} />)
    await expect.element(note("Pin")).toBeVisible()
    await page.getByRole("button", { name: "Dismiss tip" }).click()
    expect(onDismiss).toHaveBeenCalledOnce()
    expect(localStorage.getItem("tip:pin")).toBe("dismissed")
    expect(frames()[0]?.dataset.closed).toBe("")
    expect(frames()[0]?.inert).toBe(true)
    await expect.poll(() => frames().length, { timeout: 2000 }).toBe(0)
  })

  it("unmounts at once when motion is reduced", async () => {
    await cdp().send("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-reduced-motion", value: "reduce" }],
    })
    await render(<CardTip id="pin" title="Pin" />)
    await expect.element(note("Pin")).toBeVisible()
    await page.getByRole("button", { name: "Dismiss tip" }).click()
    await expect.poll(() => frames().length, { timeout: 200 }).toBe(0)
  })

  it("stays hidden after a dismissal on the next mount", async () => {
    localStorage.setItem("tip:pin", "dismissed")
    await render(<CardTip id="pin" title="Pin" />)
    await wait(100)
    expect(frames()).toHaveLength(0)
  })

  it("shows again after resetTips", async () => {
    localStorage.setItem("tip:pin", "dismissed")
    localStorage.setItem("tip:other", "dismissed")
    expect(resetTips(["pin"])).toBe(true)
    expect(localStorage.getItem("tip:other")).toBe("dismissed")
    await render(<CardTip id="pin" title="Pin" />)
    await expect.element(note("Pin")).toBeVisible()
  })

  it("throws when its parts are used outside a tip", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined)
    function Orphan() {
      useTip()
      return null
    }
    await expect(render(<Orphan />)).rejects.toThrow(
      "useTip must be used within a <Tip />"
    )
    error.mockRestore()
  })
})

describe("Tip popover", () => {
  it("opens after the delay, labelled by its title and description", async () => {
    await render(<PopoverTip delay={300} />)
    await wait(150)
    expect(popover()).toBeNull()
    const dialog = page.getByRole("dialog", { name: "Start a note fast" })
    await expect.element(dialog).toBeVisible()
    await expect
      .element(dialog)
      .toHaveAccessibleDescription("Tap here any time.")
  })

  it("sits below the anchor and does not take focus", async () => {
    await render(<PopoverTip />)
    await expect.element(page.getByRole("dialog")).toBeVisible()
    const anchor = page
      .getByRole("button", { name: "New note" })
      .element()
      .getBoundingClientRect()
    await expect
      .poll(() => (popover()?.getBoundingClientRect().top ?? 0) - anchor.bottom)
      .toBeGreaterThanOrEqual(8)
    expect(popover()?.contains(document.activeElement)).toBe(false)
  })

  it("dismisses from the close button", async () => {
    const onDismiss = vi.fn()
    await render(<PopoverTip onDismiss={onDismiss} />)
    await page.getByRole("button", { name: "Dismiss tip" }).click()
    expect(onDismiss).toHaveBeenCalledOnce()
    expect(localStorage.getItem("tip:compose")).toBe("dismissed")
    await expect.poll(popover, { timeout: 2000 }).toBeNull()
  })

  it("dismisses when the anchored control is used, still running its action", async () => {
    const onDismiss = vi.fn()
    const onCompose = vi.fn()
    await render(<PopoverTip onDismiss={onDismiss} onCompose={onCompose} />)
    await expect.element(page.getByRole("dialog")).toBeVisible()
    await page.getByRole("button", { name: "New note" }).click()
    expect(onCompose).toHaveBeenCalledOnce()
    expect(onDismiss).toHaveBeenCalledOnce()
    await expect.poll(popover, { timeout: 2000 }).toBeNull()
    await page.getByRole("button", { name: "New note" }).click()
    expect(onCompose).toHaveBeenCalledTimes(2)
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it("closes at once when motion is reduced", async () => {
    await cdp().send("Emulation.setEmulatedMedia", {
      features: [{ name: "prefers-reduced-motion", value: "reduce" }],
    })
    await render(<PopoverTip />)
    await expect.element(page.getByRole("dialog")).toBeVisible()
    expect(
      Number.parseFloat(
        getComputedStyle(popover() as HTMLElement).transitionDuration
      )
    ).toBeLessThan(0.001)
    await page.getByRole("button", { name: "Dismiss tip" }).click()
    await expect.poll(popover, { timeout: 200 }).toBeNull()
  })

  it("dismisses on Escape", async () => {
    const onDismiss = vi.fn()
    await render(<PopoverTip onDismiss={onDismiss} />)
    await expect.element(page.getByRole("dialog")).toBeVisible()
    await userEvent.keyboard("{Escape}")
    await expect.poll(() => onDismiss.mock.calls.length).toBe(1)
    await expect.poll(popover, { timeout: 2000 }).toBeNull()
    expect(localStorage.getItem("tip:compose")).toBe("dismissed")
  })

  it("dismisses on an outside press", async () => {
    const onDismiss = vi.fn()
    await render(
      <>
        <PopoverTip onDismiss={onDismiss} />
        <div style={{ height: 300 }} />
        <button type="button">Elsewhere</button>
      </>
    )
    await expect.element(page.getByRole("dialog")).toBeVisible()
    await page.getByRole("button", { name: "Elsewhere" }).click()
    await expect.poll(() => onDismiss.mock.calls.length).toBe(1)
    await expect.poll(popover, { timeout: 2000 }).toBeNull()
  })
})

describe("TipGroup", () => {
  function Sequence() {
    return (
      <TipGroup>
        <CardTip id="first" title="First tip" />
        <CardTip id="second" title="Second tip" />
        <CardTip id="third" title="Third tip" />
      </TipGroup>
    )
  }

  it("shows one tip at a time in order", async () => {
    await render(<Sequence />)
    await expect.element(note("First tip")).toBeVisible()
    expect(frames()).toHaveLength(1)
    await note("First tip").getByRole("button", { name: "Dismiss tip" }).click()
    await expect.element(note("Second tip")).toBeVisible()
    await expect.poll(() => frames().length, { timeout: 2000 }).toBe(1)
    await note("Second tip")
      .getByRole("button", { name: "Dismiss tip" })
      .click()
    await expect.element(note("Third tip")).toBeVisible()
    await note("Third tip").getByRole("button", { name: "Dismiss tip" }).click()
    await expect.poll(() => frames().length, { timeout: 2000 }).toBe(0)
    expect(
      ["first", "second", "third"].map((id) =>
        localStorage.getItem(`tip:${id}`)
      )
    ).toEqual(["dismissed", "dismissed", "dismissed"])
  })

  it("skips tips that were already dismissed", async () => {
    localStorage.setItem("tip:first", "dismissed")
    await render(<Sequence />)
    await expect.element(note("Second tip")).toBeVisible()
    expect(frames()).toHaveLength(1)
  })

  it("restarts the delay when a delayed tip gets its turn", async () => {
    await render(
      <TipGroup>
        <CardTip id="first" title="First tip" />
        <CardTip id="second" title="Second tip" delay={400} />
      </TipGroup>
    )
    await expect.element(note("First tip")).toBeVisible()
    await wait(600)
    await page.getByRole("button", { name: "Dismiss tip" }).click()
    await wait(250)
    expect(document.body.textContent).not.toContain("Second tip")
    await expect.element(note("Second tip")).toBeVisible()
  })

  it("moves on when the current tip unmounts", async () => {
    function Removable() {
      const [shown, setShown] = React.useState(true)
      return (
        <TipGroup>
          <button type="button" onClick={() => setShown(false)}>
            Remove first
          </button>
          {shown && <CardTip id="first" title="First tip" />}
          <CardTip id="second" title="Second tip" />
        </TipGroup>
      )
    }
    await render(<Removable />)
    await expect.element(note("First tip")).toBeVisible()
    await page.getByRole("button", { name: "Remove first" }).click()
    await expect.element(note("Second tip")).toBeVisible()
    expect(localStorage.getItem("tip:first")).toBeNull()
  })
})
