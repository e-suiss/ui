import { afterEach, describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"

import { InboxCategories } from "@/components/blocks/inbox-categories"

afterEach(async () => {
  await page.viewport(1280, 800)
})

const subjects: Record<string, string> = {
  suiss: "Your order has shipped",
  "Morgan Lee": "Tomorrow's meeting",
  "suiss Cloud": "Your storage is almost full",
  "Riley Chen": "Coast trip photos",
  "suiss Store": "Just for you: a Trade In offer",
  "App Store": "Your receipt",
}

const category = (name: string) =>
  page.getByRole("group", { name: "Category" }).getByRole("button", { name })
const dot = (name: string) => category(name).getByText("Unread")
const pane = (kind: string) =>
  document.querySelector<HTMLElement>(`[data-slot=split-view-${kind}]`)
const row = (from: string) =>
  page.getByRole("button").filter({ hasText: subjects[from] })
const reader = () => pane("detail")?.querySelector("h3")?.textContent
const action = (name: string) => page.getByRole("button", { name, exact: true })

function rows() {
  return Array.from(
    pane("list")?.querySelectorAll<HTMLElement>(
      "[data-slot=split-view-item]"
    ) ?? [],
    (item) => item.querySelector(".font-semibold")?.textContent
  )
}

describe("InboxCategories", () => {
  it("opens on primary with the first message in the reader", async () => {
    await render(<InboxCategories />)
    await expect.poll(rows).toEqual(["Morgan Lee", "Riley Chen"])
    await expect
      .element(category("Primary"))
      .toHaveAttribute("aria-pressed", "true")
    await expect
      .element(category("Transactions"))
      .toHaveAttribute("aria-pressed", "false")
    expect(reader()).toBe("Tomorrow's meeting")
    await expect
      .element(row("Morgan Lee"))
      .toHaveAttribute("aria-current", "true")
  })

  it("marks the unpressed categories that hold unread mail", async () => {
    await render(<InboxCategories />)
    await expect.element(dot("Transactions")).toBeInTheDocument()
    await expect.element(dot("Updates")).toBeInTheDocument()
    await expect.element(dot("Promotions")).not.toBeInTheDocument()
    await expect.element(dot("Primary")).not.toBeInTheDocument()
  })

  it.each([
    ["Transactions", ["suiss", "App Store"], "Your order has shipped"],
    ["Updates", ["suiss Cloud"], "Your storage is almost full"],
    ["Promotions", ["suiss Store"], "Just for you: a Trade In offer"],
  ])(
    "switches to %s and opens its first message",
    async (name, from, subject) => {
      await render(<InboxCategories />)
      await category(name).click()
      await expect.poll(rows).toEqual(from)
      await expect
        .element(category(name))
        .toHaveAttribute("aria-pressed", "true")
      await expect
        .element(category("Primary"))
        .toHaveAttribute("aria-pressed", "false")
      expect(reader()).toBe(subject)
    }
  )

  it("keeps the current category when it is pressed again", async () => {
    await render(<InboxCategories />)
    await category("Primary").click()
    await expect
      .element(category("Primary"))
      .toHaveAttribute("aria-pressed", "true")
    expect(rows()).toEqual(["Morgan Lee", "Riley Chen"])
  })

  it("clears a category's unread mark once its mail is read", async () => {
    await render(<InboxCategories />)
    await category("Updates").click()
    await row("suiss Cloud").click()
    await expect
      .element(row("suiss Cloud").getByText("Unread"))
      .not.toBeInTheDocument()
    await category("Primary").click()
    await expect.element(dot("Updates")).not.toBeInTheDocument()
    await expect.element(dot("Transactions")).toBeInTheDocument()
  })

  it("stars a message from the reader", async () => {
    await render(<InboxCategories />)
    await action("Star").click()
    await expect
      .element(action("Unstar"))
      .toHaveAttribute("aria-pressed", "true")
    await expect
      .element(row("Morgan Lee").getByLabelText("Starred"))
      .toBeInTheDocument()
    await action("Unstar").click()
    await expect
      .element(row("Morgan Lee").getByLabelText("Starred"))
      .not.toBeInTheDocument()
  })

  it("archives within the category until it is empty", async () => {
    await render(<InboxCategories />)
    await category("Transactions").click()
    await action("Archive").click()
    await expect.poll(rows).toEqual(["App Store"])
    expect(reader()).toBe("Your receipt")
    await action("Delete").click()
    await expect.poll(rows).toEqual([])
    await expect
      .element(page.getByText("No messages in Transactions."))
      .toBeVisible()
    await expect.element(page.getByText("No Message Selected")).toBeVisible()
    await expect.element(dot("Transactions")).not.toBeInTheDocument()
    await category("Primary").click()
    await expect.poll(rows).toEqual(["Morgan Lee", "Riley Chen"])
    await expect.element(dot("Transactions")).not.toBeInTheDocument()
  })

  it("opens a message in its own column on a phone", async () => {
    await page.viewport(390, 844)
    await render(<InboxCategories />)
    await expect.poll(() => pane("list")).not.toBeNull()
    expect(pane("detail")).toBeNull()
    await row("Riley Chen").click()
    await expect.poll(reader).toBe("Coast trip photos")
    expect(pane("list")).toBeNull()
    await page.getByRole("button", { name: "Inbox", exact: true }).click()
    await expect.poll(() => pane("list")).not.toBeNull()
    await expect
      .element(row("Riley Chen"))
      .toHaveAttribute("aria-current", "true")
  })
})
