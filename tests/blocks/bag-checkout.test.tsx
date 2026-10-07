import { describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"

import { BagCheckout } from "@/components/blocks/bag-checkout"

const total = () =>
  page
    .getByRole("complementary", { name: "Order summary" })
    .element()
    .querySelector("[aria-live=polite]")?.textContent

const currentStep = () =>
  document.querySelector("[aria-current=step] h2")?.textContent

const button = (name: string) => page.getByRole("button", { name })

describe("BagCheckout", () => {
  it("lists the order and totals the items with free delivery", async () => {
    await render(<BagCheckout />)
    const summary = page.getByRole("complementary", { name: "Order summary" })
    await expect
      .element(summary.getByText("Phone Pro", { exact: true }))
      .toBeVisible()
    await expect.element(summary.getByText("$1,099.00")).toBeVisible()
    await expect.element(summary.getByText("$549.00")).toBeVisible()
    await expect.element(summary.getByText("$49.00")).toBeVisible()
    expect(total()).toBe("$1,697.00")
    expect(currentStep()).toBe("Delivery")
    await expect
      .element(
        page.getByRole("radio", { name: "Standard · 3–5 business days Free" })
      )
      .toBeChecked()
  })

  it("adds the express fee to the total and removes it again", async () => {
    await render(<BagCheckout />)
    await page.getByText("Express · Tomorrow").click()
    await expect.poll(total).toBe("$1,716.00")
    await page.getByText("Standard · 3–5 business days").click()
    await expect.poll(total).toBe("$1,697.00")
  })

  it("walks through the steps with summaries and places the order", async () => {
    await render(<BagCheckout />)
    await page.getByText("Express · Tomorrow").click()
    await button("Continue to Payment").click()
    await expect.poll(currentStep).toBe("Payment")
    await expect
      .element(page.getByText("Express · Tomorrow", { exact: true }).first())
      .toBeInTheDocument()
    await expect.element(button("Edit delivery")).toBeVisible()

    await page.getByText("suiss Pay").click()
    await expect
      .element(page.getByRole("radio", { name: "suiss Pay" }))
      .toBeChecked()
    await button("Continue to Review").click()
    await expect.poll(currentStep).toBe("Review")
    await expect.element(button("Edit payment")).toBeVisible()
    await expect
      .element(page.getByRole("paragraph").filter({ hasText: "suiss Pay" }))
      .toBeVisible()

    await button("Place Order").click()
    await expect
      .element(
        page.getByRole("heading", { name: "Thank you. Your order is in." })
      )
      .toBeVisible()
    await expect
      .element(page.getByText("Your order number is W1049.", { exact: false }))
      .toBeVisible()
    expect(document.querySelector("aside")).toBeNull()
  })

  it("returns to an earlier step through its edit button", async () => {
    await render(<BagCheckout />)
    await button("Continue to Payment").click()
    await button("Continue to Review").click()
    await expect.poll(currentStep).toBe("Review")
    await button("Edit delivery").click()
    await expect.poll(currentStep).toBe("Delivery")
    expect(document.querySelectorAll("[aria-label^=Edit]")).toHaveLength(0)
  })

  it("keeps closed steps inert", async () => {
    await render(<BagCheckout />)
    const panels = () =>
      Array.from(document.querySelectorAll("section section"), (step) =>
        step.querySelector("[inert]") ? "inert" : "open"
      )
    expect(panels()).toEqual(["open", "inert", "inert"])
    await button("Continue to Payment").click()
    await expect.poll(panels).toEqual(["inert", "open", "inert"])
  })

  it("starts over from the first step after an order", async () => {
    await render(<BagCheckout />)
    await page.getByText("Express · Tomorrow").click()
    await button("Continue to Payment").click()
    await button("Continue to Review").click()
    await button("Place Order").click()
    await button("Start over ›").click()
    await expect.poll(currentStep).toBe("Delivery")
    await expect.poll(total).toBe("$1,716.00")
  })
})
