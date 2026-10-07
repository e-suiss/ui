import { afterEach, describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"

import { GridAccessories } from "@/components/blocks/grid-accessories"

afterEach(async () => {
  await page.viewport(1280, 800)
})

const products = () =>
  Array.from(
    document.querySelectorAll<HTMLElement>("ul > li > span"),
    (name) => name.textContent
  )

const filter = (name: string) => page.getByRole("button", { name, exact: true })

const bagStatus = () => page.getByRole("status")

const badge = () => bagStatus().element().querySelector("span")?.textContent

describe("GridAccessories", () => {
  it("shows every accessory with an empty bag", async () => {
    await render(<GridAccessories />)
    await expect.element(filter("All")).toHaveAttribute("aria-pressed", "true")
    expect(products()).toHaveLength(8)
    await expect.element(bagStatus()).toHaveAccessibleName("0 items in bag")
    expect(badge()).toBeUndefined()
  })

  it.each([
    ["Audio", ["Pods Studio Headphones", "Pods Sage Headphones"]],
    ["Cases", ["Phone Pro Clear Case", "Phone Silicone Case"]],
    ["Bands", ["Sport Band", "Solo Loop"]],
    ["Pad", ["Keyboard Folio for Pad", "Pencil Pro"]],
  ])("filters to %s", async (category, expected) => {
    await render(<GridAccessories />)
    await filter(category).click()
    await expect.poll(products).toEqual(expected)
    await expect
      .element(filter(category))
      .toHaveAttribute("aria-pressed", "true")
    await filter("All").click()
    await expect.poll(products).toHaveLength(8)
  })

  it("keeps the category when the pressed filter is clicked again", async () => {
    await render(<GridAccessories />)
    await filter("Bands").click()
    await filter("Bands").click()
    await expect
      .element(filter("Bands"))
      .toHaveAttribute("aria-pressed", "true")
    expect(products()).toEqual(["Sport Band", "Solo Loop"])
  })

  it("adds and removes items and keeps the bag across filters", async () => {
    await render(<GridAccessories />)
    const add = page.getByRole("button", { name: "Add Solo Loop to bag" })
    const width = () => add.element().getBoundingClientRect().width
    expect(width()).toBe(30)
    await add.click()
    const remove = page.getByRole("button", {
      name: "Remove Solo Loop from bag",
    })
    await expect.element(remove).toHaveAttribute("aria-pressed", "true")
    await expect.element(remove).toHaveAttribute("data-in-bag", "")
    await expect.element(remove).toHaveTextContent("In bag")
    await expect
      .poll(() => remove.element().getBoundingClientRect().width)
      .toBe(84)
    await expect.element(bagStatus()).toHaveAccessibleName("1 items in bag")

    await filter("Audio").click()
    await page
      .getByRole("button", { name: "Add Pods Sage Headphones to bag" })
      .click()
    await expect.element(bagStatus()).toHaveAccessibleName("2 items in bag")
    expect(badge()).toBe("2")

    await filter("Bands").click()
    await expect.element(remove).toHaveAttribute("aria-pressed", "true")
    await remove.click()
    await expect.element(bagStatus()).toHaveAccessibleName("1 items in bag")
    expect(badge()).toBe("1")
  })

  it("shows two products per row on a phone", async () => {
    const perRow = () => {
      const grid = document.querySelector("section > ul")
      return grid
        ? getComputedStyle(grid).gridTemplateColumns.split(" ").length
        : 0
    }
    await render(<GridAccessories />)
    await expect.poll(perRow).toBeGreaterThan(2)
    await page.viewport(390, 844)
    await expect.poll(perRow).toBe(2)
  })
})
