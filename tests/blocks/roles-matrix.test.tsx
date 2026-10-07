import { afterEach, describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"

import { RolesMatrix } from "@/components/blocks/roles-matrix"

afterEach(async () => {
  await page.viewport(1280, 800)
})

const roles = ["Admin", "Editor", "Support", "Viewer"]

const box = (label: string) =>
  page.getByRole("checkbox", { name: label, exact: true })

const saveName = /^Save(d)?$/

const saveButton = () => page.getByRole("button", { name: saveName })

function row(group: string, permission: string) {
  return roles.map(
    (role) =>
      box(`${group} ${permission} for ${role}`)
        .element()
        .getAttribute("aria-checked") === "true"
  )
}

describe("RolesMatrix", () => {
  it("renders every grant from the matrix", async () => {
    await render(<RolesMatrix />)
    await expect.element(box("Content View for Viewer")).toBeVisible()
    expect(document.querySelectorAll("[data-slot=checkbox]")).toHaveLength(
      9 * 4
    )
    expect(row("Content", "Create")).toEqual([true, true, false, false])
    expect(row("Orders", "Issue refunds")).toEqual([true, false, true, false])
    expect(row("Management", "Billing")).toEqual([true, false, false, false])
  })

  it("locks the admin column", async () => {
    await render(<RolesMatrix />)
    await expect.element(box("Content Delete for Admin")).toBeVisible()
    for (const checkbox of document.querySelectorAll<HTMLElement>(
      "[data-slot=checkbox]"
    )) {
      const admin = checkbox.getAttribute("aria-label")?.endsWith("for Admin")
      expect(checkbox.getAttribute("aria-disabled") === "true").toBe(!!admin)
      if (admin) expect(checkbox.getAttribute("aria-checked")).toBe("true")
    }
    await box("Management Billing for Admin").click({ force: true })
    await expect
      .element(box("Management Billing for Admin"))
      .toHaveAttribute("aria-checked", "true")
    await expect.element(saveButton()).toBeDisabled()
  })

  it("enables save after a change and confirms it once saved", async () => {
    await render(<RolesMatrix />)
    await expect.element(saveButton()).toHaveTextContent("Save")
    await expect.element(saveButton()).toBeDisabled()
    await box("Content Delete for Editor").click()
    await expect
      .poll(() => row("Content", "Delete"))
      .toEqual([true, true, false, false])
    await expect.element(saveButton()).toBeEnabled()
    await saveButton().click()
    await expect.element(saveButton()).toHaveTextContent("Saved")
    await expect.element(saveButton()).toBeDisabled()
    expect(row("Content", "Delete")).toEqual([true, true, false, false])
  })

  it("returns to save when a saved matrix changes again", async () => {
    await render(<RolesMatrix />)
    await box("Orders Issue refunds for Support").click()
    await saveButton().click()
    await expect.element(saveButton()).toHaveTextContent("Saved")
    await box("Orders Issue refunds for Support").click()
    await expect.element(saveButton()).toHaveTextContent("Save")
    await expect.element(saveButton()).toBeEnabled()
    expect(row("Orders", "Issue refunds")).toEqual([true, false, true, false])
  })

  it("toggles only the clicked cell", async () => {
    await render(<RolesMatrix />)
    await box("Orders View for Viewer").click()
    await expect
      .poll(() => row("Orders", "View"))
      .toEqual([true, true, true, false])
    expect(row("Content", "View")).toEqual([true, true, true, true])
  })

  it("scrolls the matrix sideways on a phone", async () => {
    await page.viewport(390, 844)
    await render(<RolesMatrix />)
    await expect.element(box("Content View for Viewer")).toBeInTheDocument()
    const scroller = box("Content View for Viewer")
      .element()
      .closest<HTMLElement>(".overflow-x-auto")
    await expect
      .poll(() => (scroller ? scroller.scrollWidth - scroller.clientWidth : 0))
      .toBeGreaterThan(0)
  })
})
