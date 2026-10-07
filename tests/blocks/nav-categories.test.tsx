import { afterEach, describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"

import { NavCategories } from "@/components/blocks/nav-categories"

const LATEST = /^Take a look at what's new in/

afterEach(async () => {
  await page.viewport(1280, 800)
})

const labels = [
  "Laptop",
  "Phone",
  "Pad",
  "Watch",
  "Pods",
  "Cases",
  "Camera",
  "Colors",
  "Pro",
  "Accessories",
]

const carousel = () => page.getByRole("region", { name: "Categories" })
const category = (name: string) =>
  carousel().getByRole("button", { name, exact: true })
const latest = () => page.getByText(LATEST)
const previous = () => page.getByRole("button", { name: "Previous slide" })
const next = () => page.getByRole("button", { name: "Next slide" })

function pressed() {
  return labels.filter(
    (label) => category(label).element().getAttribute("aria-pressed") === "true"
  )
}

describe("NavCategories", () => {
  it("lists every category with phone selected", async () => {
    await render(<NavCategories />)
    await expect.element(category("Phone")).toBeVisible()
    for (const label of labels) {
      await expect.element(category(label)).toBeInTheDocument()
    }
    expect(pressed()).toEqual(["Phone"])
    await expect
      .element(latest())
      .toHaveTextContent("Take a look at what's new in Phone.")
  })

  it("selects one category at a time and updates the latest line", async () => {
    await render(<NavCategories />)
    await category("Watch").click()
    await expect.poll(pressed).toEqual(["Watch"])
    await expect
      .element(latest())
      .toHaveTextContent("Take a look at what's new in Watch.")
    await category("Laptop").click()
    await expect.poll(pressed).toEqual(["Laptop"])
    await expect
      .element(latest())
      .toHaveTextContent("Take a look at what's new in Laptop.")
  })

  it("keeps the selection when the selected category is pressed again", async () => {
    await render(<NavCategories />)
    await category("Phone").click()
    await expect.poll(pressed).toEqual(["Phone"])
    await expect
      .element(latest())
      .toHaveTextContent("Take a look at what's new in Phone.")
  })

  it("scrolls the strip on a phone to reach the last category", async () => {
    await page.viewport(390, 844)
    await render(<NavCategories />)
    await expect.element(previous()).toBeDisabled()
    await expect.element(next()).toBeEnabled()
    const before = category("Accessories")
      .element()
      .getBoundingClientRect().left
    expect(before).toBeGreaterThan(390)

    await next().click()
    await expect.element(previous()).toBeEnabled()
    await expect
      .poll(
        () => category("Accessories").element().getBoundingClientRect().left
      )
      .toBeLessThan(before)

    for (
      let index = 0;
      index < 12 && !next().element().hasAttribute("disabled");
      index++
    ) {
      await next().click()
    }
    await expect.element(next()).toBeDisabled()
    await expect
      .poll(
        () => category("Accessories").element().getBoundingClientRect().right
      )
      .toBeLessThan(391)
    await category("Accessories").click()
    await expect.poll(pressed).toEqual(["Accessories"])
    await expect
      .element(latest())
      .toHaveTextContent("Take a look at what's new in Accessories.")
  })
})
