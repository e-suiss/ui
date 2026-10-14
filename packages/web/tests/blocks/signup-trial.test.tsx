import { afterEach, describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import { SignupTrial } from "@/components/blocks/signup-trial"

afterEach(async () => {
  await page.viewport(1280, 800)
})

const termsText = /^I have read and agree/

const email = () => page.getByRole("textbox", { name: "suiss Account email" })
const password = () => page.getByLabelText("Create a password")
const meter = () => page.getByRole("meter", { name: "Password strength" })
const terms = () => page.getByRole("checkbox")
const start = () => page.getByRole("button", { name: "Start free trial" })

function bars() {
  return Array.from(
    meter().element().children,
    (bar) => !bar.className.includes("bg-control")
  ).filter(Boolean).length
}

describe("SignupTrial", () => {
  it("starts with the trial disabled and no meter", async () => {
    await render(<SignupTrial />)
    await expect.element(start()).toBeDisabled()
    await expect.element(meter()).not.toBeInTheDocument()
    await expect.element(terms()).toHaveAttribute("aria-checked", "false")
  })

  it.each([
    ["sunrise", 0, "Weak", 1],
    ["sunrise26", 2, "Fair", 2],
    ["Sunrise26", 3, "Good", 3],
    ["Sunrise26!", 4, "Strong", 4],
    ["S!", 1, "Weak", 1],
  ])("rates %s as %i (%s)", async (value, score, label, filled) => {
    await render(<SignupTrial />)
    await password().fill(value)
    await expect.element(meter()).toHaveAttribute("aria-valuenow", `${score}`)
    await expect.element(meter()).toHaveAttribute("aria-valuetext", label)
    expect(bars()).toBe(filled)
  })

  it("hides the meter again when the password is cleared", async () => {
    await render(<SignupTrial />)
    await password().fill("abc")
    await expect.element(meter()).toBeVisible()
    await password().fill("")
    await expect.element(meter()).not.toBeInTheDocument()
  })

  it("needs a valid email, a good password and the terms", async () => {
    await render(<SignupTrial />)
    await email().fill("jamie@suiss.com")
    await password().fill("Sunrise26")
    await expect.element(start()).toBeDisabled()
    await page.getByText(termsText).click()
    await expect.element(terms()).toHaveAttribute("aria-checked", "true")
    await expect.element(start()).toBeEnabled()
    await email().fill("jamie@suiss")
    await expect.element(start()).toBeDisabled()
    await email().fill("jamie@suiss.com")
    await password().fill("sunrise26")
    await expect.element(start()).toBeDisabled()
    await password().fill("sunrise26!")
    await expect.element(start()).toBeEnabled()
    await terms().click()
    await expect.element(start()).toBeDisabled()
  })

  it("starts the trial and starts over with the form kept", async () => {
    await render(<SignupTrial />)
    await email().fill("jamie@suiss.com")
    await password().fill("Sunrise26")
    await terms().click()
    await start().click()
    await expect
      .element(page.getByRole("heading", { name: "Welcome to suiss Music." }))
      .toBeVisible()
    await page.getByRole("button", { name: "Start over ›" }).click()
    await expect.element(email()).toHaveValue("jamie@suiss.com")
    await expect.element(start()).toBeEnabled()
  })

  it("does not submit on enter while invalid", async () => {
    await render(<SignupTrial />)
    await email().fill("jamie@suiss.com")
    await password().fill("Sunrise26")
    await password().click()
    await userEvent.keyboard("{Enter}")
    await new Promise((resolve) => setTimeout(resolve, 200))
    await expect
      .element(page.getByRole("heading", { name: "Start your free trial." }))
      .toBeVisible()
  })

  it("stacks the artwork above the form on a phone", async () => {
    const artwork = () => page.getByText("Over 100 million songs. Ad-free.")
    const heading = () =>
      page.getByRole("heading", { name: "Start your free trial." })
    await render(<SignupTrial />)
    await expect.element(heading()).toBeVisible()
    expect(heading().element().getBoundingClientRect().left).toBeGreaterThan(
      artwork().element().getBoundingClientRect().right
    )
    await page.viewport(390, 844)
    await expect
      .poll(
        () =>
          heading().element().getBoundingClientRect().top >
          artwork().element().getBoundingClientRect().bottom
      )
      .toBe(true)
  })
})
