import { afterEach, describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import { ChatConversations } from "@/components/blocks/chat-conversations"

afterEach(async () => {
  await page.viewport(1280, 800)
})

const lines = () =>
  Array.from(
    document.querySelectorAll<HTMLElement>(
      "[data-slot=message-scroller-viewport] [data-slot=message]:not(:has([aria-label=Typing]))"
    ),
    (message) =>
      `${message.dataset.align === "end" ? "me" : "them"}:${message.textContent}`
  )

const thread = (name: string) =>
  page.getByRole("button", { name: new RegExp(`^\\S+ ${name}`) })
const preview = (name: string) => thread(name).element().textContent

const composer = () => page.getByRole("textbox", { name: "Message" })
const send = () => page.getByRole("button", { name: "Send" })
const status = () => document.querySelector("[aria-live=polite]")?.textContent

describe("ChatConversations", () => {
  it("lists threads with their last message and opens the first", async () => {
    await render(<ChatConversations />)
    await expect
      .element(thread("Riley Chen"))
      .toHaveAttribute("aria-current", "true")
    await expect
      .poll(() => preview("Morgan Lee"))
      .toContain("On it, back to you in 10 minutes")
    await expect
      .element(
        page.getByRole("region", { name: "Conversation with Riley Chen" })
      )
      .toBeVisible()
    expect(lines()).toEqual([
      "them:Is the weekend trip to the coast still on?",
      "me:Yes! We leave Friday evening",
      "me:I booked the boat tour, it leaves at 5 AM",
      "them:Great, I'll bring the camera",
    ])
  })

  it("switches the conversation when a thread is picked", async () => {
    await render(<ChatConversations />)
    await thread("Family").click()
    await expect
      .element(thread("Family"))
      .toHaveAttribute("aria-current", "true")
    expect(thread("Riley Chen").element().hasAttribute("aria-current")).toBe(
      false
    )
    await expect
      .element(page.getByRole("region", { name: "Conversation with Family" }))
      .toBeVisible()
    expect(lines()).toEqual([
      "them:Is everyone coming for Sunday brunch?",
      "me:We'll be there",
      "them:I'll bring pastries",
    ])
  })

  it("enables send only for non-blank text", async () => {
    await render(<ChatConversations />)
    await expect.element(send()).toBeDisabled()
    await composer().fill("   ")
    await expect.element(send()).toBeDisabled()
    await composer().fill("Hi")
    await expect.element(send()).toBeEnabled()
    await expect.element(send()).toHaveAttribute("data-ready", "")
  })

  it("sends a message, shows typing and then the scripted reply", async () => {
    await render(<ChatConversations />)
    await thread("Taylor Kim").click()
    await composer().fill("  Seven sharp  ")
    await userEvent.keyboard("{Enter}")
    await expect
      .poll(lines)
      .toEqual(["them:What time does the game start?", "me:Seven sharp"])
    await expect.element(composer()).toHaveValue("")
    await expect.poll(() => preview("Taylor Kim")).toContain("Seven sharp")
    await expect.poll(status).toBe("typing…")
    await expect.element(page.getByLabelText("Typing")).toBeVisible()
    await expect
      .poll(lines, { timeout: 4000 })
      .toEqual([
        "them:What time does the game start?",
        "me:Seven sharp",
        "them:Sounds good",
      ])
    expect(status()).toBe("Message")
    await expect.poll(() => preview("Taylor Kim")).toContain("Sounds good")
  })

  it("cycles through the scripted replies", async () => {
    await render(<ChatConversations />)
    await thread("Morgan Lee").click()
    await composer().fill("First")
    await send().click()
    await expect
      .poll(() => lines().at(-1), { timeout: 4000 })
      .toBe("them:Sounds good")
    await composer().fill("Second")
    await send().click()
    await expect
      .poll(() => lines().at(-1), { timeout: 4000 })
      .toBe("them:Great, see you then!")
  })

  it("delivers the reply to the thread it was sent from", async () => {
    await render(<ChatConversations />)
    await composer().fill("Bring snacks")
    await send().click()
    await thread("Morgan Lee").click()
    await expect
      .poll(() => preview("Riley Chen"), { timeout: 4000 })
      .toContain("Sounds good")
    expect(lines().at(-1)).toBe("me:On it, back to you in 10 minutes")
  })

  it("moves from the list to the conversation on a phone", async () => {
    await page.viewport(390, 844)
    await render(<ChatConversations />)
    await expect.element(thread("Riley Chen")).toBeVisible()
    expect(document.querySelector("[data-slot=split-view-detail]")).toBeNull()
    await thread("Family").click()
    await expect
      .element(page.getByRole("region", { name: "Conversation with Family" }))
      .toBeVisible()
    expect(document.querySelector("[data-slot=split-view-list]")).toBeNull()
    await page.getByRole("button", { name: "Messages" }).click()
    await expect
      .element(thread("Family"))
      .toHaveAttribute("aria-current", "true")
  })
})
