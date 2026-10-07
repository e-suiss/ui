import { describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import { LoginAccount } from "@/components/blocks/login-account"

const email = () => page.getByRole("textbox", { name: "Email or phone number" })
const password = () => page.getByLabelText("Password", { exact: true })
const continueButtons = () => page.getByRole("button", { name: "Continue" })
const emailContinue = () => continueButtons().first()
const passwordContinue = () => continueButtons().last()
const error = () => document.getElementById("login-account-error")
const passwordRow = () =>
  password().element().closest<HTMLElement>("[class*=grid-rows]")

async function reachPassword(address = "jamie@suiss.com") {
  await email().fill(address)
  await emailContinue().click()
  await expect.element(password()).toHaveAttribute("tabindex", "0")
}

describe("LoginAccount", () => {
  it("disables continue until an email is typed", async () => {
    await render(<LoginAccount />)
    await expect.element(emailContinue()).toBeDisabled()
    await email().fill("j")
    await expect.element(emailContinue()).toBeEnabled()
    await email().fill("")
    await expect.element(emailContinue()).toBeDisabled()
  })

  it("keeps the password field out of reach on the email step", async () => {
    await render(<LoginAccount />)
    await expect.element(password()).toHaveAttribute("tabindex", "-1")
    expect(passwordRow()?.hasAttribute("data-open")).toBe(false)
  })

  it("rejects an invalid email and clears the error on edit", async () => {
    await render(<LoginAccount />)
    await email().fill("jamie")
    await userEvent.keyboard("{Enter}")
    await expect
      .poll(() => error()?.textContent)
      .toBe("Enter a valid suiss Account.")
    await expect.element(email()).toHaveAttribute("aria-invalid", "true")
    expect(document.querySelector("[data-invalid]")).not.toBeNull()
    await expect.element(password()).toHaveAttribute("tabindex", "-1")

    await email().fill("jamie@suiss")
    await expect.poll(() => error()?.textContent).toBe("")
    await expect.element(email()).not.toHaveAttribute("aria-invalid")
    expect(document.querySelector("[data-invalid]")).toBeNull()
  })

  it("reveals and focuses the password step after a valid email", async () => {
    await render(<LoginAccount />)
    await reachPassword()
    expect(passwordRow()?.hasAttribute("data-open")).toBe(true)
    await expect.element(password()).toHaveFocus()
    await expect.element(continueButtons()).toHaveLength(1)
  })

  it("rejects a short password", async () => {
    await render(<LoginAccount />)
    await reachPassword()
    await password().fill("abc")
    await passwordContinue().click()
    await expect
      .poll(() => error()?.textContent)
      .toBe("Your suiss Account or password was incorrect.")
    await expect.element(password()).toHaveAttribute("aria-invalid", "true")
    await expect.element(email()).not.toHaveAttribute("aria-invalid")

    await password().fill("abcd")
    await expect.poll(() => error()?.textContent).toBe("")
    await expect.element(password()).not.toHaveAttribute("aria-invalid")
  })

  it("returns to the email step when the email is edited", async () => {
    await render(<LoginAccount />)
    await reachPassword()
    await email().fill("jamie@suiss.co")
    await expect.element(password()).toHaveAttribute("tabindex", "-1")
    expect(passwordRow()?.hasAttribute("data-open")).toBe(false)
    await expect.element(continueButtons()).toHaveLength(2)
  })

  it("signs in, greets the account and signs out", async () => {
    await render(<LoginAccount />)
    await reachPassword("jamie@suiss.com")
    await password().fill("secret")
    await passwordContinue().click()
    await expect.element(passwordContinue()).toBeDisabled()
    await expect
      .element(page.getByRole("heading", { name: "Hello." }))
      .toBeVisible()
    await expect.element(page.getByText("jamie@suiss.com")).toBeVisible()
    await expect.element(page.getByText("j", { exact: true })).toBeVisible()

    await page.getByRole("button", { name: "Sign out ›" }).click()
    await expect
      .element(
        page.getByRole("heading", { name: "Sign in with your suiss Account" })
      )
      .toBeVisible()
    await expect.element(email()).toHaveValue("jamie@suiss.com")
    await expect.element(password()).toHaveValue("")
    await expect.element(password()).toHaveAttribute("tabindex", "-1")
  })

  it("remembers the account by default", async () => {
    await render(<LoginAccount />)
    const remember = page.getByRole("checkbox", { name: "Remember me" })
    await expect.element(remember).toBeChecked()
    await remember.click()
    await expect.element(remember).not.toBeChecked()
  })
})
