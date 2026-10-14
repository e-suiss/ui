import { describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"

import { EmptyOffline } from "@/components/blocks/empty-offline"

const retry = () => page.getByRole("button", { name: "Try Again" })

const albums = () =>
  Array.from(document.querySelectorAll("li"), (album) => album.textContent)

describe("EmptyOffline", () => {
  it("explains the offline state with its actions", async () => {
    await render(<EmptyOffline />)
    await expect
      .element(page.getByText("You're not connected to the internet."))
      .toBeVisible()
    await expect.element(retry()).toBeEnabled()
    await expect
      .element(page.getByRole("button", { name: "Downloads" }))
      .toBeVisible()
    expect(albums()).toEqual([])
  })

  it("connects after retrying and shows the library", async () => {
    await render(<EmptyOffline />)
    await retry().click()
    const connecting = page.getByRole("button", { name: "Loading Connecting" })
    await expect.element(connecting).toBeDisabled()
    await expect.element(connecting).toHaveAttribute("aria-live", "polite")
    await expect
      .element(connecting.getByRole("status", { name: "Loading" }))
      .toBeInTheDocument()
    await expect
      .element(page.getByRole("heading", { name: "suiss Music" }), {
        timeout: 3000,
      })
      .toBeVisible()
    expect(albums()).toEqual([
      "Orange Hour",
      "Soft Shapes",
      "Low Light",
      "Waves",
    ])
  })

  it("goes back offline when disconnected", async () => {
    await render(<EmptyOffline />)
    await retry().click()
    await page
      .getByRole("button", { name: "Disconnect ›" })
      .click({ timeout: 3000 })
    await expect.element(retry()).toBeEnabled()
    expect(albums()).toEqual([])
  })
})
