import { afterEach, describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import { VerifyCode } from "@/components/blocks/verify-code"

afterEach(async () => {
  vi.useRealTimers()
  await page.viewport(1280, 800)
})

const input = () => page.getByRole("textbox", { name: "Verification code" })
const hint = () => document.getElementById("verify-code-hint")
const countdownText = /^Resend code · 0:\d\d$/
const countdown = () => page.getByText(countdownText)
const resend = () => page.getByRole("button", { name: "Resend code ›" })

const slots = () =>
  Array.from(
    document.querySelectorAll<HTMLElement>("[data-slot=input-otp-slot]"),
    (slot) => slot.textContent
  ).join("")

const frame = () => new Promise(requestAnimationFrame)

async function advance(seconds: number) {
  for (let second = 0; second < seconds; second++) {
    vi.advanceTimersByTime(1000)
    await frame()
    await frame()
  }
}

describe("VerifyCode", () => {
  it("focuses the code field and shows the hint", async () => {
    await render(<VerifyCode />)
    await expect.element(input()).toHaveFocus()
    await expect
      .element(input())
      .toHaveAccessibleDescription("Demo code: 482913")
    await expect.element(countdown()).toHaveTextContent("Resend code · 0:30")
    await expect.element(resend()).not.toBeInTheDocument()
  })

  it("verifies the correct code and starts over", async () => {
    await render(<VerifyCode />)
    await expect.element(input()).toHaveFocus()
    await userEvent.keyboard("482913")
    await expect
      .element(page.getByRole("heading", { name: "Verified." }))
      .toBeVisible()
    await page.getByRole("button", { name: "Start over ›" }).click()
    await expect.element(input()).toHaveValue("")
    await expect.element(input()).toHaveFocus()
  })

  it("rejects a wrong code, flags it and clears the slots", async () => {
    await render(<VerifyCode />)
    await expect.element(input()).toHaveFocus()
    await userEvent.keyboard("482914")
    await expect.poll(() => hint()?.textContent).toBe("Incorrect code.")
    expect(hint()?.dataset.status).toBe("error")
    expect(
      document.querySelector("[data-status=error] [data-slot=input-otp-slot]")
    ).not.toBeNull()
    expect(slots()).toBe("482914")
    await expect.poll(slots).toBe("")
    expect(hint()?.textContent).toBe("Demo code: 482913")
    expect(hint()?.dataset.status).toBe("idle")
    await expect
      .element(page.getByRole("heading", { name: "Verified." }))
      .not.toBeInTheDocument()
  })

  it("accepts the right code after a wrong one", async () => {
    await render(<VerifyCode />)
    await expect.element(input()).toHaveFocus()
    await userEvent.keyboard("000000")
    await expect.poll(() => hint()?.textContent).toBe("Incorrect code.")
    await expect.poll(slots).toBe("")
    await input().click()
    await userEvent.keyboard("482913")
    await expect
      .element(page.getByRole("heading", { name: "Verified." }))
      .toBeVisible()
  })

  it("does not check an incomplete code", async () => {
    await render(<VerifyCode />)
    await expect.element(input()).toHaveFocus()
    await userEvent.keyboard("48291")
    await new Promise((resolve) => setTimeout(resolve, 400))
    expect(hint()?.textContent).toBe("Demo code: 482913")
    expect(slots()).toBe("48291")
  })

  it("counts down and offers to resend the code", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] })
    await render(<VerifyCode />)
    expect(countdown().element().textContent).toBe("Resend code · 0:30")
    await advance(1)
    expect(countdown().element().textContent).toBe("Resend code · 0:29")
    await advance(20)
    expect(countdown().element().textContent).toBe("Resend code · 0:09")
    await advance(9)
    expect(document.body.textContent).not.toContain("Resend code · 0:")
    expect(resend().element()).toBeVisible()
    vi.useRealTimers()
    await resend().click()
    await expect.element(countdown()).toHaveTextContent("Resend code · 0:30")
  })
})
