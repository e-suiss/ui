import { afterEach, describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"

import { GridLineup } from "@/components/blocks/grid-lineup"

afterEach(async () => {
  await page.viewport(1280, 800)
})

const lineup = [
  {
    name: "Phone Pro",
    price: "From $1,099",
    finishes: ["Cosmic Orange", "Deep Blue", "Silver"],
  },
  {
    name: "Phone Air",
    price: "From $999",
    finishes: ["Sky Blue", "Light Gold", "Space Black"],
  },
  {
    name: "Phone",
    price: "From $799",
    finishes: ["Lavender", "Sage", "Mist Blue", "Black"],
  },
  { name: "Phone e", price: "From $599", finishes: ["Black", "White"] },
]

const picker = (model: string) =>
  page.getByRole("group", { name: `${model} finish`, exact: true })
const swatch = (model: string, finish: string) =>
  picker(model).getByRole("button", { name: finish, exact: true })

function pressed(model: string) {
  return picker(model)
    .getByRole("button")
    .elements()
    .filter((button) => button.getAttribute("aria-pressed") === "true")
    .map((button) => button.getAttribute("aria-label"))
}

function cardTops() {
  return lineup.map((model) =>
    Math.round(picker(model.name).element().getBoundingClientRect().top)
  )
}

describe("GridLineup", () => {
  it("shows every model with its price and first finish selected", async () => {
    await render(<GridLineup />)
    await expect
      .element(
        page.getByRole("heading", { name: "Which phone is right for you?" })
      )
      .toBeVisible()
    for (const model of lineup) {
      await expect
        .element(page.getByRole("heading", { name: model.name, exact: true }))
        .toBeVisible()
      await expect.element(page.getByText(model.price)).toBeVisible()
      expect(
        picker(model.name)
          .getByRole("button")
          .elements()
          .map((button) => button.getAttribute("aria-label"))
      ).toEqual(model.finishes)
      expect(pressed(model.name)).toEqual([model.finishes[0]])
    }
    expect(page.getByRole("button", { name: "Buy" }).elements()).toHaveLength(4)
  })

  it("picks a finish for one model without touching the others", async () => {
    await render(<GridLineup />)
    await swatch("Phone", "Sage").click()
    await expect.poll(() => pressed("Phone")).toEqual(["Sage"])
    expect(pressed("Phone e")).toEqual(["Black"])
    expect(pressed("Phone Pro")).toEqual(["Cosmic Orange"])

    await swatch("Phone e", "White").click()
    await expect.poll(() => pressed("Phone e")).toEqual(["White"])
    expect(pressed("Phone")).toEqual(["Sage"])
  })

  it("keeps a finish selected when it is pressed again", async () => {
    await render(<GridLineup />)
    await swatch("Phone Air", "Light Gold").click()
    await expect.poll(() => pressed("Phone Air")).toEqual(["Light Gold"])
    await swatch("Phone Air", "Light Gold").click()
    await expect.poll(() => pressed("Phone Air")).toEqual(["Light Gold"])
  })

  it("lays the lineup out in one row on desktop and two on a phone", async () => {
    await render(<GridLineup />)
    await expect.poll(() => new Set(cardTops()).size).toBe(1)
    await page.viewport(390, 844)
    await expect
      .poll(() => {
        const [a, b, c, d] = cardTops()
        return a === b && c === d && (c ?? 0) > (a ?? 0)
      })
      .toBe(true)
  })
})
