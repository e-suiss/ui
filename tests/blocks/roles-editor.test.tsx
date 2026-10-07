import { afterEach, describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"

import { RolesEditor } from "@/components/blocks/roles-editor"

afterEach(async () => {
  await page.viewport(1280, 800)
})

const permissions = [
  "Create drafts",
  "Publish",
  "Delete",
  "Customer data",
  "Export",
]

const toggle = (name: string) => page.getByRole("switch", { name, exact: true })

const roleButton = (name: string) =>
  page.getByRole("button", { name: new RegExp(`^${name}\\b`) })

const save = () => page.getByRole("button", { name: "Save", exact: true })
const revert = () => page.getByRole("button", { name: "Revert", exact: true })

function counts() {
  return Array.from(
    document.querySelectorAll<HTMLElement>("[data-slot=split-view-item]"),
    (item) => item.textContent
  )
}

function checked() {
  return permissions.map(
    (name) => toggle(name).element().getAttribute("aria-checked") === "true"
  )
}

describe("RolesEditor", () => {
  it("opens the editor role with its permissions and member count", async () => {
    await render(<RolesEditor />)
    await expect
      .poll(counts)
      .toEqual([
        "Editor3 permissions",
        "Support1 permissions",
        "Viewer0 permissions",
      ])
    await expect.element(page.getByText("2 users have this role")).toBeVisible()
    expect(roleButton("Editor").element().getAttribute("aria-current")).toBe(
      "true"
    )
    expect(checked()).toEqual([true, true, false, true, false])
    await expect.element(save()).not.toBeInTheDocument()
    await expect.element(revert()).not.toBeInTheDocument()
  })

  it("switches between roles and shows each role's grants", async () => {
    await render(<RolesEditor />)
    await roleButton("Viewer").click()
    await expect.element(page.getByText("1 user has this role")).toBeVisible()
    expect(roleButton("Viewer").element().getAttribute("aria-current")).toBe(
      "true"
    )
    await expect.poll(checked).toEqual([false, false, false, false, false])
    await roleButton("Support").click()
    await expect.element(page.getByText("2 users have this role")).toBeVisible()
    await expect.poll(checked).toEqual([false, false, false, true, false])
  })

  it("marks the role dirty on a toggle and reverts it", async () => {
    await render(<RolesEditor />)
    await toggle("Delete").click()
    await expect
      .element(toggle("Delete"))
      .toHaveAttribute("aria-checked", "true")
    await expect.poll(() => counts()[0]).toBe("Editor4 permissions")
    await expect.element(save()).toBeVisible()
    await revert().click()
    await expect
      .element(toggle("Delete"))
      .toHaveAttribute("aria-checked", "false")
    await expect.poll(() => counts()[0]).toBe("Editor3 permissions")
    await expect.element(save()).not.toBeInTheDocument()
  })

  it("hides the actions when a toggle is flipped back by hand", async () => {
    await render(<RolesEditor />)
    await toggle("Publish").click()
    await expect.element(save()).toBeVisible()
    await toggle("Publish").click()
    await expect.element(save()).not.toBeInTheDocument()
  })

  it("keeps saved changes as the new baseline", async () => {
    await render(<RolesEditor />)
    await toggle("Export").click()
    await save().click()
    await expect.element(save()).not.toBeInTheDocument()
    await expect.poll(() => counts()[0]).toBe("Editor4 permissions")
    await toggle("Create drafts").click()
    await revert().click()
    await expect.poll(checked).toEqual([true, true, false, true, true])
  })

  it("keeps edits per role and reverts every role at once", async () => {
    await render(<RolesEditor />)
    await toggle("Delete").click()
    await roleButton("Viewer").click()
    await expect.poll(checked).toEqual([false, false, false, false, false])
    await toggle("Publish").click()
    await expect
      .poll(counts)
      .toEqual([
        "Editor4 permissions",
        "Support1 permissions",
        "Viewer1 permissions",
      ])
    await revert().click()
    await expect
      .poll(counts)
      .toEqual([
        "Editor3 permissions",
        "Support1 permissions",
        "Viewer0 permissions",
      ])
  })

  it("drills from the role list into a role on a phone", async () => {
    await page.viewport(390, 844)
    await render(<RolesEditor />)
    await expect.element(roleButton("Support")).toBeVisible()
    await expect.element(toggle("Publish")).not.toBeInTheDocument()
    await roleButton("Support").click()
    await expect.element(toggle("Customer data")).toBeVisible()
    await expect.poll(checked).toEqual([false, false, false, true, false])
    await expect
      .element(
        page
          .getByRole("navigation", { name: "More" })
          .getByRole("button", { name: "Roles" })
      )
      .toHaveAttribute("aria-current", "page")
    await page
      .getByRole("region", { name: "Support" })
      .getByRole("button", { name: "Roles" })
      .click()
    await expect.element(roleButton("Viewer")).toBeVisible()
    await expect.element(toggle("Publish")).not.toBeInTheDocument()
  })
})
