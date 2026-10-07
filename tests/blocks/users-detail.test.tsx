import { afterEach, describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"

import { UsersDetail } from "@/components/blocks/users-detail"

afterEach(async () => {
  await page.viewport(1280, 800)
})

const person = (name: string) =>
  page
    .getByRole("region", { name: "Users" })
    .getByRole("button")
    .filter({ hasText: name })
const tab = (name: string) =>
  page.getByRole("group", { name: "Section" }).getByRole("button", { name })
const detail = (name: string) => page.getByRole("region", { name })

function roleOf(name: string) {
  const item = Array.from(
    document.querySelectorAll<HTMLElement>("[data-slot=split-view-item]")
  ).find((node) => node.textContent?.includes(name))
  const text = item?.textContent ?? ""
  return text.slice(text.indexOf(name) + name.length)
}

function rows() {
  return Array.from(
    document.querySelectorAll<HTMLElement>(
      "[data-slot=split-view-detail] [data-slot=item]"
    ),
    (item) =>
      [
        item.querySelector("[data-slot=item-title]")?.textContent,
        item.querySelector("[data-slot=item-description]")?.textContent ??
          item.querySelector("[data-slot=select-value]")?.textContent ??
          item.querySelector("[data-slot=item-actions]")?.textContent,
      ].join(": ")
  )
}

async function chooseRole(value: string) {
  await page.getByRole("combobox", { name: "Role" }).click()
  await page.getByRole("option", { name: value }).click()
}

describe("UsersDetail", () => {
  it("opens the first person on the profile tab", async () => {
    await render(<UsersDetail />)
    await expect
      .element(detail("Jamie Rivera").getByText("jamie@company.com · Admin"))
      .toBeVisible()
    await expect
      .element(person("Jamie Rivera"))
      .toHaveAttribute("aria-current", "true")
    await expect.element(tab("Profile")).toHaveAttribute("aria-pressed", "true")
    expect(rows()).toEqual([
      "Full name: Jamie Rivera",
      "Email: jamie@company.com",
      "Department: Product",
      "Joined: March 12, 2024",
      "Role: Admin",
      "Status: Active",
    ])
  })

  it("shows another person when picked from the list", async () => {
    await render(<UsersDetail />)
    await person("Taylor Kim").click()
    await expect
      .element(detail("Taylor Kim").getByText("taylor@company.com · Viewer"))
      .toBeVisible()
    await expect.poll(rows).toContain("Status: Suspended")
    await expect
      .element(person("Taylor Kim"))
      .toHaveAttribute("aria-current", "true")
    await expect
      .element(person("Jamie Rivera"))
      .not.toHaveAttribute("aria-current")
  })

  it("returns to the profile tab when another person is picked", async () => {
    await render(<UsersDetail />)
    await tab("Sessions").click()
    await expect
      .element(tab("Sessions"))
      .toHaveAttribute("aria-pressed", "true")
    await person("Riley Chen").click()
    await expect.element(tab("Profile")).toHaveAttribute("aria-pressed", "true")
    await expect.poll(rows).toContain("Email: riley@company.com")
  })

  it("changes a role and keeps it per person", async () => {
    await render(<UsersDetail />)
    await person("Morgan Lee").click()
    await chooseRole("Viewer")
    await expect
      .element(detail("Morgan Lee").getByText("morgan@company.com · Viewer"))
      .toBeVisible()
    expect(roleOf("Morgan Lee")).toBe("Viewer")
    expect(roleOf("Avery Brooks")).toBe("Editor")
    await person("Avery Brooks").click()
    await expect.poll(rows).toContain("Role: Editor")
    await person("Morgan Lee").click()
    await expect.poll(rows).toContain("Role: Viewer")
  })

  it("signs out sessions one by one and all at once", async () => {
    await render(<UsersDetail />)
    await tab("Sessions").click()
    await expect
      .poll(rows)
      .toEqual([
        "Book Pro · Browser: San Francisco, US · Now",
        "Phone Pro · App: San Francisco, US · 2 hr ago",
        "Desktop · Browser: Seattle, US · 3 days ago",
      ])
    await expect.element(page.getByText("This device")).toBeVisible()
    expect(
      document.querySelectorAll(
        "[data-slot=split-view-detail] [data-slot=item] button"
      )
    ).toHaveLength(2)
    await page
      .getByRole("listitem")
      .filter({ hasText: "Desktop · Browser" })
      .getByRole("button", { name: "Sign Out" })
      .click()
    await expect.poll(rows).toHaveLength(2)
    await page
      .getByRole("button", { name: "Sign Out All Other Sessions" })
      .click()
    await expect
      .poll(rows)
      .toEqual(["Book Pro · Browser: San Francisco, US · Now"])
    await expect
      .element(
        page.getByRole("button", { name: "Sign Out All Other Sessions" })
      )
      .not.toBeInTheDocument()
  })

  it("shows the security switches", async () => {
    await render(<UsersDetail />)
    await tab("Security").click()
    const toggle = (name: string) => page.getByRole("switch", { name })
    await expect
      .element(toggle("Two-factor authentication"))
      .toHaveAttribute("aria-checked", "true")
    await expect
      .element(toggle("Require passkey"))
      .toHaveAttribute("aria-checked", "false")
    await expect
      .element(toggle("Sign-in alerts"))
      .toHaveAttribute("aria-checked", "true")
    await page.getByText("Require passkey").click()
    await expect
      .element(toggle("Require passkey"))
      .toHaveAttribute("aria-checked", "true")
    await expect
      .element(page.getByRole("button", { name: "Send Password Reset Link" }))
      .toBeVisible()
  })

  it("drills from the list into a person on a phone", async () => {
    await page.viewport(390, 844)
    await render(<UsersDetail />)
    await expect.element(person("Jordan Park")).toBeVisible()
    await expect.element(tab("Profile")).not.toBeInTheDocument()
    await person("Jordan Park").click()
    await expect
      .element(detail("Jordan Park").getByText("jordan@company.com · Support"))
      .toBeVisible()
    await detail("Jordan Park").getByRole("button", { name: "Users" }).click()
    await expect.element(person("Riley Chen")).toBeVisible()
    await expect
      .element(person("Jordan Park"))
      .toHaveAttribute("aria-current", "true")
  })
})
