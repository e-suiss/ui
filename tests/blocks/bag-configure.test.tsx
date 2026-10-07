import { describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"

import { BagConfigure } from "@/components/blocks/bag-configure"

const price = () =>
  document.querySelector("[aria-live=polite]")?.textContent ?? ""

const activeImage = () =>
  document.querySelector<HTMLImageElement>("img[data-active]")?.alt

const TO_BAG = /to Bag/

const addButton = () => page.getByRole("button", { name: TO_BAG })

describe("BagConfigure", () => {
  it("starts on the base model, first finish and included storage", async () => {
    await render(<BagConfigure />)
    await expect
      .element(page.getByRole("heading", { name: "Buy Phone Pro" }))
      .toBeVisible()
    await expect
      .element(page.getByRole("radio", { name: "Phone Pro From $1,099" }))
      .toBeChecked()
    await expect
      .element(page.getByRole("radio", { name: "256 GB Included" }))
      .toBeChecked()
    await expect
      .element(page.getByRole("button", { name: "Cosmic Orange" }))
      .toHaveAttribute("aria-pressed", "true")
    expect(price()).toBe("$1,099.00or $91.58/mo. for 12 mo.")
    expect(activeImage()).toBe("An orange phone on a warm gradient")
  })

  it("prices the model plus the storage upgrade with a monthly split", async () => {
    await render(<BagConfigure />)
    await page.getByText("Phone Pro Max").click()
    await expect.poll(price).toBe("$1,199.00or $99.92/mo. for 12 mo.")
    await page.getByText("1 TB").click()
    await expect.poll(price).toBe("$1,599.00or $133.25/mo. for 12 mo.")
    await page.getByText("512 GB").click()
    await expect.poll(price).toBe("$1,399.00or $116.58/mo. for 12 mo.")
    await page.getByText("Phone Pro", { exact: true }).click()
    await expect.poll(price).toBe("$1,299.00or $108.25/mo. for 12 mo.")
  })

  it("swaps the photo and finish label when a swatch is picked", async () => {
    await render(<BagConfigure />)
    await page.getByRole("button", { name: "Deep Blue" }).click()
    await expect.poll(activeImage).toBe("A phone floating among blue spheres")
    await expect
      .element(page.getByRole("paragraph").filter({ hasText: "Finish." }))
      .toHaveTextContent("Finish. Deep Blue")
    await expect
      .element(page.getByRole("button", { name: "Deep Blue" }))
      .toHaveAttribute("aria-pressed", "true")
    await expect
      .element(page.getByRole("button", { name: "Cosmic Orange" }))
      .toHaveAttribute("aria-pressed", "false")
    expect(document.querySelectorAll("img[aria-hidden=true]")).toHaveLength(2)
  })

  it("keeps a finish selected when the active swatch is pressed again", async () => {
    await render(<BagConfigure />)
    await page.getByRole("button", { name: "Silver" }).click()
    await page.getByRole("button", { name: "Silver" }).click()
    await expect
      .element(page.getByRole("button", { name: "Silver" }))
      .toHaveAttribute("aria-pressed", "true")
    expect(activeImage()).toBe("A silver phone on a light grey background")
  })

  it("confirms the bag and resets it when the configuration changes", async () => {
    await render(<BagConfigure />)
    await addButton().click()
    await expect.element(addButton()).toHaveTextContent("Added to Bag")
    await page.getByText("512 GB").click()
    await expect.element(addButton()).toHaveTextContent("Add to Bag")
    await addButton().click()
    await expect.element(addButton()).toHaveTextContent("Added to Bag")
    await page.getByText("Phone Pro Max").click()
    await expect.element(addButton()).toHaveTextContent("Add to Bag")
  })
})
