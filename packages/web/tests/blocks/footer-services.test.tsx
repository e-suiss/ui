import { afterEach, describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import { FooterServices } from "@/components/blocks/footer-services"

afterEach(async () => {
  await page.viewport(1280, 800)
})

const email = () => page.getByRole("textbox", { name: "Email address" })
const subscribe = () => page.getByRole("button", { name: "Subscribe" })
const confirmation = () => page.getByRole("status")

const columns = (selector: string) => {
  const node = document.querySelector(selector)
  return node ? getComputedStyle(node).gridTemplateColumns.split(" ").length : 0
}

describe("FooterServices", () => {
  it("lists the services with learn more links", async () => {
    await render(<FooterServices />)
    const titles = Array.from(
      document.querySelectorAll("h3.text-base"),
      (title) => title.textContent
    )
    expect(titles).toEqual([
      "Free delivery",
      "Easy returns",
      "Pay monthly",
      "Expert help",
    ])
    const learnMore = Array.from(
      document.querySelectorAll<HTMLAnchorElement>("a")
    ).filter((link) => link.textContent === "Learn more ›")
    expect(learnMore.map((link) => link.getAttribute("href"))).toEqual([
      "#free-delivery",
      "#easy-returns",
      "#pay-monthly",
      "#expert-help",
    ])
  })

  it("builds the directory and legal links from their labels", async () => {
    await render(<FooterServices />)
    const directory = page.getByRole("navigation", { name: "Directory" })
    await expect.element(directory).toBeVisible()
    expect(directory.getByRole("link").all()).toHaveLength(18)
    await expect
      .element(directory.getByRole("link", { name: "Ethics & Compliance" }))
      .toHaveAttribute("href", "#ethics-compliance")
    await expect
      .element(directory.getByRole("link", { name: "Today at suiss" }))
      .toHaveAttribute("href", "#today-at-suiss")
    await expect
      .element(page.getByRole("link", { name: "Privacy Policy" }))
      .toHaveAttribute("href", "#privacy-policy")
    await expect
      .element(page.getByRole("link", { name: "United States" }))
      .toHaveAttribute("href", "#region")
  })

  it("flags an invalid email and clears the flag on typing", async () => {
    await render(<FooterServices />)
    await subscribe().click()
    await expect.element(email()).toHaveAttribute("aria-invalid", "true")
    await email().fill("jamie@example")
    await expect.element(email()).not.toHaveAttribute("aria-invalid")
    await userEvent.keyboard("{Enter}")
    await expect.element(email()).toHaveAttribute("aria-invalid", "true")
    await expect.element(confirmation()).not.toBeInTheDocument()
  })

  it("subscribes a valid email", async () => {
    await render(<FooterServices />)
    await email().fill("jamie@example.com")
    await subscribe().click()
    await expect
      .element(confirmation())
      .toHaveTextContent("You're subscribed. Thank you.")
    await expect.element(email()).not.toBeInTheDocument()
  })

  it("puts two services per row on a phone and four on desktop", async () => {
    await render(<FooterServices />)
    expect(columns("footer ul")).toBe(4)
    expect(columns("nav[aria-label=Directory]")).toBe(4)
    await page.viewport(390, 844)
    await expect.poll(() => columns("footer ul")).toBe(2)
    expect(columns("nav[aria-label=Directory]")).toBe(2)
  })
})
