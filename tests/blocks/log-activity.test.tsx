import { afterEach, describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import { LogActivity } from "@/components/blocks/log-activity"

const PRICE_CHANGE = /Jamie Rivera updated/
const ROLE_CHANGE = /changed a role/
const PUBLISHED = /Morgan Lee published/

afterEach(async () => {
  await page.viewport(1280, 800)
  window.history.replaceState(null, "", window.location.pathname)
})

const type = () => page.getByRole("combobox", { name: "Type" })
const selected = () =>
  type().element().querySelector("[data-slot=select-value]")?.textContent

function days() {
  return Array.from(
    document.querySelectorAll<HTMLElement>("main section > h2, section > h2"),
    (heading) => heading.textContent
  ).filter((text) => text === "Today" || text === "Yesterday")
}

function targets() {
  return Array.from(
    document.querySelectorAll<HTMLElement>("li .text-xs.text-label-secondary"),
    (node) => node.textContent
  )
}

async function choose(kind: string) {
  await type().click()
  await page.getByRole("option", { name: kind, exact: true }).click()
  await expect.poll(selected).toBe(kind)
}

describe("LogActivity", () => {
  it("lists every event grouped by day", async () => {
    await render(<LogActivity />)
    await expect
      .element(page.getByRole("heading", { name: "Activity log" }))
      .toBeVisible()
    await expect.poll(days).toEqual(["Today", "Yesterday"])
    expect(targets()).toEqual([
      "Price: Phone Pro",
      "Blog: October campaign",
      "5 failed sign-ins · 85.104.x.x",
      "Order W1044 · $999",
      "Taylor Kim: Editor → Viewer",
      "Product: MagCharge Wallet",
    ])
    expect(selected()).toBe("All")
  })

  it.each([
    ["Price", ["Today"], ["Price: Phone Pro"]],
    [
      "Content",
      ["Today", "Yesterday"],
      ["Blog: October campaign", "Product: MagCharge Wallet"],
    ],
    ["Security", ["Today"], ["5 failed sign-ins · 85.104.x.x"]],
    ["Order", ["Yesterday"], ["Order W1044 · $999"]],
    ["User", ["Yesterday"], ["Taylor Kim: Editor → Viewer"]],
  ])("filters to %s events", async (kind, groups, list) => {
    await render(<LogActivity />)
    await choose(kind)
    await expect.poll(targets).toEqual(list)
    expect(days()).toEqual(groups)
  })

  it("goes back to every event", async () => {
    await render(<LogActivity />)
    await choose("Order")
    await expect.poll(targets).toHaveLength(1)
    await choose("All")
    await expect.poll(targets).toHaveLength(6)
  })

  it("offers every event type", async () => {
    await render(<LogActivity />)
    await type().click()
    await expect
      .poll(() =>
        page
          .getByRole("option")
          .elements()
          .map((option) => option.textContent)
      )
      .toEqual(["All", "Price", "Content", "Security", "Order", "User"])
    await userEvent.keyboard("{Escape}")
  })

  it("expands a change to show its before and after values", async () => {
    await render(<LogActivity />)
    const price = page.getByRole("button", { name: PRICE_CHANGE })
    await expect.element(price).toHaveAttribute("aria-expanded", "false")
    await expect.element(page.getByText("$1,049")).not.toBeInTheDocument()
    await price.click()
    await expect.element(price).toHaveAttribute("aria-expanded", "true")
    await expect.element(page.getByText("$1,049")).toBeVisible()
    await expect.element(page.getByText("$1,099")).toBeVisible()
    await price.click()
    await expect.element(price).toHaveAttribute("aria-expanded", "false")
    await expect.element(page.getByText("$1,049")).not.toBeInTheDocument()
  })

  it("only lets events with a change expand", async () => {
    await render(<LogActivity />)
    await expect.poll(targets).toHaveLength(6)
    expect(
      page.getByRole("button", { name: ROLE_CHANGE }).elements()
    ).toHaveLength(1)
    expect(
      page.getByRole("button", { name: PUBLISHED }).elements()
    ).toHaveLength(0)
  })

  it("keeps the admin navigation on the activity page", async () => {
    await render(<LogActivity />)
    await expect
      .element(
        page
          .getByRole("button", { name: "Activity" })
          .or(page.getByRole("link", { name: "Activity" }))
      )
      .toHaveAttribute("aria-current", "page")
  })
})
