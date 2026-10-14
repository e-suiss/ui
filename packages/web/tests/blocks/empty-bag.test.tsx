import { describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"

import { EmptyBag } from "@/components/blocks/empty-bag"

const BAG_TITLE = /in your bag\.$|Your bag is empty\./

const title = () => page.getByText(BAG_TITLE)

const badge = () =>
  document.querySelector(
    "[data-slot=empty-icon] span, [data-slot=empty-media] span"
  )?.textContent

describe("EmptyBag", () => {
  it("invites the shopper to sign in while the bag is empty", async () => {
    await render(<EmptyBag />)
    await expect.element(title()).toHaveTextContent("Your bag is empty.")
    await expect
      .element(page.getByText("Sign in to see items you saved."))
      .toBeVisible()
    await expect
      .element(page.getByRole("button", { name: "Sign In" }))
      .toBeVisible()
    await expect
      .element(page.getByRole("button", { name: "Continue Shopping" }))
      .toBeVisible()
    await expect
      .element(page.getByRole("heading", { name: "You may also like" }))
      .toBeVisible()
    expect(badge()).toBeUndefined()
  })

  it("counts recommended items added to the bag", async () => {
    await render(<EmptyBag />)
    await page.getByRole("button", { name: "Add Sport Band to bag" }).click()
    await expect
      .element(title())
      .toHaveTextContent("There is 1 item in your bag.")
    await expect
      .element(page.getByRole("button", { name: "Remove Sport Band from bag" }))
      .toHaveAttribute("aria-pressed", "true")
    await expect
      .element(page.getByRole("button", { name: "Check Out" }))
      .toBeVisible()
    await expect
      .element(page.getByText("Check out now or keep browsing."))
      .toBeVisible()
    expect(badge()).toBe("1")

    await page.getByRole("button", { name: "Add Pods Studio to bag" }).click()
    await expect
      .element(title())
      .toHaveTextContent("There are 2 items in your bag.")
    expect(badge()).toBe("2")
  })

  it("empties again when the items are removed", async () => {
    await render(<EmptyBag />)
    await page
      .getByRole("button", { name: "Add Phone Pro Clear Case to bag" })
      .click()
    await page
      .getByRole("button", { name: "Remove Phone Pro Clear Case from bag" })
      .click()
    await expect.element(title()).toHaveTextContent("Your bag is empty.")
    await expect
      .element(
        page.getByRole("button", { name: "Add Phone Pro Clear Case to bag" })
      )
      .toHaveAttribute("aria-pressed", "false")
    await expect
      .element(page.getByRole("button", { name: "Sign In" }))
      .toBeVisible()
    expect(badge()).toBeUndefined()
  })
})
