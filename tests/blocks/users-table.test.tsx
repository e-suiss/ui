import { afterEach, describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"

import { UsersTable } from "@/components/blocks/users-table"

afterEach(async () => {
  await page.viewport(1280, 800)
})

const search = () => page.getByRole("searchbox", { name: "Search users" })
const roleFilter = (name: string) =>
  page.getByRole("group", { name: "Role" }).getByRole("button", {
    name,
    exact: true,
  })
const row = (name: string) => page.getByRole("row").filter({ hasText: name })
const selectBox = (name: string) =>
  page.getByRole("checkbox", { name: `Select ${name}` })
const footerText = /selected$|^Click rows to select$/

const footer = () => page.getByText(footerText)
const action = (name: string) => page.getByRole("button", { name })

const nameOf = (item: HTMLElement) =>
  item
    .querySelector("[data-slot=checkbox]")
    ?.getAttribute("aria-label")
    ?.replace("Select ", "")

function names() {
  return Array.from(document.querySelectorAll<HTMLElement>("tbody tr"), nameOf)
}

function cells(name: string) {
  const match = Array.from(
    document.querySelectorAll<HTMLTableRowElement>("tbody tr")
  ).find((item) => item.textContent?.includes(name))
  return Array.from(match?.cells ?? [], (cell) => cell.textContent).slice(1)
}

function selectedRows() {
  return Array.from(
    document.querySelectorAll<HTMLElement>("tbody tr[data-selected]"),
    nameOf
  )
}

describe("UsersTable", () => {
  it("lists everyone with role, status and last sign-in", async () => {
    await render(<UsersTable />)
    await expect.element(page.getByText("6 people")).toBeVisible()
    expect(names()).toEqual([
      "Jamie Rivera",
      "Morgan Lee",
      "Riley Chen",
      "Taylor Kim",
      "Avery Brooks",
      "Jordan Park",
    ])
    expect(cells("Taylor Kim")).toEqual(["Viewer", "Suspended", "3 days ago"])
    expect(cells("Avery Brooks")).toEqual(["Editor", "Invited", "—"])
    await expect.element(footer()).toHaveTextContent("Click rows to select")
    await expect
      .element(roleFilter("All"))
      .toHaveAttribute("aria-pressed", "true")
  })

  it("filters by role", async () => {
    await render(<UsersTable />)
    await roleFilter("Editor").click()
    await expect.poll(names).toEqual(["Morgan Lee", "Avery Brooks"])
    await roleFilter("Support").click()
    await expect.poll(names).toEqual(["Riley Chen", "Jordan Park"])
    await roleFilter("Support").click()
    await expect
      .element(roleFilter("Support"))
      .toHaveAttribute("aria-pressed", "true")
    await expect.poll(names).toEqual(["Riley Chen", "Jordan Park"])
    await roleFilter("All").click()
    await expect.poll(() => names().length).toBe(6)
  })

  it("searches names and emails without case", async () => {
    await render(<UsersTable />)
    await search().fill("PARK")
    await expect.poll(names).toEqual(["Jordan Park"])
    await search().fill("riley@company")
    await expect.poll(names).toEqual(["Riley Chen"])
    await roleFilter("Editor").click()
    await expect.poll(names).toEqual([])
    await expect.element(page.getByText("No matching users.")).toBeVisible()
    await search().fill("")
    await expect.poll(names).toEqual(["Morgan Lee", "Avery Brooks"])
    await expect
      .element(page.getByText("No matching users."))
      .not.toBeInTheDocument()
  })

  it("selects rows by clicking them and through the checkbox", async () => {
    await render(<UsersTable />)
    await row("Morgan Lee").click()
    await expect.element(footer()).toHaveTextContent("1 selected")
    await expect.element(selectBox("Morgan Lee")).toBeChecked()
    await expect
      .element(row("Morgan Lee"))
      .toHaveAttribute("data-selected", "true")
    await selectBox("Riley Chen").click({ force: true })
    await expect.element(footer()).toHaveTextContent("2 selected")
    expect(selectedRows()).toEqual(["Morgan Lee", "Riley Chen"])
    await row("Morgan Lee").click()
    await expect.element(footer()).toHaveTextContent("1 selected")
    expect(selectedRows()).toEqual(["Riley Chen"])
  })

  it("shows bulk actions only while something is selected", async () => {
    await render(<UsersTable />)
    await expect.element(action("Suspend")).not.toBeInTheDocument()
    await row("Riley Chen").click()
    await expect.element(action("Make Editor")).toBeVisible()
    await expect.element(action("Activate")).toBeVisible()
    await expect.element(action("Suspend")).toBeVisible()
    await row("Riley Chen").click()
    await expect.element(action("Suspend")).not.toBeInTheDocument()
  })

  it("makes the selected people editors and clears the selection", async () => {
    await render(<UsersTable />)
    await row("Riley Chen").click()
    await row("Taylor Kim").click()
    await action("Make Editor").click()
    await expect.poll(() => cells("Riley Chen")[0]).toBe("Editor")
    expect(cells("Taylor Kim")[0]).toBe("Editor")
    expect(cells("Jordan Park")[0]).toBe("Support")
    await expect.element(footer()).toHaveTextContent("Click rows to select")
    expect(selectedRows()).toEqual([])
    await roleFilter("Editor").click()
    await expect
      .poll(names)
      .toEqual(["Morgan Lee", "Riley Chen", "Taylor Kim", "Avery Brooks"])
  })

  it("activates and suspends people", async () => {
    await render(<UsersTable />)
    await row("Taylor Kim").click()
    await row("Avery Brooks").click()
    await action("Activate").click()
    await expect.poll(() => cells("Taylor Kim")[1]).toBe("Active")
    expect(cells("Avery Brooks")[1]).toBe("Active")
    await row("Morgan Lee").click()
    await action("Suspend").click()
    await expect.poll(() => cells("Morgan Lee")[1]).toBe("Suspended")
    const status = row("Morgan Lee").element().querySelector("[data-status]")
    expect(status?.getAttribute("data-status")).toBe("Suspended")
    await expect.element(page.getByText("6 people")).toBeVisible()
  })

  it("clears the selection when the role filter changes", async () => {
    await render(<UsersTable />)
    await row("Morgan Lee").click()
    await expect.element(footer()).toHaveTextContent("1 selected")
    await roleFilter("Editor").click()
    await expect.element(footer()).toHaveTextContent("Click rows to select")
    expect(selectedRows()).toEqual([])
  })

  it("hides secondary columns on a phone", async () => {
    await render(<UsersTable />)
    const visibleHeads = () =>
      Array.from(document.querySelectorAll<HTMLElement>("thead th"))
        .filter((head) => head.offsetWidth > 0)
        .map((head) => head.textContent)
    await expect
      .poll(visibleHeads)
      .toEqual(["Name", "Role", "Status", "Last sign-in"])
    await page.viewport(390, 844)
    await expect.poll(visibleHeads).toEqual(["Name", "Status"])
    await row("Jordan Park").click()
    await expect.element(footer()).toHaveTextContent("1 selected")
  })
})
