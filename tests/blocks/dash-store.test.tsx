import { afterEach, describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import { DashStore } from "@/components/blocks/dash-store"

afterEach(async () => {
  await page.viewport(1280, 800)
})

const stats = () =>
  Array.from(
    document.querySelectorAll<HTMLElement>("dl > div"),
    (stat) =>
      `${stat.querySelector("dt")?.textContent} ${stat.querySelector("dd")?.textContent}`
  )

const headline = () =>
  document.querySelector("[aria-live=polite]")?.textContent ?? ""

const orders = () =>
  Array.from(
    document.querySelectorAll<HTMLElement>("[role=listitem]"),
    (row) => row.querySelector("[data-slot=item-title]")?.textContent
  )

const toggle = (name: string) => page.getByRole("button", { name, exact: true })

const dimmedBars = () =>
  Array.from(document.querySelectorAll(".recharts-bar-rectangle path"), (bar) =>
    bar.getAttribute("fill-opacity")
  ).filter((opacity) => opacity === "0.35").length

describe("DashStore", () => {
  it("shows the overview for the last 7 days", async () => {
    await render(<DashStore />)
    await expect
      .element(page.getByRole("heading", { level: 1 }))
      .toHaveTextContent("Overview")
    await expect
      .element(toggle("7 Days"))
      .toHaveAttribute("aria-pressed", "true")
    expect(stats()).toEqual([
      "Revenue $1,284,500",
      "Orders 842",
      "Average order $1,525",
      "Conversion 3.42%",
    ])
    expect(headline()).toBe("Weekly sales$1,284,500")
    expect(orders()).toEqual([
      "Jamie Rivera",
      "Morgan Lee",
      "Riley Chen",
      "Avery Brooks",
      "Taylor Kim",
    ])
  })

  it.each([
    ["24 Hours", "$192,675", "126"],
    ["30 Days", "$5,523,350", "3,621"],
    ["7 Days", "$1,284,500", "842"],
  ])("scales revenue and orders to %s", async (range, revenue, count) => {
    await render(<DashStore />)
    await toggle(range).click()
    await expect
      .poll(stats)
      .toEqual([
        `Revenue ${revenue}`,
        `Orders ${count}`,
        "Average order $1,525",
        "Conversion 3.42%",
      ])
    expect(headline()).toBe(`Weekly sales${revenue}`)
    await expect.element(toggle(range)).toHaveAttribute("aria-pressed", "true")
  })

  it("marks the falling stat as down", async () => {
    await render(<DashStore />)
    const changes = Array.from(
      document.querySelectorAll<HTMLElement>("dl dd:last-child"),
      (change) =>
        `${change.textContent}${change.hasAttribute("data-up") ? " up" : " down"}`
    )
    expect(changes).toEqual([
      "+12.4% vs. previous period up",
      "+8.1% vs. previous period up",
      "−2.3% vs. previous period down",
      "+0.4 pts vs. previous period up",
    ])
  })

  it.each([
    ["Shipped", ["Jamie Rivera"]],
    ["Delivered", ["Riley Chen", "Taylor Kim"]],
    ["Returned", ["Avery Brooks"]],
  ])("filters recent orders to %s", async (status, expected) => {
    await render(<DashStore />)
    await toggle(status).click()
    await expect.poll(orders).toEqual(expected)
    await toggle("All").click()
    await expect.poll(orders).toHaveLength(5)
  })

  it("keeps the filter when the pressed status is clicked again", async () => {
    await render(<DashStore />)
    await toggle("Returned").click()
    await toggle("Returned").click()
    await expect
      .element(toggle("Returned"))
      .toHaveAttribute("aria-pressed", "true")
    expect(orders()).toEqual(["Avery Brooks"])
  })

  it("shows the day total and highlights its bars while browsing the chart", async () => {
    await render(<DashStore />)
    await expect.poll(dimmedBars).toBe(0)
    page.getByRole("application").element().focus()
    await expect.poll(headline).toBe("Mon$88,000")
    await expect.poll(dimmedBars).toBe(12)
    await userEvent.keyboard("{ArrowRight}")
    await expect.poll(headline).toBe("Tue$102,000")
    await toggle("30 Days").click()
    await expect.poll(headline).toBe("Weekly sales$5,523,350")
    await expect.poll(dimmedBars).toBe(0)
  })

  it("renames the page after the picked section", async () => {
    await render(<DashStore />)
    await page
      .getByRole("button", { name: "Fifth Avenue", exact: true })
      .click()
    await expect
      .element(page.getByRole("heading", { level: 1 }))
      .toHaveTextContent("Fifth Avenue")
  })

  it("hides the order status column on a phone", async () => {
    await render(<DashStore />)
    const status = () =>
      page
        .getByText("Returned", { exact: true })
        .last()
        .element()
        .checkVisibility()
    expect(status()).toBe(true)
    await page.viewport(390, 844)
    await expect.poll(status).toBe(false)
    await expect.element(page.getByText("$549", { exact: true })).toBeVisible()
  })
})
