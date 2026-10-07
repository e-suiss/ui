import { describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import { ChatThread } from "@/components/blocks/chat-thread"

const lines = () =>
  Array.from(
    document.querySelectorAll<HTMLElement>(
      "[data-slot=message-scroller-viewport] [data-slot=message]:not(:has([aria-label=Typing]))"
    ),
    (message) =>
      `${message.dataset.align === "end" ? "me" : "them"}:${message.textContent}`
  )

const hearts = () =>
  document.querySelectorAll("[data-slot=bubble-reactions]").length

const composer = () => page.getByRole("textbox", { name: "Message" })
const send = () => page.getByRole("button", { name: "Send" })
const bubble = (text: string) =>
  page.getByRole("button", {
    name: new RegExp(`^${text}(, liked)?\\. Double-click`),
  })

describe("ChatThread", () => {
  it("shows the opening conversation with Riley", async () => {
    await render(<ChatThread />)
    await expect
      .element(page.getByRole("region", { name: "Conversation with Riley" }))
      .toBeVisible()
    expect(lines()).toEqual([
      "them:Is the weekend trip to the coast still on?",
      "me:Yes! We leave Friday evening",
      "me:I booked the boat tour, it leaves at 5 AM",
      "them:Great, I'll bring the camera",
    ])
    await expect
      .element(page.getByRole("link", { name: "RC Riley" }))
      .toHaveAttribute("href", "#contact")
  })

  it("adds and removes a heart with a double-click", async () => {
    await render(<ChatThread />)
    await bubble("Great, I'll bring the camera").dblClick()
    await expect
      .element(
        page.getByRole("button", {
          name: "Great, I'll bring the camera, liked. Double-click to remove the heart.",
        })
      )
      .toBeVisible()
    expect(hearts()).toBe(1)
    await bubble("Great, I'll bring the camera").dblClick()
    await expect
      .element(
        page.getByRole("button", {
          name: "Great, I'll bring the camera. Double-click to add a heart.",
        })
      )
      .toBeVisible()
    expect(hearts()).toBe(0)
  })

  it("toggles a heart from the keyboard", async () => {
    await render(<ChatThread />)
    bubble("Yes! We leave Friday evening").element().focus()
    await userEvent.keyboard("{Enter}")
    await expect.poll(hearts).toBe(1)
    await expect
      .element(bubble("Yes! We leave Friday evening"))
      .toHaveAccessibleName(
        "Yes! We leave Friday evening, liked. Double-click to remove the heart."
      )
  })

  it("sends a trimmed message and gets replies in turn", async () => {
    await render(<ChatThread />)
    await expect.element(send()).toBeDisabled()
    await composer().fill("  See you Friday  ")
    await expect.element(send()).toBeEnabled()
    await send().click()
    await expect.element(composer()).toHaveValue("")
    await expect.poll(() => lines().at(-1)).toBe("me:See you Friday")
    await expect.element(page.getByLabelText("Typing")).toBeVisible()
    await expect
      .poll(() => lines().at(-1), { timeout: 4000 })
      .toBe("them:Sounds good")
    await expect.element(page.getByLabelText("Typing")).not.toBeInTheDocument()

    await composer().fill("Bring sunscreen")
    await userEvent.keyboard("{Enter}")
    await expect
      .poll(() => lines().at(-1), { timeout: 4000 })
      .toBe("them:Great, see you then!")
    expect(lines()).toHaveLength(8)
  })
})
