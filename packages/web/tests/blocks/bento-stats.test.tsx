import { describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"

import { BentoStats } from "@/components/blocks/bento-stats"

const charge = () =>
  page.getByRole("progressbar", {
    name: "Charge after 20 minutes",
  })

describe("BentoStats", () => {
  it("renders the stat tiles under a heading", async () => {
    await render(<BentoStats />)
    await expect
      .element(page.getByRole("heading", { name: "The full power of Pro." }))
      .toBeVisible()
    await expect
      .element(page.getByRole("heading", { name: "After titanium, aluminum." }))
      .toBeVisible()
    await expect
      .element(page.getByRole("heading", { name: "50% in 20 minutes." }))
      .toBeVisible()
    await expect.element(page.getByText("8x", { exact: true })).toBeVisible()
    await expect
      .element(page.getByText("4K 120", { exact: true }))
      .toBeVisible()
    expect(document.querySelector("section")?.classList.contains("dark")).toBe(
      true
    )
  })

  it("fills the charge meter to half after mounting", async () => {
    await render(<BentoStats />)
    expect(charge().element().getAttribute("aria-valuenow")).toBe("0")
    await expect.element(charge()).toHaveAttribute("aria-valuenow", "50")
  })

  it("stacks the tiles on a phone and lays them out in columns on desktop", async () => {
    const tiles = () => {
      const grid = document.querySelector("section > div.grid")
      return grid
        ? getComputedStyle(grid).gridTemplateColumns.split(" ").length
        : 0
    }
    await render(<BentoStats />)
    expect(tiles()).toBe(3)
    await page.viewport(390, 844)
    await expect.poll(tiles).toBe(1)
    await page.viewport(1280, 800)
  })
})
