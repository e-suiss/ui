import { afterEach, describe, expect, it, vi } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"

import { VerifyEmail } from "@/components/blocks/verify-email"

afterEach(async () => {
  vi.useRealTimers()
  await page.viewport(1280, 800)
})

const resendName = /^(Resend|Sent again · \d+)$/
const resend = () => page.getByRole("button", { name: resendName })
const openMail = () => page.getByRole("button", { name: "Open Mail" })
const frame = () => new Promise(requestAnimationFrame)

async function advance(seconds: number) {
  for (let second = 0; second < seconds; second++) {
    vi.advanceTimersByTime(1000)
    await frame()
    await frame()
  }
}

describe("VerifyEmail", () => {
  it("asks to check the inbox for the address", async () => {
    await render(<VerifyEmail />)
    await expect
      .element(page.getByRole("heading", { name: "Check your inbox." }))
      .toBeVisible()
    await expect.element(page.getByText("jamie@suiss.com")).toBeVisible()
    await expect.element(page.getByText("new message")).toBeInTheDocument()
    await expect.element(resend()).toHaveTextContent("Resend")
    await expect.element(resend()).toBeEnabled()
    await expect
      .element(page.getByRole("link", { name: "change the address ›" }))
      .toHaveAttribute("href", "#change")
  })

  it("verifies through the mail button and starts over", async () => {
    await render(<VerifyEmail />)
    await openMail().click()
    await expect
      .element(page.getByRole("heading", { name: "Your email is verified." }))
      .toBeVisible()
    await expect
      .element(page.getByText("jamie@suiss.com is now your suiss Account."))
      .toBeVisible()
    await page.getByRole("button", { name: "Start over ›" }).click()
    await expect
      .element(page.getByRole("heading", { name: "Check your inbox." }))
      .toBeVisible()
  })

  it("locks resend behind a countdown", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] })
    await render(<VerifyEmail />)
    resend()
      .element()
      .dispatchEvent(new MouseEvent("click", { bubbles: true }))
    await frame()
    expect(resend().element().textContent).toBe("Sent again · 45")
    expect(resend().element()).toBeDisabled()
    await advance(1)
    expect(resend().element().textContent).toBe("Sent again · 44")
    await advance(43)
    expect(resend().element().textContent).toBe("Sent again · 1")
    await advance(1)
    expect(resend().element().textContent).toBe("Resend")
    expect(resend().element()).toBeEnabled()
  })

  it("can still verify while the countdown runs", async () => {
    await render(<VerifyEmail />)
    await resend().click()
    await expect.element(resend()).toBeDisabled()
    await openMail().click()
    await expect
      .element(page.getByRole("heading", { name: "Your email is verified." }))
      .toBeVisible()
  })

  it("wraps the actions on a narrow phone", async () => {
    await page.viewport(320, 700)
    await render(<VerifyEmail />)
    await expect.element(openMail()).toBeVisible()
    expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(320)
  })
})
