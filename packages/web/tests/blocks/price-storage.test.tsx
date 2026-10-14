import { afterEach, describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"

import { PriceStorage } from "@/components/blocks/price-storage"

const ACTION = /^(Switch to|Your plan)/

afterEach(async () => {
  await page.viewport(1280, 800)
})

const plans = [
  { size: "50 GB", price: 0.99 },
  { size: "200 GB", price: 2.99 },
  { size: "2 TB", price: 9.99 },
  { size: "6 TB", price: 29.99 },
]

const money = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" })

const period = (name: string) =>
  page
    .getByRole("group", { name: "Billing period" })
    .getByRole("button", { name })
const plan = (size: string) =>
  page.getByRole("radio", { name: new RegExp(`^(Most popular )?${size}\\b`) })
const action = () => page.getByRole("button", { name: ACTION })

function card(size: string) {
  const label = plan(size).element().closest("label")
  if (!label) throw new Error(`${size} card not rendered`)
  return label
}

function prices() {
  return plans.map(
    (item) =>
      card(item.size).querySelector(".tabular-nums")?.parentElement?.textContent
  )
}

describe("PriceStorage", () => {
  it("preselects the popular plan billed monthly", async () => {
    await render(<PriceStorage />)
    await expect.element(plan("200 GB")).toBeChecked()
    await expect
      .element(period("Monthly"))
      .toHaveAttribute("aria-pressed", "true")
    expect(prices()).toEqual(plans.map((item) => `${money(item.price)} /mo`))
    await expect.element(action()).toHaveAccessibleName("Switch to 200 GB")
    expect(card("200 GB").textContent).toContain("Most popular")
    expect(card("2 TB").textContent).not.toContain("Most popular")
  })

  it("bills ten months a year on the yearly plan", async () => {
    await render(<PriceStorage />)
    await period("Yearly · 2 months free").click()
    await expect
      .element(period("Yearly · 2 months free"))
      .toHaveAttribute("aria-pressed", "true")
    await expect
      .poll(prices)
      .toEqual(plans.map((item) => `${money(item.price * 10)} /yr`))
    await period("Monthly").click()
    await expect
      .poll(prices)
      .toEqual(plans.map((item) => `${money(item.price)} /mo`))
  })

  it("keeps the period when it is pressed again", async () => {
    await render(<PriceStorage />)
    await period("Monthly").click()
    await expect
      .element(period("Monthly"))
      .toHaveAttribute("aria-pressed", "true")
    expect(prices()[0]).toBe("$0.99 /mo")
  })

  it.each(plans)("offers to switch to $size", async (item) => {
    await render(<PriceStorage />)
    await card(item.size).click()
    await expect.element(plan(item.size)).toBeChecked()
    await expect
      .element(action())
      .toHaveAccessibleName(`Switch to ${item.size}`)
  })

  it("confirms the switch and offers it again after another pick", async () => {
    await render(<PriceStorage />)
    await card("2 TB").click()
    await action().click()
    await expect.element(action()).toHaveAccessibleName("Your plan is updated")
    await card("6 TB").click()
    await expect.element(action()).toHaveAccessibleName("Switch to 6 TB")
  })

  it("lays the plans out in four, two and one columns", async () => {
    await render(<PriceStorage />)
    const tops = () =>
      plans.map((item) =>
        Math.round(card(item.size).getBoundingClientRect().top)
      )
    await expect.poll(() => new Set(tops()).size).toBeLessThanOrEqual(2)
    await page.viewport(390, 844)
    await expect
      .poll(() => {
        const [a = 0, b = 0, c = 0, d = 0] = tops()
        return a < b && b < c && c < d
      })
      .toBe(true)
  })
})
