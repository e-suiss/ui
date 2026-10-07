import { afterEach, describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import { UsersInvite } from "@/components/blocks/users-invite"

afterEach(async () => {
  await page.viewport(1280, 800)
})

const input = () => page.getByRole("textbox", { name: "Email" })
const send = () => page.getByRole("button", { name: "Send Invites" })
const summaryText = /will be invited as|^Type an email and press Enter\.$/
const summary = () => page.getByText(summaryText)

function chips() {
  return Array.from(
    document.querySelectorAll<HTMLElement>("[aria-label^='Remove ']"),
    (button) => button.getAttribute("aria-label")?.replace("Remove ", "")
  )
}

function pending() {
  const heading = Array.from(document.querySelectorAll("h2")).find(
    (node) => node.textContent === "Pending invitations"
  )
  const list = heading?.nextElementSibling
  return Array.from(
    list?.querySelectorAll<HTMLElement>("[data-slot=item-content]") ?? [],
    (content) => content.textContent
  )
}

const toastTitles = () =>
  Array.from(
    document.querySelectorAll<HTMLElement>("[data-slot=toast-title]"),
    (node) => node.textContent
  )

const pendingRow = (email: string) =>
  page.getByRole("listitem").filter({ hasText: email })

async function type(text: string) {
  await input().click()
  await userEvent.keyboard(text)
}

describe("UsersInvite", () => {
  it("starts with one invitee and the pending list", async () => {
    await render(<UsersInvite />)
    await expect
      .element(summary())
      .toHaveTextContent("1 person will be invited as Editor.")
    expect(chips()).toEqual(["avery@company.com"])
    expect(pending()).toEqual([
      "casey@company.comSupport · 2 days ago",
      "drew@company.comViewer · 5 days ago",
    ])
    await expect.element(input()).toHaveAttribute("placeholder", "Add another")
    await expect
      .element(page.getByRole("switch", { name: "Send welcome email" }))
      .toHaveAttribute("aria-checked", "true")
  })

  it("adds emails on enter and comma", async () => {
    await render(<UsersInvite />)
    await type("morgan@company.com{Enter}")
    await type("riley@company.com,")
    await expect
      .poll(chips)
      .toEqual(["avery@company.com", "morgan@company.com", "riley@company.com"])
    await expect.element(input()).toHaveValue("")
    await expect
      .element(summary())
      .toHaveTextContent("3 people will be invited as Editor.")
  })

  it("adds the draft when the field loses focus", async () => {
    await render(<UsersInvite />)
    await type("taylor@company.com")
    await page.getByRole("heading", { name: "Invite users" }).click()
    await expect
      .poll(chips)
      .toEqual(["avery@company.com", "taylor@company.com"])
  })

  it("ignores duplicates and invalid addresses", async () => {
    await render(<UsersInvite />)
    await type("avery@company.com{Enter}")
    await expect.element(input()).toHaveValue("")
    await type("not-an-email{Enter}")
    await expect.element(input()).toHaveValue("")
    await type("jamie@company,")
    await expect.element(input()).toHaveValue("")
    expect(chips()).toEqual(["avery@company.com"])
    await expect
      .element(summary())
      .toHaveTextContent("1 person will be invited as Editor.")
  })

  it("removes chips with their button and with backspace", async () => {
    await render(<UsersInvite />)
    await type("morgan@company.com{Enter}riley@company.com{Enter}")
    await expect.poll(chips).toHaveLength(3)
    await page
      .getByRole("button", { name: "Remove morgan@company.com" })
      .click()
    await expect.poll(chips).toEqual(["avery@company.com", "riley@company.com"])
    await input().click()
    await userEvent.keyboard("{Backspace}")
    await expect.poll(chips).toEqual(["avery@company.com"])
    await userEvent.keyboard("{Backspace}")
    await expect.poll(chips).toEqual([])
    await expect
      .element(summary())
      .toHaveTextContent("Type an email and press Enter.")
    await expect.element(send()).toBeDisabled()
    await expect
      .element(input())
      .toHaveAttribute("placeholder", "name@company.com")
  })

  it("only removes characters while the draft has text", async () => {
    await render(<UsersInvite />)
    await type("ab{Backspace}")
    await expect.element(input()).toHaveValue("a")
    expect(chips()).toEqual(["avery@company.com"])
  })

  it("invites with the chosen role and lists them as pending", async () => {
    await render(<UsersInvite />)
    await type("morgan@company.com{Enter}")
    await page.getByRole("combobox", { name: "Role" }).click()
    await page.getByRole("option", { name: "Viewer" }).click()
    await expect
      .element(summary())
      .toHaveTextContent("2 people will be invited as Viewer.")
    await send().click()
    await expect
      .poll(pending)
      .toEqual([
        "avery@company.comViewer · Just now",
        "morgan@company.comViewer · Just now",
        "casey@company.comSupport · 2 days ago",
        "drew@company.comViewer · 5 days ago",
      ])
    await expect.poll(toastTitles).toContain("2 invitations sent")
    expect(chips()).toEqual([])
    await expect.element(send()).toBeDisabled()
  })

  it("uses the singular for a single invitation", async () => {
    await render(<UsersInvite />)
    await send().click()
    await expect.poll(toastTitles).toContain("1 invitation sent")
  })

  it("resends and cancels pending invitations", async () => {
    await render(<UsersInvite />)
    await pendingRow("drew@company.com")
      .getByRole("button", { name: "Resend" })
      .click()
    await expect.poll(toastTitles).toContain("Resent to drew@company.com")
    await pendingRow("casey@company.com")
      .getByRole("button", { name: "Cancel" })
      .click()
    await expect.poll(pending).toEqual(["drew@company.comViewer · 5 days ago"])
    await pendingRow("drew@company.com")
      .getByRole("button", { name: "Cancel" })
      .click()
    await expect.poll(pending).toEqual([])
    await expect
      .element(page.getByText("No pending invitations."))
      .toBeVisible()
  })

  it("toggles the welcome email", async () => {
    await render(<UsersInvite />)
    await page.getByText("Send welcome email").click()
    await expect
      .element(page.getByRole("switch", { name: "Send welcome email" }))
      .toHaveAttribute("aria-checked", "false")
  })
})
