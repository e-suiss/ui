import { afterEach, describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"

import { SettingsDevice } from "@/components/blocks/settings-device"

afterEach(async () => {
  await page.viewport(1280, 800)
})

const search = () => page.getByRole("searchbox", { name: "Search settings" })
const airplane = () => page.getByRole("switch", { name: "Airplane Mode" })
const focusMode = () => page.getByRole("switch", { name: "Focus" })
const row = (label: string) =>
  page.getByRole("listitem").filter({ hasText: label })

function labels() {
  return Array.from(
    document.querySelectorAll<HTMLElement>("[data-slot=item-title]"),
    (title) => title.textContent
  )
}

function detail(label: string) {
  const item = Array.from(
    document.querySelectorAll<HTMLElement>("[data-slot=item]")
  ).find(
    (node) =>
      node.querySelector("[data-slot=item-title]")?.textContent === label
  )
  return item?.querySelector("[data-slot=item-actions]")?.textContent ?? null
}

const statusBar = () =>
  document.querySelector<HTMLElement>("[aria-hidden].h-12\\.5")

describe("SettingsDevice", () => {
  it("lists every setting with its current detail", async () => {
    await render(<SettingsDevice />)
    await expect.element(page.getByText("Jamie Rivera")).toBeVisible()
    expect(labels()).toEqual([
      "Jamie Rivera",
      "Airplane Mode",
      "Wi-Fi",
      "Bluetooth",
      "Cellular",
      "Notifications",
      "Sounds & Haptics",
      "Focus",
      "Screen Time",
      "General",
      "Display & Brightness",
    ])
    expect(detail("Wi-Fi")).toBe("Home")
    expect(detail("Bluetooth")).toBe("On")
    expect(detail("Cellular")).toBe("")
    await expect.element(airplane()).toHaveAttribute("aria-checked", "false")
    await expect.element(focusMode()).toHaveAttribute("aria-checked", "false")
    await expect
      .element(page.getByRole("link", { name: "Wi-Fi Home" }))
      .toHaveAttribute("href", "#Wi-Fi")
  })

  it("turns off radios in airplane mode", async () => {
    await render(<SettingsDevice />)
    await airplane().click()
    await expect.element(airplane()).toHaveAttribute("aria-checked", "true")
    await expect.poll(() => detail("Wi-Fi")).toBe("Off")
    expect(detail("Bluetooth")).toBe("Off")
    expect(detail("Cellular")).toBe("Off")
    await airplane().click()
    await expect.poll(() => detail("Cellular")).toBe("")
  })

  it("hides the status bar wifi icon while wifi is off", async () => {
    await render(<SettingsDevice />)
    await expect.poll(() => statusBar()?.querySelectorAll("svg").length).toBe(2)
    await page.getByText("Airplane Mode").click()
    await expect.poll(() => statusBar()?.querySelectorAll("svg").length).toBe(1)
  })

  it("toggles focus without touching the radios", async () => {
    await render(<SettingsDevice />)
    await page.getByText("Focus", { exact: true }).click()
    await expect.element(focusMode()).toHaveAttribute("aria-checked", "true")
    expect(detail("Wi-Fi")).toBe("Home")
    expect(detail("Bluetooth")).toBe("On")
  })

  it("filters rows by a case-insensitive search", async () => {
    await render(<SettingsDevice />)
    await search().fill("BLUE")
    await expect.poll(labels).toEqual(["Bluetooth"])
    await search().fill("s")
    await expect
      .poll(labels)
      .toEqual([
        "Notifications",
        "Sounds & Haptics",
        "Focus",
        "Screen Time",
        "Display & Brightness",
      ])
    expect(document.querySelectorAll("[data-slot=item-group]")).toHaveLength(2)
    await expect.element(page.getByText("Jamie Rivera")).not.toBeInTheDocument()
  })

  it("shows no results and recovers when the search clears", async () => {
    await render(<SettingsDevice />)
    await search().fill("battery")
    await expect.element(page.getByText("No Results")).toBeVisible()
    await expect.poll(labels).toEqual([])
    await search().fill("")
    await expect.element(page.getByText("No Results")).not.toBeInTheDocument()
    await expect.poll(() => labels().length).toBe(11)
  })

  it("keeps the toggles working inside a search", async () => {
    await render(<SettingsDevice />)
    await search().fill("air")
    await airplane().click()
    await search().fill("")
    await expect.poll(() => detail("Wi-Fi")).toBe("Off")
    await expect.element(row("Airplane Mode").getByRole("switch")).toBeChecked()
  })

  it("drops the device frame on a phone", async () => {
    await render(<SettingsDevice />)
    await expect.poll(() => statusBar()?.offsetHeight).toBeGreaterThan(0)
    await page.viewport(390, 844)
    await expect.poll(() => statusBar()?.offsetHeight).toBe(0)
    await expect
      .element(page.getByRole("heading", { name: "Settings" }))
      .toBeVisible()
  })
})
