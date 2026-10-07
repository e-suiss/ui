import { describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import { ChatSupport } from "@/components/blocks/chat-support"

const dialog = () => page.getByRole("dialog", { name: "suiss Support chat" })

const lines = () =>
  Array.from(
    document.querySelectorAll<HTMLElement>(
      "[data-slot=message-scroller-viewport] [data-slot=message]:not(:has([aria-label=Typing]))"
    ),
    (message) =>
      `${message.dataset.align === "end" ? "me" : "them"}:${message.textContent}`
  )

const quickReplies = () =>
  ["Where's my order?", "Book a repair", "I want to return something"].filter(
    (name) =>
      document.querySelector(`button[aria-label="${name}"]`) ??
      Array.from(document.querySelectorAll("button")).some(
        (button) => button.textContent === name
      )
  )

const question = () => page.getByRole("textbox", { name: "Type your question" })
const send = () => page.getByRole("button", { name: "Send" })
const launcher = () => page.getByRole("button", { name: "Open chat" })

const greeting =
  "them:Hi Jamie, I'm the suiss Support assistant. How can I help?"

describe("ChatSupport", () => {
  it("opens with a greeting and quick questions", async () => {
    await render(<ChatSupport />)
    await expect.element(dialog()).toBeVisible()
    await expect.element(dialog()).toHaveAttribute("data-open", "")
    expect(lines()).toEqual([greeting])
    expect(quickReplies()).toEqual([
      "Where's my order?",
      "Book a repair",
      "I want to return something",
    ])
    expect(launcher().element().getAttribute("aria-expanded")).toBe("true")
  })

  it("answers a quick question and hides it from the suggestions", async () => {
    await render(<ChatSupport />)
    await page.getByRole("button", { name: "Book a repair" }).click()
    await expect.poll(lines).toEqual([greeting, "me:Book a repair"])
    expect(quickReplies()).toEqual([
      "Where's my order?",
      "I want to return something",
    ])
    await expect.element(page.getByLabelText("Typing")).toBeVisible()
    await expect
      .poll(lines, { timeout: 3000 })
      .toEqual([
        greeting,
        "me:Book a repair",
        "them:The closest Help Desk is at suiss Union Square. Does tomorrow at 11:30 AM work?",
      ])
    await expect.element(page.getByLabelText("Typing")).not.toBeInTheDocument()
  })

  it("hands a typed question over to a specialist", async () => {
    await render(<ChatSupport />)
    await expect.element(send()).toBeDisabled()
    await question().fill("   ")
    await expect.element(send()).toBeDisabled()
    await question().fill("  My screen flickers  ")
    await userEvent.keyboard("{Enter}")
    await expect.element(question()).toHaveValue("")
    await expect
      .poll(lines, { timeout: 3000 })
      .toEqual([
        greeting,
        "me:My screen flickers",
        "them:Got it. I'm connecting you with a Specialist, this may take a few minutes.",
      ])
  })

  it("answers a typed quick question with its scripted answer", async () => {
    await render(<ChatSupport />)
    await question().fill("Where's my order?")
    await send().click()
    await expect
      .poll(lines, { timeout: 3000 })
      .toEqual([
        greeting,
        "me:Where's my order?",
        "them:Order W1048 has shipped. It arrives tomorrow between 10 AM and 2 PM.",
      ])
    expect(quickReplies()).toEqual([
      "Book a repair",
      "I want to return something",
    ])
  })

  it("closes to the launcher and reopens with the conversation kept", async () => {
    await render(<ChatSupport />)
    await page
      .getByRole("button", { name: "I want to return something" })
      .click()
    await page.getByRole("button", { name: "Close chat" }).click()
    await expect.element(launcher()).toHaveFocus()
    await expect.element(launcher()).toHaveAttribute("aria-expanded", "false")
    expect(dialog().element().hasAttribute("inert")).toBe(true)
    expect(dialog().element().hasAttribute("data-open")).toBe(false)

    await launcher().click()
    await expect.element(dialog()).toHaveAttribute("data-open", "")
    expect(dialog().element().hasAttribute("inert")).toBe(false)
    await expect.poll(lines, { timeout: 3000 }).toHaveLength(3)
    expect(lines()[1]).toBe("me:I want to return something")
  })
})
