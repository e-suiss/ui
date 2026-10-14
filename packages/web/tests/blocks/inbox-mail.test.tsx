import { afterEach, describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import { InboxMail } from "@/components/blocks/inbox-mail"

afterEach(async () => {
  await page.viewport(1280, 800)
})

const sidebar = () => page.getByRole("region", { name: "Mailboxes" })
const mailbox = (name: string) =>
  sidebar().getByRole("button", { name: new RegExp(`^${name}`) })
const pane = (kind: string) =>
  document.querySelector<HTMLElement>(`[data-slot=split-view-${kind}]`)

function count(name: string) {
  const button = mailbox(name).element()
  return button.querySelector(".tabular-nums")?.textContent ?? ""
}

function rows() {
  return Array.from(
    pane("list")?.querySelectorAll<HTMLElement>(
      "[data-slot=split-view-item]"
    ) ?? [],
    (row) => row.querySelector(".font-semibold")?.textContent
  )
}

const subjects: Record<string, string> = {
  suiss: "Your order has shipped",
  "Morgan Lee": "Tomorrow's meeting",
  "suiss Cloud": "Your storage is almost full",
  "Riley Chen": "Coast trip photos",
}
const row = (from: string) =>
  page.getByRole("button").filter({ hasText: subjects[from] })
const reader = () => pane("detail")?.querySelector("h3")?.textContent
const summary = () =>
  pane("list")?.querySelector(".text-2xs")?.textContent ?? ""
const action = (name: string) =>
  page.getByRole("button", { name, exact: true }).last()
const search = () => page.getByRole("searchbox", { name: "Search mail" })

describe("InboxMail", () => {
  it("opens the inbox with unread and starred counts", async () => {
    await render(<InboxMail />)
    await expect
      .poll(rows)
      .toEqual([
        "suiss",
        "Morgan Lee",
        "suiss Cloud",
        "Riley Chen",
        "suiss Store",
        "App Store",
      ])
    await expect
      .element(mailbox("Inbox"))
      .toHaveAttribute("aria-current", "true")
    expect(count("Inbox")).toBe("3")
    expect(count("Starred")).toBe("1")
    expect(count("Sent")).toBe("")
    expect(summary()).toBe("3 unread")
    expect(reader()).toBe("Your order has shipped")
    await expect.element(row("suiss")).toHaveAttribute("aria-current", "true")
  })

  it("marks a message read when it is opened", async () => {
    await render(<InboxMail />)
    await expect
      .element(row("Morgan Lee").getByText("Unread"))
      .toBeInTheDocument()
    await row("Morgan Lee").click()
    await expect.poll(reader).toBe("Tomorrow's meeting")
    await expect
      .element(row("Morgan Lee").getByText("Unread"))
      .not.toBeInTheDocument()
    await expect
      .element(row("Morgan Lee"))
      .toHaveAttribute("aria-current", "true")
    await expect.element(row("suiss")).not.toHaveAttribute("aria-current")
    expect(count("Inbox")).toBe("2")
    expect(summary()).toBe("2 unread")
  })

  it("reports all read once every message is opened", async () => {
    await render(<InboxMail />)
    for (const from of ["suiss", "Morgan Lee", "suiss Cloud"]) {
      await row(from).click()
    }
    await expect.poll(summary).toBe("All read")
    expect(count("Inbox")).toBe("")
    await expect.element(page.getByText("Unread")).not.toBeInTheDocument()
  })

  it("switches to the starred mailbox", async () => {
    await render(<InboxMail />)
    await mailbox("Starred").click()
    await expect.poll(rows).toEqual(["Riley Chen"])
    await expect
      .element(mailbox("Starred"))
      .toHaveAttribute("aria-current", "true")
    await expect.element(mailbox("Inbox")).not.toHaveAttribute("aria-current")
    await expect
      .element(page.getByRole("region", { name: "Starred" }))
      .toBeVisible()
    await mailbox("Inbox").click()
    await expect.poll(rows).toHaveLength(6)
  })

  it("stars and unstars the open message", async () => {
    await render(<InboxMail />)
    await row("suiss Cloud").click()
    await expect
      .element(action("Star"))
      .toHaveAttribute("aria-pressed", "false")
    await action("Star").click()
    await expect
      .element(action("Unstar"))
      .toHaveAttribute("aria-pressed", "true")
    expect(count("Starred")).toBe("2")
    await expect
      .element(row("suiss Cloud").getByLabelText("Starred"))
      .toBeInTheDocument()
    await mailbox("Starred").click()
    await expect.poll(rows).toEqual(["suiss Cloud", "Riley Chen"])

    await action("Unstar").click()
    await expect.element(action("Star")).toBeVisible()
    expect(count("Starred")).toBe("1")
    await expect.poll(rows).toEqual(["Riley Chen"])
  })

  it.each(["Archive", "Delete"])(
    "%s removes the open message and opens the first remaining one",
    async (name) => {
      await render(<InboxMail />)
      await row("suiss Cloud").click()
      await action(name).click()
      await expect
        .poll(rows)
        .toEqual([
          "suiss",
          "Morgan Lee",
          "Riley Chen",
          "suiss Store",
          "App Store",
        ])
      expect(reader()).toBe("Your order has shipped")
      expect(count("Inbox")).toBe("2")
    }
  )

  it("shows an empty reader once every message is removed", async () => {
    await render(<InboxMail />)
    for (let index = 0; index < 6; index++) {
      await action("Archive").click()
    }
    await expect.poll(rows).toEqual([])
    await expect.element(page.getByText("No Message Selected")).toBeVisible()
    await expect.element(page.getByText("No Results")).toBeVisible()
    expect(summary()).toBe("All read")
  })

  it("searches sender, subject and body ignoring case", async () => {
    await render(<InboxMail />)
    await search().fill("PHOTOS")
    await expect.poll(rows).toEqual(["Riley Chen"])
    await search().fill("store")
    await expect.poll(rows).toEqual(["suiss Store", "App Store"])
    await search().fill("signature")
    await expect.poll(rows).toEqual(["suiss"])
    await search().fill("nothing like this")
    await expect.poll(rows).toEqual([])
    await expect.element(page.getByText("No Results")).toBeVisible()
    await search().fill("")
    await expect.poll(rows).toHaveLength(6)
  })

  it("writes a reply and sends it", async () => {
    await render(<InboxMail />)
    await action("Reply").click()
    const reply = page.getByRole("textbox", { name: "Reply to suiss" })
    await expect.element(reply).toHaveFocus()
    await expect.element(action("Send")).toBeDisabled()
    await userEvent.keyboard("Thanks!")
    await expect.element(action("Send")).toBeEnabled()
    await action("Send").click()
    await expect.element(reply).not.toBeInTheDocument()
    await action("Reply").click()
    await expect.element(reply).toHaveValue("")
    await action("Cancel").click()
    await expect.element(reply).not.toBeInTheDocument()
  })

  it("steps through one column at a time on a phone", async () => {
    await page.viewport(390, 844)
    await render(<InboxMail />)
    await expect.poll(() => pane("list")).not.toBeNull()
    expect(pane("sidebar")).toBeNull()
    expect(pane("detail")).toBeNull()

    await row("Morgan Lee").click()
    await expect.poll(reader).toBe("Tomorrow's meeting")
    expect(pane("list")).toBeNull()

    await page.getByRole("button", { name: "Inbox", exact: true }).click()
    await expect.poll(() => pane("list")).not.toBeNull()
    await page.getByRole("button", { name: "Mailboxes", exact: true }).click()
    await expect.poll(() => pane("sidebar")).not.toBeNull()
    expect(count("Inbox")).toBe("2")
    await mailbox("Starred").click()
    await expect.poll(rows).toEqual(["Riley Chen"])
  })
})
