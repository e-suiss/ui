import { afterEach, describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import { PriceBundle } from "@/components/blocks/price-bundle"

const SAVING = /^Save \$\d+ compared/

afterEach(async () => {
  await page.viewport(1280, 800)
})

const services = [
  "suiss Music",
  "suiss TV",
  "suiss Arcade",
  "suiss Cloud+",
  "Fitness+",
  "News+",
]

const plans = [
  {
    name: "Individual",
    price: "$19.95",
    storage: "50 GB",
    included: 4,
    saving: 6,
  },
  {
    name: "Family",
    price: "$25.95",
    storage: "200 GB",
    included: 4,
    saving: 8,
  },
  {
    name: "Premier",
    price: "$37.95",
    storage: "2 TB",
    included: 6,
    saving: 29,
  },
]

const radio = (name: string) =>
  page.getByRole("radio", { name: new RegExp(`^${name}\\b`) })
const saving = () => page.getByRole("link", { name: SAVING })

function card(name: string) {
  const label = radio(name).element().closest("label")
  if (!label) throw new Error(`${name} card not rendered`)
  return label
}

function included(name: string) {
  return Array.from(
    card(name).querySelectorAll<HTMLElement>("li[data-included]"),
    (item) => item.textContent
  )
}

function excluded(name: string) {
  return Array.from(
    card(name).querySelectorAll<HTMLElement>("li:not([data-included])"),
    (item) => item.textContent
  )
}

describe("PriceBundle", () => {
  it("preselects the family plan", async () => {
    await render(<PriceBundle />)
    await expect.element(radio("Family")).toBeChecked()
    await expect.element(radio("Individual")).not.toBeChecked()
    await expect
      .element(saving())
      .toHaveAccessibleName("Save $8 compared to buying separately ›")
  })

  it.each(plans)("lists what the $name plan includes", async (plan) => {
    await render(<PriceBundle />)
    await expect.element(radio(plan.name)).toBeInTheDocument()
    expect(card(plan.name).textContent).toContain(`${plan.price} /mo`)
    const names = services.map((service) =>
      service === "suiss Cloud+" ? `${service} ${plan.storage}` : service
    )
    expect(included(plan.name)).toEqual(names.slice(0, plan.included))
    expect(excluded(plan.name)).toEqual(
      names.slice(plan.included).map((name) => `${name}(not included)`)
    )
  })

  it.each(plans)("shows the saving for the $name plan", async (plan) => {
    await render(<PriceBundle />)
    await card(plan.name).click()
    await expect.element(radio(plan.name)).toBeChecked()
    await expect
      .element(saving())
      .toHaveAccessibleName(
        `Save $${plan.saving} compared to buying separately ›`
      )
    for (const other of plans.filter((item) => item !== plan)) {
      await expect.element(radio(other.name)).not.toBeChecked()
    }
  })

  it("moves between plans with the arrow keys", async () => {
    await render(<PriceBundle />)
    await card("Family").click()
    await expect.element(radio("Family")).toHaveFocus()
    await userEvent.keyboard("{ArrowRight}")
    await expect.element(radio("Premier")).toBeChecked()
    await expect
      .element(saving())
      .toHaveAccessibleName("Save $29 compared to buying separately ›")
    await userEvent.keyboard("{ArrowLeft}{ArrowLeft}")
    await expect.element(radio("Individual")).toBeChecked()
  })

  it("stacks the plans on a phone", async () => {
    await render(<PriceBundle />)
    const tops = () =>
      plans.map((plan) =>
        Math.round(card(plan.name).getBoundingClientRect().top)
      )
    await expect.poll(() => new Set(tops()).size).toBe(1)
    await page.viewport(390, 844)
    await expect
      .poll(() => {
        const [a = 0, b = 0, c = 0] = tops()
        return a < b && b < c
      })
      .toBe(true)
  })
})
