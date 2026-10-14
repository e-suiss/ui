import { describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import { SignupSteps } from "@/components/blocks/signup-steps"

const counterText = /^Step \d of 3$/

const counter = () => page.getByText(counterText)
const nextButton = (name = "Continue") =>
  page.getByRole("button", { name, exact: true })
const back = () => page.getByRole("button", { name: "Back" })
const nameInput = () => page.getByRole("textbox", { name: "Full name" })
const emailInput = () => page.getByRole("textbox", { name: "name@example.com" })
const passwordInput = () => page.getByLabelText("Password", { exact: true })

function progress() {
  return Array.from(
    document.querySelectorAll<HTMLElement>("ol[aria-label=Progress] > li"),
    (item) =>
      [
        item.textContent,
        item.getAttribute("aria-current") ?? "",
        item.hasAttribute("data-reached") ? "reached" : "",
      ].join("|")
  )
}

function rules() {
  return Array.from(
    document.querySelectorAll<HTMLElement>("form li"),
    (item) => item.textContent
  )
}

async function toPassword() {
  await nameInput().fill("Jamie Rivera")
  await nextButton().click()
  await emailInput().fill("jamie@suiss.com")
  await nextButton().click()
  await expect.element(counter()).toHaveTextContent("Step 3 of 3")
}

describe("SignupSteps", () => {
  it("starts on the name step with continue disabled", async () => {
    await render(<SignupSteps />)
    await expect.element(counter()).toHaveTextContent("Step 1 of 3")
    await expect
      .element(page.getByRole("heading", { name: "What should we call you?" }))
      .toBeVisible()
    await expect.element(nextButton()).toBeDisabled()
    await expect.element(back()).not.toBeInTheDocument()
    expect(progress()).toEqual(["Step 1|step|reached", "Step 2||", "Step 3||"])
  })

  it("needs at least two characters of name", async () => {
    await render(<SignupSteps />)
    await nameInput().fill("  J ")
    await expect.element(nextButton()).toBeDisabled()
    await nameInput().fill("Jo")
    await expect.element(nextButton()).toBeEnabled()
  })

  it("moves forward and marks earlier steps complete", async () => {
    await render(<SignupSteps />)
    await nameInput().fill("Jamie Rivera")
    await nextButton().click()
    await expect.element(counter()).toHaveTextContent("Step 2 of 3")
    await expect.element(emailInput()).toHaveFocus()
    expect(progress()).toEqual([
      "Step 1, complete||reached",
      "Step 2|step|reached",
      "Step 3||",
    ])
    await expect.element(back()).toBeVisible()
  })

  it("validates the email before continuing", async () => {
    await render(<SignupSteps />)
    await nameInput().fill("Jamie Rivera")
    await nextButton().click()
    await emailInput().fill("jamie@suiss")
    await expect.element(nextButton()).toBeDisabled()
    await userEvent.keyboard("{Enter}")
    await expect.element(counter()).toHaveTextContent("Step 2 of 3")
    await emailInput().fill("jamie@suiss.com")
    await userEvent.keyboard("{Enter}")
    await expect.element(counter()).toHaveTextContent("Step 3 of 3")
    await expect.element(nextButton("Create account")).toBeDisabled()
  })

  it("shows the password rules and requires all of them", async () => {
    await render(<SignupSteps />)
    await toPassword()
    expect(rules()).toEqual([])
    await passwordInput().fill("sunrise")
    await expect
      .poll(rules)
      .toEqual([
        "At least 8 characters(not met)",
        "Upper and lowercase letters(not met)",
        "At least one number(not met)",
      ])
    await passwordInput().fill("Sunrise!!")
    await expect
      .poll(rules)
      .toEqual([
        "At least 8 characters(met)",
        "Upper and lowercase letters(met)",
        "At least one number(not met)",
      ])
    await expect.element(nextButton("Create account")).toBeDisabled()
    await passwordInput().fill("Sunrise26")
    await expect.element(nextButton("Create account")).toBeEnabled()
  })

  it("goes back and keeps what was typed", async () => {
    await render(<SignupSteps />)
    await toPassword()
    await back().click()
    await expect.element(counter()).toHaveTextContent("Step 2 of 3")
    await expect.element(emailInput()).toHaveValue("jamie@suiss.com")
    await back().click()
    await expect.element(counter()).toHaveTextContent("Step 1 of 3")
    await expect.element(nameInput()).toHaveValue("Jamie Rivera")
    await expect.element(back()).not.toBeInTheDocument()
  })

  it("creates the account and welcomes the person by first name", async () => {
    await render(<SignupSteps />)
    await toPassword()
    await passwordInput().fill("Sunrise26")
    await nextButton("Create account").click()
    await expect
      .element(page.getByRole("heading", { name: "Welcome, Jamie." }))
      .toBeVisible()
    await expect
      .element(
        page.getByText(
          "Your account is ready. Verify jamie@suiss.com to finish."
        )
      )
      .toBeVisible()
    await page.getByRole("button", { name: "Start over ›" }).click()
    await expect.element(counter()).toHaveTextContent("Step 1 of 3")
    await expect.element(nameInput()).toHaveValue("Jamie Rivera")
  })
})
