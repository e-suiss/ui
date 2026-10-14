import { describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"

import { PriceCare } from "@/components/blocks/price-care"

const devices = [
  {
    name: "Phone Pro",
    alt: "An orange phone on a warm gradient",
    options: [
      { label: "Annual", price: 99.99, theft: 50 },
      { label: "Monthly", price: 9.99, theft: 5 },
    ],
  },
  {
    name: "Book Air",
    alt: "A laptop on a wooden sideboard",
    options: [
      { label: "3-year", price: 279, theft: 0 },
      { label: "Annual", price: 99.99, theft: 0 },
    ],
  },
  {
    name: "Watch",
    alt: "A smartwatch with a white band",
    options: [
      { label: "2-year", price: 79, theft: 0 },
      { label: "Monthly", price: 3.99, theft: 0 },
    ],
  },
]

const money = (value: number) =>
  value.toLocaleString("en-US", { style: "currency", currency: "USD" })

const device = (name: string) =>
  page.getByRole("group", { name: "Device" }).getByRole("button", { name })
const option = (label: string) =>
  page.getByRole("radio", { name: new RegExp(`^${label} payment`) })
const theft = () =>
  page.getByRole("switch", { name: "Add theft and loss protection" })

const total = () =>
  page.getByText("Total", { exact: true }).element().nextElementSibling
    ?.textContent

function options() {
  return Array.from(
    document.querySelectorAll<HTMLElement>("[role=radiogroup] label"),
    (label) =>
      `${label.querySelector(".font-semibold")?.textContent} ${label.querySelector(".tabular-nums")?.textContent}`
  )
}

function shown() {
  return Array.from(
    document.querySelectorAll<HTMLImageElement>("img[data-active]"),
    (image) => image.alt
  )
}

describe("PriceCare", () => {
  it("starts on the phone with annual payment", async () => {
    await render(<PriceCare />)
    await expect
      .element(device("Phone Pro"))
      .toHaveAttribute("aria-pressed", "true")
    await expect.element(option("Annual")).toBeChecked()
    expect(total()).toBe(money(99.99))
    await expect.element(theft()).not.toBeChecked()
    expect(shown()).toEqual(["An orange phone on a warm gradient"])
    expect(page.getByRole("img").elements()).toHaveLength(1)
  })

  it.each(devices)(
    "switches to $name with its own payment options",
    async (item) => {
      await render(<PriceCare />)
      await device(item.name).click()
      await expect
        .element(device(item.name))
        .toHaveAttribute("aria-pressed", "true")
      expect(options()).toEqual(
        item.options.map(
          (entry) => `${entry.label} payment ${money(entry.price)}`
        )
      )
      const [first] = item.options
      await expect.element(option(first?.label ?? "")).toBeChecked()
      expect(total()).toBe(money(first?.price ?? 0))
      expect(shown()).toEqual([item.alt])
      await expect
        .element(page.getByRole("img", { name: item.alt }))
        .toBeInTheDocument()
    }
  )

  it.each(
    devices.flatMap((item) =>
      item.options.map(
        (entry) => [item.name, entry.label, entry.price] as const
      )
    )
  )("totals %s with %s payment", async (name, label, price) => {
    await render(<PriceCare />)
    await device(name).click()
    await option(label).click()
    await expect.element(option(label)).toBeChecked()
    await expect.poll(total).toBe(money(price))
  })

  it.each(devices[0]?.options ?? [])(
    "adds theft and loss protection to $label payment",
    async (entry) => {
      await render(<PriceCare />)
      await option(entry.label).click()
      await theft().click()
      await expect.element(theft()).toBeChecked()
      await expect.poll(total).toBe(money(entry.price + entry.theft))
      await theft().click()
      await expect.poll(total).toBe(money(entry.price))
    }
  )

  it("only offers theft protection for the phone", async () => {
    await render(<PriceCare />)
    await theft().click()
    await expect.poll(total).toBe(money(149.99))
    await device("Watch").click()
    await expect.element(theft()).not.toBeInTheDocument()
    expect(total()).toBe(money(79))
    await device("Book Air").click()
    await expect.element(theft()).not.toBeInTheDocument()
    expect(total()).toBe(money(279))
  })

  it("resets the payment option when the device changes", async () => {
    await render(<PriceCare />)
    await option("Monthly").click()
    await expect.poll(total).toBe(money(9.99))
    await device("Watch").click()
    await expect.element(option("2-year")).toBeChecked()
    await device("Phone Pro").click()
    await expect.element(option("Annual")).toBeChecked()
    await expect.poll(total).toBe(money(99.99))
  })

  it("keeps the device when its button is pressed again", async () => {
    await render(<PriceCare />)
    await option("Monthly").click()
    await device("Phone Pro").click()
    await expect
      .element(device("Phone Pro"))
      .toHaveAttribute("aria-pressed", "true")
    await expect.element(option("Monthly")).toBeChecked()
  })
})
