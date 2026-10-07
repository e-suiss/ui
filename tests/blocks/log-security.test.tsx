import { afterEach, describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"

import { LogSecurity } from "@/components/blocks/log-security"

const RESOLVED_ATTEMPTS = /^Resolved · 85\.104\.x\.x/

afterEach(() => {
  window.history.replaceState(null, "", window.location.pathname)
})

const weights = { High: 18, Medium: 8, Low: 3 }

const alerts = {
  location: "Sign-in from an unusual location",
  attempts: "5 failed sign-in attempts",
  key: "API key expires in 7 days",
  twoFactor: "Two-factor authentication is off",
}

const filter = (name: string) =>
  page.getByRole("group", { name: "Filter" }).getByRole("button", { name })
const alert = (title: string) =>
  page.getByRole("listitem").filter({ hasText: title })
const resolve = (title: string) =>
  alert(title).getByRole("button", { name: "Resolve" })
const reopen = (title: string) =>
  alert(title).getByRole("button", { name: "Reopen" })

const summary = () =>
  page.getByRole("heading", { name: "Security" }).element().nextElementSibling
    ?.textContent

function score() {
  return Number(
    page.getByText("Security score").element().nextElementSibling?.textContent
  )
}

function ring() {
  const node = document.querySelectorAll("svg[aria-hidden] circle")[1]
  return node?.getAttribute("stroke-dasharray")
}

function tone() {
  const svg = document.querySelector<SVGElement>("svg.-rotate-90")
  if (!svg) throw new Error("score ring not rendered")
  return getComputedStyle(svg).color
}

function counts() {
  return ["High", "Medium", "Low"].map(
    (level) =>
      page.getByText(level, { exact: true }).element().nextElementSibling
        ?.textContent
  )
}

function titles() {
  return Array.from(
    document.querySelectorAll<HTMLElement>("li .font-semibold"),
    (node) => node.textContent
  )
}

describe("LogSecurity", () => {
  it("scores the open alerts by severity", async () => {
    await render(<LogSecurity />)
    const expected = 100 - weights.High - 2 * weights.Medium - weights.Low
    await expect.poll(score).toBe(expected)
    expect(ring()).toBe(`${expected} 100`)
    expect(counts()).toEqual(["1", "2", "1"])
    expect(summary()).toBe("4 open alerts")
    await expect.element(filter("Open")).toHaveAttribute("aria-pressed", "true")
    expect(titles()).toEqual(Object.values(alerts))
  })

  it("raises the score as alerts are resolved and recolours the ring", async () => {
    await render(<LogSecurity />)
    await expect.poll(score).toBe(63)
    const red = tone()

    await resolve(alerts.location).click()
    await expect.poll(score).toBe(81)
    expect(ring()).toBe("81 100")
    expect(counts()).toEqual(["0", "2", "1"])
    expect(summary()).toBe("3 open alerts")
    await expect.poll(tone).not.toBe(red)
    const orange = tone()

    await resolve(alerts.key).click()
    await expect.poll(score).toBe(89)
    await expect.poll(tone).not.toBe(orange)
    expect(tone()).not.toBe(red)
    expect(counts()).toEqual(["0", "1", "1"])
  })

  it("moves a resolved alert out of the open list", async () => {
    await render(<LogSecurity />)
    await resolve(alerts.attempts).click()
    await expect
      .poll(titles)
      .toEqual([alerts.location, alerts.key, alerts.twoFactor])
    await filter("Resolved").click()
    await expect.poll(titles).toEqual([alerts.attempts])
    await expect
      .element(alert(alerts.attempts).getByText(RESOLVED_ATTEMPTS))
      .toBeVisible()
    await filter("All").click()
    await expect.poll(titles).toEqual(Object.values(alerts))
    await expect.element(reopen(alerts.attempts)).toBeVisible()
    await expect.element(resolve(alerts.location)).toBeVisible()
  })

  it("reopens an alert and lowers the score again", async () => {
    await render(<LogSecurity />)
    await resolve(alerts.twoFactor).click()
    await expect.poll(score).toBe(66)
    await filter("Resolved").click()
    await reopen(alerts.twoFactor).click()
    await expect.poll(titles).toEqual([])
    await expect.element(page.getByText("Nothing here yet.")).toBeVisible()
    expect(score()).toBe(63)
    expect(counts()).toEqual(["1", "2", "1"])
  })

  it("celebrates when every alert is resolved", async () => {
    await render(<LogSecurity />)
    for (const title of Object.values(alerts)) {
      await resolve(title).click()
    }
    await expect.poll(score).toBe(100)
    expect(ring()).toBe("100 100")
    expect(summary()).toBe("No open alerts")
    expect(counts()).toEqual(["0", "0", "0"])
    await expect
      .element(page.getByText("No open alerts. All good."))
      .toBeVisible()
  })

  it("starts with nothing resolved", async () => {
    await render(<LogSecurity />)
    await filter("Resolved").click()
    await expect
      .element(filter("Resolved"))
      .toHaveAttribute("aria-pressed", "true")
    await expect.element(page.getByText("Nothing here yet.")).toBeVisible()
    await filter("Resolved").click()
    await expect
      .element(filter("Resolved"))
      .toHaveAttribute("aria-pressed", "true")
  })
})
