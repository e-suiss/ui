import { afterEach, describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import { InboxSupport } from "@/components/blocks/inbox-support"

afterEach(async () => {
  await page.viewport(1280, 800)
})

const pane = (kind: string) =>
  document.querySelector<HTMLElement>(`[data-slot=split-view-${kind}]`)
const view = (name: string) =>
  page
    .getByRole("region", { name: "Support" })
    .getByRole("button", { name: new RegExp(`^${name}`) })
const ticket = (title: string) =>
  page.getByRole("button").filter({ hasText: title })
const status = (name: string) =>
  page.getByRole("group", { name: "Status" }).getByRole("button", { name })
const reply = () => page.getByRole("textbox", { name: "Reply" })
const send = () => page.getByRole("button", { name: "Send and set pending" })
const solve = () => page.getByRole("button", { name: "Mark as solved" })
const reader = () => pane("detail")?.querySelector("h3")?.textContent

function count(name: string) {
  return view(name).element().querySelector(".tabular-nums")?.textContent
}

function counts() {
  return ["Open", "Pending", "Solved", "All"].map(count)
}

function tickets() {
  return Array.from(
    pane("list")?.querySelectorAll<HTMLElement>(
      "[data-slot=split-view-item]"
    ) ?? [],
    (item) => item.querySelector(".text-base")?.textContent
  )
}

function priorities() {
  return Array.from(
    pane("list")?.querySelectorAll<HTMLElement>(".rounded-md.text-2xs") ?? [],
    (badge) => badge.textContent
  )
}

describe("InboxSupport", () => {
  it("opens the open queue with counts per status", async () => {
    await render(<InboxSupport />)
    await expect.poll(tickets).toEqual(["Screen flickers", "Pods won't pair"])
    expect(counts()).toEqual(["2", "1", "1", "4"])
    await expect.element(view("Open")).toHaveAttribute("aria-current", "true")
    expect(reader()).toBe("Screen flickers")
    await expect.element(status("Open")).toHaveAttribute("aria-pressed", "true")
    expect(priorities()).toEqual(["High", "Low"])
  })

  it.each([
    ["Pending", ["Battery drains fast"]],
    ["Solved", ["Cloud backup error"]],
    [
      "All",
      [
        "Screen flickers",
        "Battery drains fast",
        "Pods won't pair",
        "Cloud backup error",
      ],
    ],
  ])("filters the %s view", async (name, titles) => {
    await render(<InboxSupport />)
    await view(name).click()
    await expect.poll(tickets).toEqual(titles)
    await expect.element(view(name)).toHaveAttribute("aria-current", "true")
    await expect.element(view("Open")).not.toHaveAttribute("aria-current")
  })

  it("opens a ticket in the reader", async () => {
    await render(<InboxSupport />)
    await view("Solved").click()
    await ticket("Cloud backup error").click()
    await expect.poll(reader).toBe("Cloud backup error")
    await expect
      .element(page.getByText("#4818 · Phone Air").last())
      .toBeVisible()
    await expect
      .element(status("Solved"))
      .toHaveAttribute("aria-pressed", "true")
    await expect
      .element(ticket("Cloud backup error"))
      .toHaveAttribute("aria-current", "true")
  })

  it("marks a ticket solved and moves it between queues", async () => {
    await render(<InboxSupport />)
    await solve().click()
    await expect.poll(tickets).toEqual(["Pods won't pair"])
    expect(counts()).toEqual(["1", "1", "2", "4"])
    await expect
      .element(status("Solved"))
      .toHaveAttribute("aria-pressed", "true")
    expect(reader()).toBe("Screen flickers")
    await view("Solved").click()
    await expect
      .poll(tickets)
      .toEqual(["Screen flickers", "Cloud backup error"])
  })

  it("changes the status with the status control", async () => {
    await render(<InboxSupport />)
    await status("Pending").click()
    await expect
      .element(status("Pending"))
      .toHaveAttribute("aria-pressed", "true")
    await expect
      .element(status("Open"))
      .toHaveAttribute("aria-pressed", "false")
    expect(counts()).toEqual(["1", "2", "1", "4"])
    await status("Pending").click()
    await expect
      .element(status("Pending"))
      .toHaveAttribute("aria-pressed", "true")
    expect(counts()).toEqual(["1", "2", "1", "4"])
  })

  it("sends a reply and sets the ticket pending", async () => {
    await render(<InboxSupport />)
    await expect.element(send()).toBeDisabled()
    await reply().click()
    await userEvent.keyboard("We are on it.")
    await expect.element(send()).toBeEnabled()
    await send().click()
    await expect.element(reply()).toHaveValue("")
    await expect.element(send()).toBeDisabled()
    await expect
      .element(status("Pending"))
      .toHaveAttribute("aria-pressed", "true")
    expect(counts()).toEqual(["1", "2", "1", "4"])
    await expect.poll(tickets).toEqual(["Pods won't pair"])
  })

  it("shows an empty queue once every open ticket is solved", async () => {
    await render(<InboxSupport />)
    await solve().click()
    await ticket("Pods won't pair").click()
    await solve().click()
    await expect.poll(tickets).toEqual([])
    await expect.element(page.getByText("No tickets")).toBeVisible()
    expect(counts()).toEqual(["0", "1", "3", "4"])
  })

  it("walks back from a ticket to the queues on a phone", async () => {
    await page.viewport(390, 844)
    await render(<InboxSupport />)
    await expect.poll(() => pane("list")).not.toBeNull()
    expect(pane("sidebar")).toBeNull()
    await ticket("Pods won't pair").click()
    await expect.poll(reader).toBe("Pods won't pair")
    expect(pane("list")).toBeNull()
    await page
      .getByRole("button", { name: "Open", exact: true })
      .first()
      .click()
    await expect.poll(() => pane("list")).not.toBeNull()
    await page.getByRole("button", { name: "Support", exact: true }).click()
    await expect.poll(() => pane("sidebar")).not.toBeNull()
    await view("Pending").click()
    await expect.poll(tickets).toEqual(["Battery drains fast"])
  })
})
