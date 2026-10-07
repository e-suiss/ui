import { describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"

import { BagReview } from "@/components/blocks/bag-review"

const row = (name: string) =>
  page
    .getByRole("listitem")
    .filter({ has: page.getByRole("heading", { name, exact: true }) })

const heading = () => page.getByRole("heading", { level: 1 })

const quantity = (name: string) =>
  page.getByRole("textbox", { name: `${name} quantity` })

const summary = (label: string) =>
  Array.from(document.querySelectorAll("span")).find(
    (node) => node.textContent === label
  )?.nextElementSibling?.textContent

describe("BagReview", () => {
  it("totals price times quantity for every item", async () => {
    await render(<BagReview />)
    await expect
      .element(heading())
      .toHaveTextContent("Your bag total is $1,746.00.")
    await expect.element(quantity("Phone Pro Clear Case")).toHaveValue("2")
    await expect
      .element(row("Phone Pro Clear Case").getByText("$98.00", { exact: true }))
      .toBeVisible()
    expect(summary("Subtotal")).toBe("$1,746.00")
    expect(summary("Total")).toBe("$1,746.00")
    expect(summary("Shipping")).toBe("FREE")
  })

  it("updates the line and totals when the quantity steps", async () => {
    await render(<BagReview />)
    await row("Pods Studio").getByRole("button", { name: "Increase" }).click()
    await expect.element(quantity("Pods Studio")).toHaveValue("2")
    await expect
      .element(row("Pods Studio").getByText("$1,098.00", { exact: true }))
      .toBeVisible()
    await expect
      .element(heading())
      .toHaveTextContent("Your bag total is $2,295.00.")
    expect(summary("Total")).toBe("$2,295.00")

    await row("Phone Pro Clear Case")
      .getByRole("button", { name: "Decrease" })
      .click()
    await expect
      .element(heading())
      .toHaveTextContent("Your bag total is $2,246.00.")
    await expect
      .element(
        row("Phone Pro Clear Case").getByRole("button", { name: "Decrease" })
      )
      .toBeDisabled()
  })

  it("caps a line at ten", async () => {
    await render(<BagReview />)
    const increase = row("Phone Pro Clear Case").getByRole("button", {
      name: "Increase",
    })
    for (let index = 0; index < 8; index++) await increase.click()
    await expect.element(quantity("Phone Pro Clear Case")).toHaveValue("10")
    await expect.element(increase).toBeDisabled()
    await expect
      .element(heading())
      .toHaveTextContent("Your bag total is $2,138.00.")
  })

  it("removes items and offers to continue shopping when empty", async () => {
    await render(<BagReview />)
    await page
      .getByRole("button", { name: "Remove Phone Pro", exact: true })
      .click()
    await expect
      .element(heading())
      .toHaveTextContent("Your bag total is $647.00.")
    expect(document.querySelectorAll("li")).toHaveLength(2)
    await page.getByRole("button", { name: "Remove Pods Studio" }).click()
    await page
      .getByRole("button", { name: "Remove Phone Pro Clear Case" })
      .click()
    await expect.element(heading()).toHaveTextContent("Your bag is empty.")
    expect(document.querySelectorAll("li")).toHaveLength(0)
    expect(summary("Subtotal")).toBeUndefined()
    await expect
      .element(page.getByRole("button", { name: "Check Out" }))
      .not.toBeInTheDocument()

    await page.getByRole("button", { name: "Continue Shopping" }).click()
    await expect
      .element(heading())
      .toHaveTextContent("Your bag total is $1,746.00.")
    expect(document.querySelectorAll("li")).toHaveLength(3)
  })
})
