import { afterEach, describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import { LoginSheet } from "@/components/blocks/login-sheet"

afterEach(async () => {
  await page.viewport(1280, 800)
})

const trigger = () => page.getByRole("button", { name: "Sign in with suiss" })
const sheet = () =>
  document.querySelector<HTMLElement>("[role=dialog]") ??
  (() => {
    throw new Error("sheet not rendered")
  })()
const close = () => page.getByRole("button", { name: "Close" })
const proceed = () =>
  page.getByRole("button", { name: "Continue with face scan" })
const radio = (name: string) =>
  page.getByRole("radio", { name: new RegExp(`^${name}`) })
const scrim = () => {
  const node = sheet().previousElementSibling
  if (!(node instanceof HTMLElement)) throw new Error("scrim not rendered")
  return node
}
const notch = () => {
  const node = sheet().parentElement?.querySelector<HTMLElement>(
    ":scope > span[aria-hidden]"
  )
  if (!node) throw new Error("notch not rendered")
  return node
}

async function openSheet() {
  await trigger().click()
  await expect.poll(() => sheet().hasAttribute("data-open")).toBe(true)
}

describe("LoginSheet", () => {
  it("keeps the sheet closed and inert at first", async () => {
    await render(<LoginSheet />)
    await expect
      .element(page.getByRole("heading", { name: "Trail Routes" }))
      .toBeVisible()
    expect(sheet().hasAttribute("data-open")).toBe(false)
    expect(sheet().inert).toBe(true)
    expect(sheet().getAttribute("aria-labelledby")).toBe(
      sheet().querySelector("h2")?.id
    )
  })

  it("opens the sheet, focuses close and makes the page inert", async () => {
    await render(<LoginSheet />)
    await openSheet()
    expect(sheet().inert).toBe(false)
    await expect.element(close()).toHaveFocus()
    expect(trigger().element().closest("[inert]")).not.toBeNull()
    await expect
      .element(
        page.getByRole("heading", {
          name: "Use your suiss Account with Trail Routes",
        })
      )
      .toBeVisible()
    expect(scrim().hasAttribute("data-open")).toBe(true)
  })

  it.each([
    ["the close button", () => close().click()],
    ["Escape", () => userEvent.keyboard("{Escape}")],
    ["the scrim", async () => scrim().click()],
  ])("closes with %s", async (_, act) => {
    await render(<LoginSheet />)
    await openSheet()
    await act()
    await expect.poll(() => sheet().hasAttribute("data-open")).toBe(false)
    expect(sheet().inert).toBe(true)
    expect(scrim().hasAttribute("data-open")).toBe(false)
    expect(trigger().element().closest("[inert]")).toBeNull()
  })

  it("hides the email by default and lets the user share it", async () => {
    await render(<LoginSheet />)
    await openSheet()
    await expect.element(radio("Hide My Email")).toBeChecked()
    await expect.element(radio("Share My Email")).not.toBeChecked()
    await page.getByText("Share My Email").click()
    await expect.element(radio("Share My Email")).toBeChecked()
    await expect.element(radio("Hide My Email")).not.toBeChecked()
  })

  it("signs in with face scan and signs out", async () => {
    await render(<LoginSheet />)
    await openSheet()
    await proceed().click()
    await expect
      .poll(
        () =>
          sheet()
            .querySelectorAll<HTMLButtonElement>("button")
            .item(sheet().querySelectorAll("button").length - 1).disabled
      )
      .toBe(true)
    await expect
      .element(page.getByRole("heading", { name: "Welcome, Jamie" }))
      .toBeVisible()
    await expect
      .element(page.getByText("Your account was created with suiss."))
      .toBeVisible()
    expect(sheet().hasAttribute("data-open")).toBe(false)
    await expect.element(trigger()).not.toBeInTheDocument()

    await page.getByRole("button", { name: "Sign out ›" }).click()
    await expect
      .element(page.getByRole("heading", { name: "Trail Routes" }))
      .toBeVisible()
    await expect.element(trigger()).toBeVisible()
  })

  it("drops the device frame on a phone", async () => {
    await render(<LoginSheet />)
    await expect.poll(() => getComputedStyle(notch()).display).toBe("block")
    await page.viewport(390, 844)
    await expect.poll(() => getComputedStyle(notch()).display).toBe("none")
    await expect.element(trigger()).toBeVisible()
  })
})
