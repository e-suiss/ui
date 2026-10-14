import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import {
  Stepper,
  StepperDecrement,
  StepperGroup,
  StepperIncrement,
  StepperInput,
  StepperSeparator,
} from "@/components/interactions/stepper"

const POINT_THREE = /^0[.,]3$/

function Quantity(props: React.ComponentProps<typeof Stepper>) {
  return (
    <Stepper {...props}>
      <StepperInput aria-label="Quantity" />
      <StepperGroup>
        <StepperDecrement />
        <StepperSeparator />
        <StepperIncrement />
      </StepperGroup>
    </Stepper>
  )
}

function Controlled({ onValueChange }: { onValueChange: (v: number) => void }) {
  const [value, setValue] = React.useState(3)
  return (
    <>
      <button type="button" onClick={() => setValue(8)}>
        Set eight
      </button>
      <Quantity
        value={value}
        min={0}
        max={10}
        onValueChange={(next) => {
          setValue(next)
          onValueChange(next)
        }}
      />
    </>
  )
}

function button(slot: "stepper-increment" | "stepper-decrement") {
  const node = document.querySelector<HTMLButtonElement>(`[data-slot=${slot}]`)
  if (!node) throw new Error(`${slot} not rendered`)
  return node
}

const increment = () => button("stepper-increment")
const decrement = () => button("stepper-decrement")
const input = () => page.getByRole("textbox", { name: "Quantity" })
const inputValue = () => input().element().getAttribute("value") ?? ""
const current = () => (input().element() as HTMLInputElement).value

function pointer(target: HTMLElement, type: string, buttonIndex = 0) {
  target.dispatchEvent(
    new PointerEvent(type, {
      pointerId: 1,
      pointerType: "touch",
      button: buttonIndex,
      buttons: type === "pointerup" ? 0 : 1,
      bubbles: true,
      cancelable: true,
    })
  )
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe("Stepper", () => {
  it("renders the default value in the input", async () => {
    await render(<Quantity defaultValue={4} />)
    await expect.element(input()).toHaveValue("4")
    expect(inputValue()).toBe("4")
  })

  it("steps once per press without repeating on a quick tap", async () => {
    const onValueChange = vi.fn()
    await render(<Quantity defaultValue={1} onValueChange={onValueChange} />)
    pointer(increment(), "pointerdown")
    pointer(increment(), "pointerup")
    await expect.element(input()).toHaveValue("2")
    pointer(decrement(), "pointerdown")
    pointer(decrement(), "pointerup")
    await expect.element(input()).toHaveValue("1")
    await wait(600)
    expect(current()).toBe("1")
    expect(onValueChange.mock.calls).toEqual([[2], [1]])
  })

  it("ignores presses with a secondary button", async () => {
    const onValueChange = vi.fn()
    await render(<Quantity defaultValue={1} onValueChange={onValueChange} />)
    pointer(increment(), "pointerdown", 2)
    pointer(increment(), "pointerup", 2)
    await wait(500)
    expect(current()).toBe("1")
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it("repeats while held and stops on release", async () => {
    await render(<Quantity defaultValue={0} />)
    pointer(increment(), "pointerdown")
    await expect.element(input()).toHaveValue("1")
    await wait(300)
    expect(current()).toBe("1")
    await expect
      .poll(() => Number(current()), { timeout: 3000 })
      .toBeGreaterThanOrEqual(4)
    pointer(increment(), "pointerup")
    const stopped = Number(current())
    await wait(500)
    expect(Number(current())).toBe(stopped)
  })

  it("stops repeating when the pointer is cancelled", async () => {
    await render(<Quantity defaultValue={10} />)
    pointer(decrement(), "pointerdown")
    await expect
      .poll(() => Number(current()), { timeout: 3000 })
      .toBeLessThanOrEqual(8)
    pointer(decrement(), "pointercancel")
    const stopped = Number(current())
    await wait(500)
    expect(Number(current())).toBe(stopped)
  })

  it("accelerates the repeat rate the longer it is held", async () => {
    await render(<Quantity defaultValue={0} />)
    pointer(increment(), "pointerdown")
    await expect
      .poll(() => Number(current()), { timeout: 3000 })
      .toBeGreaterThanOrEqual(2)
    const startedAt = performance.now()
    await expect
      .poll(() => Number(current()), { timeout: 3000 })
      .toBeGreaterThanOrEqual(4)
    const firstTicks = performance.now() - startedAt
    await expect
      .poll(() => Number(current()), { timeout: 5000 })
      .toBeGreaterThanOrEqual(20)
    const laterStart = performance.now()
    const laterFrom = Number(current())
    await expect
      .poll(() => Number(current()), { timeout: 3000 })
      .toBeGreaterThanOrEqual(laterFrom + 2)
    const laterTicks = performance.now() - laterStart
    pointer(increment(), "pointerup")
    expect(laterTicks).toBeLessThan(firstTicks)
  })

  it("clamps at max and disables the increment button", async () => {
    await render(<Quantity defaultValue={8} min={0} max={10} />)
    pointer(increment(), "pointerdown")
    await expect.poll(current, { timeout: 3000 }).toBe("10")
    await expect
      .element(page.getByRole("button", { name: "Increase" }))
      .toBeDisabled()
    await wait(400)
    pointer(increment(), "pointerup")
    expect(current()).toBe("10")
    expect(decrement().disabled).toBe(false)
  })

  it("clamps at min and disables the decrement button", async () => {
    await render(<Quantity defaultValue={1} min={0} max={10} />)
    expect(decrement().disabled).toBe(false)
    pointer(decrement(), "pointerdown")
    pointer(decrement(), "pointerup")
    await expect.element(input()).toHaveValue("0")
    await expect
      .element(page.getByRole("button", { name: "Decrease" }))
      .toBeDisabled()
  })

  it("starts disabled at a bound", async () => {
    await render(<Quantity defaultValue={10} min={0} max={10} />)
    expect(increment().disabled).toBe(true)
    expect(decrement().disabled).toBe(false)
  })

  it("moves by the step and never overshoots the bound", async () => {
    const onValueChange = vi.fn()
    await render(
      <Quantity
        defaultValue={90}
        min={25}
        max={98}
        step={5}
        onValueChange={onValueChange}
      />
    )
    pointer(increment(), "pointerdown")
    pointer(increment(), "pointerup")
    await expect.element(input()).toHaveValue("95")
    pointer(increment(), "pointerdown")
    pointer(increment(), "pointerup")
    await expect.element(input()).toHaveValue("98")
    expect(onValueChange.mock.calls).toEqual([[95], [98]])
    expect(increment().disabled).toBe(true)
  })

  it("keeps decimal steps free of floating point drift", async () => {
    const onValueChange = vi.fn()
    await render(
      <Quantity defaultValue={0} step={0.1} onValueChange={onValueChange} />
    )
    for (let index = 0; index < 3; index++) {
      pointer(increment(), "pointerdown")
      pointer(increment(), "pointerup")
    }
    await expect.poll(() => onValueChange.mock.calls.length).toBe(3)
    expect(onValueChange.mock.calls).toEqual([[0.1], [0.2], [0.3]])
    await expect.poll(current).toMatch(POINT_THREE)
  })

  it("steps on keyboard activation of the buttons", async () => {
    const onValueChange = vi.fn()
    await render(<Quantity defaultValue={5} onValueChange={onValueChange} />)
    increment().focus()
    await userEvent.keyboard("{Enter}")
    await expect.element(input()).toHaveValue("6")
    await userEvent.keyboard(" ")
    await expect.element(input()).toHaveValue("7")
    decrement().focus()
    await userEvent.keyboard("{Enter}")
    await expect.element(input()).toHaveValue("6")
    expect(onValueChange.mock.calls).toEqual([[6], [7], [6]])
  })

  it("does not double step on a real click", async () => {
    const onValueChange = vi.fn()
    await render(<Quantity defaultValue={5} onValueChange={onValueChange} />)
    await page.getByRole("button", { name: "Increase" }).click()
    await expect.element(input()).toHaveValue("6")
    await wait(100)
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith(6)
  })

  it("accepts a typed value", async () => {
    const onValueChange = vi.fn()
    await render(
      <Quantity
        defaultValue={1}
        min={0}
        max={50}
        onValueChange={onValueChange}
      />
    )
    await input().fill("42")
    await userEvent.keyboard("{Tab}")
    await expect.poll(() => onValueChange.mock.lastCall).toEqual([42])
    pointer(increment(), "pointerdown")
    pointer(increment(), "pointerup")
    await expect.element(input()).toHaveValue("43")
  })

  it("does nothing when disabled", async () => {
    const onValueChange = vi.fn()
    await render(
      <Quantity defaultValue={3} disabled onValueChange={onValueChange} />
    )
    expect(increment().disabled).toBe(true)
    expect(decrement().disabled).toBe(true)
    await expect.element(input()).toBeDisabled()
    pointer(increment(), "pointerdown")
    pointer(increment(), "pointerup")
    await wait(100)
    expect(current()).toBe("3")
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it("follows a controlled value", async () => {
    const onValueChange = vi.fn()
    await render(<Controlled onValueChange={onValueChange} />)
    await expect.element(input()).toHaveValue("3")
    await page.getByRole("button", { name: "Set eight" }).click()
    await expect.element(input()).toHaveValue("8")
    pointer(increment(), "pointerdown")
    pointer(increment(), "pointerup")
    await expect.element(input()).toHaveValue("9")
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith(9)
  })

  it("exposes the buttons with accessible names inside a group", async () => {
    await render(<Quantity defaultValue={1} />)
    await expect.element(page.getByRole("group")).toBeInTheDocument()
    await expect
      .element(page.getByRole("button", { name: "Increase" }))
      .toBeVisible()
    await expect
      .element(page.getByRole("button", { name: "Decrease" }))
      .toBeVisible()
  })
})
