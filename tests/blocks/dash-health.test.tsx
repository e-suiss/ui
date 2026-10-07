import { afterEach, describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"

import { DashHealth } from "@/components/blocks/dash-health"

afterEach(async () => {
  await page.viewport(1280, 800)
})

const cards = () =>
  Array.from(
    document.querySelectorAll<HTMLElement>("ul > li > a[href^='#']"),
    (card) => card.querySelector(".flex-1")?.textContent
  )

const dimmed = () =>
  Array.from(
    document.querySelectorAll<HTMLElement>("ul > li > a[data-dimmed]"),
    (card) => card.querySelector(".flex-1")?.textContent
  )

const navItem = (name: string) =>
  page.getByRole("button", { name, exact: true })

const button = (name: string) => page.getByRole("button", { name, exact: true })

const RESTING_HEART_RATE = /^Resting Heart Rate/

const pinned = ["Move", "Steps", "Resting Heart Rate", "Sleep"]

describe("DashHealth", () => {
  it("shows the pinned metrics on the summary", async () => {
    await render(<DashHealth />)
    await expect
      .element(page.getByRole("heading", { level: 1 }))
      .toHaveTextContent("Summary")
    await expect
      .element(page.getByRole("heading", { name: "Pinned" }))
      .toBeVisible()
    await expect.poll(cards).toEqual(pinned)
    await expect
      .element(page.getByRole("link", { name: RESTING_HEART_RATE }))
      .toHaveAttribute("href", "#resting-heart-rate")
    await expect.element(page.getByText("7 hr 12 min")).toBeVisible()
  })

  it("lists every metric while editing with pin controls", async () => {
    await render(<DashHealth />)
    await button("Edit").click()
    await expect.element(button("Done")).toHaveAttribute("data-editing", "")
    await expect
      .poll(cards)
      .toEqual([
        "Move",
        "Steps",
        "Resting Heart Rate",
        "Sleep",
        "Cardio Fitness",
        "Walking Speed",
      ])
    expect(dimmed()).toEqual(["Cardio Fitness", "Walking Speed"])
    await expect
      .element(button("Unpin Move"))
      .toHaveAttribute("data-pinned", "")
    await expect.element(button("Pin Walking Speed")).toBeVisible()
  })

  it("pins and unpins metrics and keeps the result after done", async () => {
    await render(<DashHealth />)
    await button("Edit").click()
    await button("Pin Walking Speed").click()
    await expect.element(button("Unpin Walking Speed")).toBeVisible()
    await button("Unpin Steps").click()
    await expect.element(button("Pin Steps")).toBeVisible()
    await expect.poll(dimmed).toEqual(["Steps", "Cardio Fitness"])
    await button("Done").click()
    await expect
      .poll(cards)
      .toEqual(["Move", "Resting Heart Rate", "Sleep", "Walking Speed"])
    expect(
      document.querySelector("[aria-label^=Pin], [aria-label^=Unpin]")
    ).toBeNull()
  })

  it("explains an empty summary once everything is unpinned", async () => {
    await render(<DashHealth />)
    await button("Edit").click()
    for (const label of pinned) await button(`Unpin ${label}`).click()
    await expect.poll(dimmed).toHaveLength(6)
    await button("Done").click()
    await expect
      .element(page.getByText("No pinned items. Use Edit to add some."))
      .toBeVisible()
    expect(cards()).toEqual([])
  })

  it.each([
    ["Activity", ["Move", "Steps"]],
    ["Heart", ["Resting Heart Rate", "Cardio Fitness"]],
    ["Sleep", ["Sleep"]],
    ["Mobility", ["Walking Speed"]],
  ])("filters the %s category to the last 7 days", async (name, expected) => {
    await render(<DashHealth />)
    await navItem(name).click()
    await expect
      .element(page.getByRole("heading", { level: 1 }))
      .toHaveTextContent(name)
    await expect
      .element(page.getByRole("heading", { name: "Last 7 days" }))
      .toBeVisible()
    await expect.poll(cards).toEqual(expected)
    expect(document.querySelector("[data-editing]")).toBeNull()
    await expect.element(button("Edit")).not.toBeInTheDocument()
  })

  it("leaves edit mode when switching sections", async () => {
    await render(<DashHealth />)
    await button("Edit").click()
    await navItem("Heart").click()
    await navItem("Summary").click()
    await expect.element(button("Edit")).toBeVisible()
    await expect.poll(cards).toEqual(pinned)
  })

  it("shows an empty sharing page", async () => {
    await render(<DashHealth />)
    await navItem("Sharing").click()
    await expect
      .element(page.getByRole("heading", { level: 1 }))
      .toHaveTextContent("Sharing")
    await expect.poll(cards).toEqual([])
    expect(document.querySelector("ul > li > a[href^='#']")).toBeNull()
  })
})
