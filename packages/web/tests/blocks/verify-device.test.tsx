import { afterEach, describe, expect, it } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import { VerifyDevice } from "@/components/blocks/verify-device"

afterEach(async () => {
  await page.viewport(1280, 800)
})

const heading = () => page.getByRole("heading", { level: 1 })
const alert = () => page.getByRole("alertdialog", { name: "Trusted device" })
const action = (name: string) => alert().getByRole("button", { name })
const input = () => page.getByRole("textbox", { name: "Verification code" })
const incorrect = () => page.getByText("Incorrect code.")

const slots = () =>
  Array.from(
    document.querySelectorAll<HTMLElement>("[data-slot=input-otp-slot]"),
    (slot) => slot.textContent
  ).join("")

async function toCode() {
  await action("Allow").click()
  await expect
    .element(heading())
    .toHaveTextContent("Enter the verification code.")
  await expect.element(input()).toHaveFocus()
}

describe("VerifyDevice", () => {
  it("waits for approval on the trusted device", async () => {
    await render(<VerifyDevice />)
    await expect
      .element(heading())
      .toHaveTextContent("Approve from your other device.")
    await expect.element(page.getByText("Waiting for approval…")).toBeVisible()
    await expect
      .element(alert().getByText("suiss Account Sign-in Requested"))
      .toBeVisible()
    await expect.element(action("Allow")).toBeVisible()
    await expect.element(action("Don't Allow")).toBeVisible()
    await expect.element(input()).not.toBeInTheDocument()
  })

  it("shows the code on the device after allowing", async () => {
    await render(<VerifyDevice />)
    await toCode()
    await expect.element(alert().getByText("482 913")).toBeVisible()
    await expect.element(action("OK")).toBeVisible()
    await expect
      .element(page.getByText("Waiting for approval…"))
      .not.toBeInTheDocument()
  })

  it("approves the sign-in with the code from the device", async () => {
    await render(<VerifyDevice />)
    await toCode()
    await userEvent.keyboard("482913")
    await expect.element(heading()).toHaveTextContent("Sign-in approved.")
    await expect
      .element(page.getByText("This browser was added to your suiss Account."))
      .toBeVisible()
    await page.getByRole("button", { name: "Start over ›" }).click()
    await expect
      .element(heading())
      .toHaveTextContent("Approve from your other device.")
    await toCode()
    expect(slots()).toBe("")
  })

  it("flags a wrong code and clears it", async () => {
    await render(<VerifyDevice />)
    await toCode()
    await userEvent.keyboard("111111")
    await expect.element(incorrect()).toBeVisible()
    expect(document.querySelector("[data-status=error]")).not.toBeNull()
    await expect.poll(slots).toBe("")
    await expect
      .element(heading())
      .toHaveTextContent("Enter the verification code.")
    await input().click()
    await userEvent.keyboard("4")
    await expect.element(incorrect()).not.toBeInTheDocument()
    expect(document.querySelector("[data-status=error]")).toBeNull()
  })

  it("denies the sign-in and tries again", async () => {
    await render(<VerifyDevice />)
    await action("Don't Allow").click()
    await expect.element(heading()).toHaveTextContent("Sign-in denied.")
    await expect.element(alert().getByText("Sign-in blocked")).toBeVisible()
    await page.getByRole("button", { name: "Try again ›" }).click()
    await expect
      .element(heading())
      .toHaveTextContent("Approve from your other device.")
  })

  it("shows the request again from the device", async () => {
    await render(<VerifyDevice />)
    await action("Don't Allow").click()
    await action("Show request again").click()
    await expect.element(action("Allow")).toBeVisible()
    await expect.element(page.getByText("Waiting for approval…")).toBeVisible()
  })

  it("stacks the device under the copy on a phone", async () => {
    await render(<VerifyDevice />)
    await expect.element(alert()).toBeVisible()
    const below = () =>
      alert().element().getBoundingClientRect().top >
      heading().element().getBoundingClientRect().bottom
    expect(below()).toBe(false)
    expect(alert().element().getBoundingClientRect().left).toBeGreaterThan(
      heading().element().getBoundingClientRect().right
    )
    await page.viewport(390, 844)
    await expect.poll(below).toBe(true)
    await action("Allow").click()
    await expect.element(input()).toBeInTheDocument()
  })
})
