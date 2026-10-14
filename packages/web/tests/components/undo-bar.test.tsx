import { afterEach, describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import { UndoBarProvider, useUndoBar } from "@/components/interactions/undo-bar"

type Handlers = {
  onUndo: (name: string) => void
  onCommit: (name: string) => void
}

function Trigger({
  name,
  actionLabel,
  onUndo,
  onCommit,
}: Handlers & { name: string; actionLabel?: string }) {
  const { show } = useUndoBar()
  return (
    <button
      type="button"
      onClick={() =>
        show({
          title: `${name} deleted`,
          ...(actionLabel ? { actionLabel } : {}),
          onUndo: () => onUndo(name),
          onCommit: () => onCommit(name),
        })
      }
    >
      Delete {name}
    </button>
  )
}

function Controls() {
  const { undo, dismiss } = useUndoBar()
  return (
    <>
      <button type="button" onClick={undo}>
        Undo from code
      </button>
      <button type="button" onClick={dismiss}>
        Dismiss from code
      </button>
    </>
  )
}

function Harness({
  timeout,
  actionLabel,
  ...handlers
}: Handlers & { timeout?: number; actionLabel?: string }) {
  return (
    <UndoBarProvider {...(timeout ? { timeout } : {})}>
      <Trigger
        name="Groceries"
        {...handlers}
        {...(actionLabel ? { actionLabel } : {})}
      />
      <Trigger name="Trip" {...handlers} />
      <Controls />
      <input aria-label="Notes" />
    </UndoBarProvider>
  )
}

function setup(props: { timeout?: number; actionLabel?: string } = {}) {
  const onUndo = vi.fn()
  const onCommit = vi.fn()
  return {
    onUndo,
    onCommit,
    harness: <Harness {...props} onUndo={onUndo} onCommit={onCommit} />,
  }
}

const bar = () => document.querySelector<HTMLElement>("[data-slot=undo-bar]")
const isOpen = () => {
  const node = bar()
  return node !== null && node.dataset.closed === undefined
}
const title = () =>
  document.querySelector("[data-slot=undo-bar-title]")?.textContent ?? null
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function hover(type: "pointerenter" | "pointerleave", pointerType = "mouse") {
  const node = bar()
  if (!node) throw new Error("undo bar not rendered")
  node.dispatchEvent(
    new PointerEvent(type === "pointerenter" ? "pointerover" : "pointerout", {
      pointerId: 1,
      pointerType,
      bubbles: true,
      relatedTarget: document.body,
    })
  )
}

function setHidden(hidden: boolean) {
  Object.defineProperty(document, "hidden", {
    configurable: true,
    get: () => hidden,
  })
  document.dispatchEvent(new Event("visibilitychange"))
}

afterEach(() => {
  Reflect.deleteProperty(document, "hidden")
})

describe("UndoBar", () => {
  it("renders nothing until shown", async () => {
    const { harness } = setup()
    await render(harness)
    expect(bar()).toBeNull()
    expect(
      document
        .querySelector("[data-slot=undo-bar-region]")
        ?.getAttribute("aria-live")
    ).toBe("polite")
  })

  it("shows the title with the default action label", async () => {
    const { harness } = setup()
    await render(harness)
    await page.getByRole("button", { name: "Delete Groceries" }).click()
    await expect
      .element(page.getByRole("group", { name: "Groceries deleted" }))
      .toBeVisible()
    await expect
      .element(page.getByRole("button", { name: "Undo", exact: true }))
      .toBeVisible()
    expect(isOpen()).toBe(true)
  })

  it("uses a custom action label", async () => {
    const { harness } = setup({ actionLabel: "Restore" })
    await render(harness)
    await page.getByRole("button", { name: "Delete Groceries" }).click()
    await expect
      .element(page.getByRole("button", { name: "Restore" }))
      .toBeVisible()
  })

  it("calls onUndo and closes when the action is pressed", async () => {
    const { harness, onUndo, onCommit } = setup({ timeout: 1500 })
    await render(harness)
    await page.getByRole("button", { name: "Delete Groceries" }).click()
    await page.getByRole("button", { name: "Undo", exact: true }).click()
    expect(onUndo).toHaveBeenCalledExactlyOnceWith("Groceries")
    await expect.poll(isOpen).toBe(false)
    await wait(1700)
    expect(onCommit).not.toHaveBeenCalled()
    expect(onUndo).toHaveBeenCalledTimes(1)
  })

  it("commits after the timeout", async () => {
    const { harness, onUndo, onCommit } = setup({ timeout: 300 })
    await render(harness)
    const shownAt = performance.now()
    await page.getByRole("button", { name: "Delete Groceries" }).click()
    expect(isOpen()).toBe(true)
    await expect
      .poll(() => onCommit.mock.calls.length, { timeout: 2000 })
      .toBe(1)
    expect(performance.now() - shownAt).toBeGreaterThanOrEqual(280)
    expect(onCommit).toHaveBeenCalledWith("Groceries")
    expect(onUndo).not.toHaveBeenCalled()
    await expect.poll(isOpen).toBe(false)
    await expect
      .poll(() => bar() && getComputedStyle(bar() as HTMLElement).visibility)
      .toBe("hidden")
  })

  it("waits for the default timeout of five seconds", async () => {
    const { harness, onCommit } = setup()
    await render(harness)
    await page.getByRole("button", { name: "Delete Groceries" }).click()
    await wait(4000)
    expect(onCommit).not.toHaveBeenCalled()
    expect(isOpen()).toBe(true)
    await expect
      .poll(() => onCommit.mock.calls.length, { timeout: 3000 })
      .toBe(1)
  }, 15000)

  it("commits the previous entry when a new one is shown", async () => {
    const { harness, onUndo, onCommit } = setup({ timeout: 1500 })
    await render(harness)
    await page.getByRole("button", { name: "Delete Groceries" }).click()
    await page.getByRole("button", { name: "Delete Trip" }).click()
    expect(onCommit).toHaveBeenCalledExactlyOnceWith("Groceries")
    await expect.poll(title).toBe("Trip deleted")
    expect(document.querySelectorAll("[data-slot=undo-bar]")).toHaveLength(1)
    await page.getByRole("button", { name: "Undo", exact: true }).click()
    expect(onUndo).toHaveBeenCalledExactlyOnceWith("Trip")
    expect(onCommit).toHaveBeenCalledTimes(1)
  })

  it("restarts the countdown for the newer entry", async () => {
    const { harness, onCommit } = setup({ timeout: 600 })
    await render(harness)
    await page.getByRole("button", { name: "Delete Groceries" }).click()
    await wait(400)
    await page.getByRole("button", { name: "Delete Trip" }).click()
    await wait(400)
    expect(onCommit.mock.calls).toEqual([["Groceries"]])
    expect(isOpen()).toBe(true)
    await expect
      .poll(() => onCommit.mock.calls.length, { timeout: 2000 })
      .toBe(2)
    expect(onCommit.mock.lastCall).toEqual(["Trip"])
  })

  it("pauses while a mouse hovers it and resumes on leave", async () => {
    const { harness, onCommit } = setup({ timeout: 300 })
    await render(harness)
    await page.getByRole("button", { name: "Delete Groceries" }).click()
    hover("pointerenter")
    await expect.poll(() => bar()?.dataset.paused).toBe("")
    await wait(600)
    expect(onCommit).not.toHaveBeenCalled()
    expect(isOpen()).toBe(true)
    hover("pointerleave")
    await expect.poll(() => bar()?.dataset.paused).toBeUndefined()
    await expect
      .poll(() => onCommit.mock.calls.length, { timeout: 2000 })
      .toBe(1)
  })

  it("does not pause for a touch pointer", async () => {
    const { harness, onCommit } = setup({ timeout: 300 })
    await render(harness)
    await page.getByRole("button", { name: "Delete Groceries" }).click()
    hover("pointerenter", "touch")
    expect(bar()?.dataset.paused).toBeUndefined()
    await expect
      .poll(() => onCommit.mock.calls.length, { timeout: 2000 })
      .toBe(1)
  })

  it("pauses while focus is inside and resumes on blur", async () => {
    const { harness, onCommit } = setup({ timeout: 300 })
    await render(harness)
    await page.getByRole("button", { name: "Delete Groceries" }).click()
    ;(
      page
        .getByRole("button", { name: "Undo", exact: true })
        .element() as HTMLElement
    ).focus()
    await expect.poll(() => bar()?.dataset.paused).toBe("")
    await wait(600)
    expect(onCommit).not.toHaveBeenCalled()
    ;(
      page.getByRole("textbox", { name: "Notes" }).element() as HTMLElement
    ).focus()
    await expect
      .poll(() => onCommit.mock.calls.length, { timeout: 2000 })
      .toBe(1)
  })

  it("pauses while the document is hidden", async () => {
    const { harness, onCommit } = setup({ timeout: 300 })
    await render(harness)
    await page.getByRole("button", { name: "Delete Groceries" }).click()
    setHidden(true)
    await expect.poll(() => bar()?.dataset.paused).toBe("")
    await wait(600)
    expect(onCommit).not.toHaveBeenCalled()
    setHidden(false)
    await expect
      .poll(() => onCommit.mock.calls.length, { timeout: 2000 })
      .toBe(1)
  })

  it.each([
    ["Control+z", "{Control>}z{/Control}"],
    ["Meta+z", "{Meta>}z{/Meta}"],
  ])("undoes on %s", async (_, keys) => {
    const { harness, onUndo } = setup({ timeout: 2000 })
    await render(harness)
    await page.getByRole("button", { name: "Delete Groceries" }).click()
    ;(document.activeElement as HTMLElement | null)?.blur()
    await userEvent.keyboard(keys)
    expect(onUndo).toHaveBeenCalledExactlyOnceWith("Groceries")
    await expect.poll(isOpen).toBe(false)
  })

  it("ignores the shortcut with shift, inside a text field, or when closed", async () => {
    const { harness, onUndo } = setup({ timeout: 2000 })
    await render(harness)
    await userEvent.keyboard("{Control>}z{/Control}")
    await page.getByRole("button", { name: "Delete Groceries" }).click()
    await userEvent.keyboard("{Control>}{Shift>}z{/Shift}{/Control}")
    await page.getByRole("textbox", { name: "Notes" }).click()
    await userEvent.keyboard("{Control>}z{/Control}")
    await wait(100)
    expect(onUndo).not.toHaveBeenCalled()
    expect(isOpen()).toBe(true)
  })

  it("undoes and dismisses through the hook", async () => {
    const { harness, onUndo, onCommit } = setup({ timeout: 2000 })
    await render(harness)
    await page.getByRole("button", { name: "Delete Groceries" }).click()
    await page.getByRole("button", { name: "Undo from code" }).click()
    expect(onUndo).toHaveBeenCalledExactlyOnceWith("Groceries")
    await page.getByRole("button", { name: "Delete Trip" }).click()
    await expect.poll(isOpen).toBe(true)
    await page.getByRole("button", { name: "Dismiss from code" }).click()
    expect(onCommit).toHaveBeenCalledExactlyOnceWith("Trip")
    await expect.poll(isOpen).toBe(false)
    await page.getByRole("button", { name: "Undo from code" }).click()
    await page.getByRole("button", { name: "Dismiss from code" }).click()
    expect(onUndo).toHaveBeenCalledTimes(1)
    expect(onCommit).toHaveBeenCalledTimes(1)
  })

  it("throws when the hook is used outside the provider", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined)
    function Orphan() {
      useUndoBar()
      return null
    }
    await expect(render(<Orphan />)).rejects.toThrow(
      "useUndoBar must be used within an <UndoBarProvider />"
    )
    error.mockRestore()
  })
})
