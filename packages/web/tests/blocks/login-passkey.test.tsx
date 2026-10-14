import { describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import { LoginPasskey } from "@/components/blocks/login-passkey"

const start = () => page.getByRole("button", { name: "Continue with passkey" })
const dialog = () => page.getByRole("dialog")
const cancel = () => page.getByRole("button", { name: "Cancel" })
const welcome = () => page.getByRole("heading", { name: "Welcome, Jamie." })
const intro = () =>
  page.getByRole("heading", { name: "Sign in without a password." })

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe("LoginPasskey", () => {
  it("shows the account the passkey belongs to", async () => {
    await render(<LoginPasskey />)
    await expect.element(intro()).toBeVisible()
    await expect.element(page.getByText("jamie@suiss.com")).toBeVisible()
    await expect.element(dialog()).not.toBeInTheDocument()
  })

  it("scans, verifies and signs in", async () => {
    await render(<LoginPasskey />)
    await start().click()
    await expect.element(dialog()).toBeVisible()
    await expect
      .element(dialog().getByRole("heading", { name: "Face scan" }))
      .toBeVisible()
    await expect
      .element(dialog().getByText("Passkey for suiss.com"))
      .toBeVisible()
    await expect.element(cancel()).toBeVisible()

    await expect
      .element(dialog().getByRole("heading", { name: "Verified" }), {
        timeout: 3000,
      })
      .toBeVisible()
    await expect.element(cancel()).not.toBeInTheDocument()

    await expect.element(welcome(), { timeout: 3000 }).toBeVisible()
    await expect
      .element(
        page.getByText("You signed in with a passkey. No password needed.")
      )
      .toBeVisible()
    await expect.element(dialog()).not.toBeInTheDocument()
  })

  it("cancels the scan and never signs in", async () => {
    await render(<LoginPasskey />)
    await start().click()
    await expect.element(dialog()).toBeVisible()
    await cancel().click()
    await expect.element(dialog()).not.toBeInTheDocument()
    await wait(2600)
    await expect.element(welcome()).not.toBeInTheDocument()
    await expect.element(intro()).toBeVisible()
  })

  it("cancels the scan with Escape", async () => {
    await render(<LoginPasskey />)
    await start().click()
    await expect.element(dialog()).toBeVisible()
    await userEvent.keyboard("{Escape}")
    await expect.element(dialog()).not.toBeInTheDocument()
    await wait(2600)
    await expect.element(welcome()).not.toBeInTheDocument()
  })

  it("can scan again after a cancel and then sign out", async () => {
    await render(<LoginPasskey />)
    await start().click()
    await cancel().click()
    await expect.element(dialog()).not.toBeInTheDocument()
    await start().click()
    await expect.element(welcome(), { timeout: 4000 }).toBeVisible()
    await page.getByRole("button", { name: "Sign out ›" }).click()
    await expect.element(intro()).toBeVisible()
    await expect.element(start()).toBeVisible()
  })
})
