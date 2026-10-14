import { describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"

import { RolesRequests } from "@/components/blocks/roles-requests"

const names = ["Morgan Lee", "Riley Chen", "Jordan Park", "Taylor Kim"]

function rows() {
  return Array.from(
    document.querySelectorAll<HTMLElement>("main li, ul > li"),
    (item) => item
  ).filter((item) => names.some((name) => item.textContent?.includes(name)))
}

const rowOf = (name: string) =>
  page.getByRole("listitem").filter({ hasText: name })

const pendingText = /^\d+ pending requests?$/

const pending = () => page.getByText(pendingText)

async function decide(name: string, action: "Approve" | "Deny") {
  await rowOf(name).getByRole("button", { name: action }).click()
}

describe("RolesRequests", () => {
  it("lists every pending request", async () => {
    await render(<RolesRequests />)
    await expect.element(pending()).toHaveTextContent("4 pending requests")
    await expect.poll(() => rows().length).toBe(4)
    await expect
      .element(rowOf("Riley Chen").getByText("Requests Export customers"))
      .toBeVisible()
    await expect
      .element(rowOf("Riley Chen").getByText("1 hr ago"))
      .toBeVisible()
  })

  it("approves a request and then removes it", async () => {
    await render(<RolesRequests />)
    await decide("Morgan Lee", "Approve")
    const status = rowOf("Morgan Lee").getByRole("status")
    await expect.element(status).toHaveTextContent("Approved")
    await expect.element(status).toHaveAttribute("data-decision", "approved")
    await expect
      .element(rowOf("Morgan Lee").getByRole("button"))
      .not.toBeInTheDocument()
    await expect.element(pending()).toHaveTextContent("3 pending requests")
    await expect.element(rowOf("Morgan Lee")).not.toBeInTheDocument()
    await expect.poll(() => rows().length).toBe(3)
  })

  it("denies a request", async () => {
    await render(<RolesRequests />)
    await decide("Taylor Kim", "Deny")
    const status = rowOf("Taylor Kim").getByRole("status")
    await expect.element(status).toHaveTextContent("Denied")
    await expect.element(status).toHaveAttribute("data-decision", "denied")
    await expect.element(rowOf("Taylor Kim")).not.toBeInTheDocument()
    await expect.element(rowOf("Morgan Lee")).toBeVisible()
  })

  it("uses the singular for one remaining request", async () => {
    await render(<RolesRequests />)
    await decide("Morgan Lee", "Approve")
    await decide("Riley Chen", "Deny")
    await decide("Jordan Park", "Approve")
    await expect.element(pending()).toHaveTextContent("1 pending request")
  })

  it("shows the empty state once all are handled and resets the sample", async () => {
    await render(<RolesRequests />)
    for (const name of names) await decide(name, "Approve")
    await expect.element(pending()).toHaveTextContent("0 pending requests")
    await expect.element(page.getByText("No pending requests.")).toBeVisible()
    await page.getByRole("button", { name: "Reset the sample ›" }).click()
    await expect.element(pending()).toHaveTextContent("4 pending requests")
    await expect.poll(() => rows().length).toBe(4)
    await expect
      .element(page.getByText("No pending requests."))
      .not.toBeInTheDocument()
  })

  it("changes the approval length", async () => {
    await render(<RolesRequests />)
    const trigger = page.getByRole("combobox", { name: "Approval length" })
    await expect.element(trigger.getByText("Permanent")).toBeVisible()
    await trigger.click()
    await page.getByRole("option", { name: "7 days" }).click()
    await expect.element(trigger.getByText("7 days")).toBeVisible()
  })
})
