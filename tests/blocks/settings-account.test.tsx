import { afterEach, describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import { SettingsAccount } from "@/components/blocks/settings-account"

afterEach(async () => {
  await page.viewport(1280, 800)
})

const heading = () => page.getByRole("heading", { level: 1 })
const editEmail = () => page.getByRole("button", { name: "Edit email & phone" })
const editPhone = () =>
  page.getByRole("button", { name: "Edit trusted phone number" })
const emailInput = () => page.getByRole("textbox", { name: "Email & phone" })
const phoneInput = () =>
  page.getByRole("textbox", { name: "Trusted phone number" })
const status = () => page.getByRole("status")
const outsideSample = /isn't part of the sample/

function formOf(input: () => ReturnType<typeof page.getByRole>) {
  const form = input().element().closest("form")
  if (!form) throw new Error("form not rendered")
  return page.elementLocator(form)
}

const passkeys = () => page.getByRole("switch", { name: "Passkeys" })

describe("SettingsAccount", () => {
  it("opens on sign-in and security with the current values", async () => {
    await render(<SettingsAccount />)
    await expect.element(heading()).toHaveTextContent("Sign-In & Security")
    await expect
      .element(page.getByText("jamie@suiss.com", { exact: true }).last())
      .toBeVisible()
    await expect.element(page.getByText("+1 (415) 555-0142")).toBeVisible()
    await expect.element(status()).toHaveTextContent("")
  })

  it("edits a value, saves it and confirms", async () => {
    await render(<SettingsAccount />)
    await editEmail().click()
    await expect.element(emailInput()).toHaveValue("jamie@suiss.com")
    await expect.element(emailInput()).toHaveFocus()
    await expect.element(editEmail()).not.toBeInTheDocument()
    await emailInput().fill("jamie@rivera.dev")
    await formOf(emailInput).getByRole("button", { name: "Save" }).click()
    await expect.element(page.getByText("jamie@rivera.dev")).toBeVisible()
    await expect.element(editEmail()).toBeVisible()
    await expect.element(status()).toHaveTextContent("Email & phone saved.")
    await expect.element(status()).toHaveTextContent("")
  })

  it("saves with the enter key", async () => {
    await render(<SettingsAccount />)
    await editPhone().click()
    await expect.element(phoneInput()).toHaveFocus()
    await phoneInput().fill("+1 (415) 555-0199")
    await userEvent.keyboard("{Enter}")
    await expect.element(page.getByText("+1 (415) 555-0199")).toBeVisible()
    await expect
      .element(status())
      .toHaveTextContent("Trusted phone number saved.")
  })

  it("discards the draft on cancel", async () => {
    await render(<SettingsAccount />)
    await editPhone().click()
    await phoneInput().fill("000")
    await formOf(phoneInput).getByRole("button", { name: "Cancel" }).click()
    await expect.element(page.getByText("+1 (415) 555-0142")).toBeVisible()
    await expect.element(status()).toHaveTextContent("")
    await editPhone().click()
    await expect.element(phoneInput()).toHaveValue("+1 (415) 555-0142")
  })

  it("edits only one card at a time", async () => {
    await render(<SettingsAccount />)
    await editEmail().click()
    await expect.element(editEmail()).not.toBeInTheDocument()
    await editPhone().click()
    await expect.element(editEmail()).toBeVisible()
    await expect.element(editPhone()).not.toBeInTheDocument()
    expect(emailInput().element().closest("[inert]")).not.toBeNull()
    expect(phoneInput().element().closest("[inert]")).toBeNull()
  })

  it("turns passkeys off and on with the footnote following", async () => {
    await render(<SettingsAccount />)
    await expect.element(passkeys()).toHaveAttribute("aria-checked", "true")
    await expect.element(page.getByText("On for 3 devices")).toBeVisible()
    await passkeys().click()
    await expect.element(passkeys()).toHaveAttribute("aria-checked", "false")
    await expect.element(page.getByText("Off", { exact: true })).toBeVisible()
    await expect
      .element(page.getByText("On for 3 devices"))
      .not.toBeInTheDocument()
    await page.getByText("Passkeys", { exact: true }).click()
    await expect.element(passkeys()).toHaveAttribute("aria-checked", "true")
  })

  it("switches to a section outside the sample", async () => {
    await render(<SettingsAccount />)
    await page.getByRole("button", { name: "Privacy" }).click()
    await expect.element(heading()).toHaveTextContent("Privacy")
    await expect.element(page.getByText(outsideSample)).toBeVisible()
    await expect.element(passkeys()).not.toBeInTheDocument()
    await page.getByRole("button", { name: "Sign-In & Security" }).click()
    await expect.element(passkeys()).toBeVisible()
  })

  it("keeps the security cards usable on a phone", async () => {
    await page.viewport(390, 844)
    await render(<SettingsAccount />)
    await expect.element(heading()).toHaveTextContent("Sign-In & Security")
    await expect
      .element(page.getByRole("navigation", { name: "More" }))
      .toBeVisible()
    await editEmail().click()
    await emailInput().fill("jr@suiss.com")
    await formOf(emailInput).getByRole("button", { name: "Save" }).click()
    await expect.element(status()).toHaveTextContent("Email & phone saved.")
  })
})
