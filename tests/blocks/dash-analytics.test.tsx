import { afterEach, describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import { DashAnalytics } from "@/components/blocks/dash-analytics"

afterEach(async () => {
  await page.viewport(1280, 800)
})

const headline = () =>
  document.querySelector("[aria-live=polite]")?.textContent ?? ""

const change = () =>
  document.querySelector("[aria-live=polite]")?.nextElementSibling?.textContent

const regions = () =>
  Array.from(
    document.querySelectorAll<HTMLElement>("[role=listitem]"),
    (row) =>
      `${row.querySelector("[data-slot=item-title]")?.textContent} ${row.querySelector(".tabular-nums")?.textContent}`
  )

const metric = (name: string) => page.getByRole("button", { name, exact: true })

const navItem = (name: string) =>
  page.getByRole("button", { name, exact: true })

describe("DashAnalytics", () => {
  it("opens on this week's downloads with regional shares", async () => {
    await render(<DashAnalytics />)
    await expect
      .element(page.getByRole("heading", { level: 1 }))
      .toHaveTextContent("Route")
    await expect
      .element(metric("Downloads"))
      .toHaveAttribute("aria-pressed", "true")
    expect(headline()).toBe("This week · Downloads5.6 K")
    expect(change()).toBe("+15%")
    expect(regions()).toEqual([
      "United States 2.6 K",
      "Germany 1.2 K",
      "United Kingdom 0.8 K",
      "Netherlands 0.5 K",
    ])
  })

  it.each([
    ["Impressions", "34.0 K", "+12%", "United States 15.6 K"],
    ["Revenue", "21.0 K $", "+18%", "United States 9.7 K $"],
    ["Sessions", "71.0 K", "+21%", "United States 32.7 K"],
  ])(
    "switches the chart and totals to %s",
    async (name, latest, delta, firstRegion) => {
      await render(<DashAnalytics />)
      await metric(name).click()
      await expect.poll(headline).toBe(`This week · ${name}${latest}`)
      expect(change()).toBe(delta)
      expect(regions()[0]).toBe(firstRegion)
      await expect.element(metric(name)).toHaveAttribute("aria-pressed", "true")
      await expect
        .element(metric("Downloads"))
        .toHaveAttribute("aria-pressed", "false")
    }
  )

  it("keeps the metric when the pressed one is clicked again", async () => {
    await render(<DashAnalytics />)
    await metric("Downloads").click()
    await expect
      .element(metric("Downloads"))
      .toHaveAttribute("aria-pressed", "true")
    expect(headline()).toBe("This week · Downloads5.6 K")
  })

  it.each([
    ["Notebook", "4.0 K", "United States 1.9 K"],
    ["Fitness+", "2.5 K", "United States 1.1 K"],
    ["Analytics", "5.6 K", "United States 2.6 K"],
  ])(
    "scales the numbers for the %s section",
    async (name, latest, firstRegion) => {
      await render(<DashAnalytics />)
      await navItem(name).click()
      await expect
        .element(page.getByRole("heading", { level: 1 }))
        .toHaveTextContent(name)
      await expect.poll(headline).toBe(`This week · Downloads${latest}`)
      expect(regions()[0]).toBe(firstRegion)
    }
  )

  it("reads out the week under the chart cursor and returns to this week on leaving", async () => {
    await render(<DashAnalytics />)
    const chart = page.getByRole("application")
    await expect.element(chart).toBeInTheDocument()
    chart.element().focus()
    await expect.poll(headline).toBe("Week 1 · Downloads2.1 K")
    await userEvent.keyboard("{ArrowRight}")
    await expect.poll(headline).toBe("Week 2 · Downloads2.4 K")
    await userEvent.keyboard("{ArrowRight}")
    await expect.poll(headline).toBe("Week 3 · Downloads2.2 K")
    expect(regions()[0]).toBe("United States 2.6 K")
    await metric("Revenue").click()
    await expect.poll(headline).toBe("This week · Revenue21.0 K $")
  })

  it("moves the sections to a tab bar on a phone", async () => {
    await page.viewport(390, 844)
    await render(<DashAnalytics />)
    await expect
      .poll(() => document.querySelector("[data-slot=tab-bar]"))
      .not.toBeNull()
    const tabs = Array.from(
      document.querySelectorAll<HTMLElement>(
        "[data-slot=tab-bar-item]:not([data-overflow])"
      ),
      (tab) => tab.textContent
    )
    expect(tabs.slice(0, 2)).toEqual(["Route", "Notebook"])
    await page.getByRole("button", { name: "Notebook", exact: true }).click()
    await expect
      .element(page.getByRole("heading", { level: 1 }))
      .toHaveTextContent("Notebook")
    await expect.poll(headline).toBe("This week · Downloads4.0 K")
  })
})
