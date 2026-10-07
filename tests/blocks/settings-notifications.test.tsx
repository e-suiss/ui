import { afterEach, describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"

import { SettingsNotifications } from "@/components/blocks/settings-notifications"

afterEach(async () => {
  await page.viewport(1280, 800)
})

const previewName = /^Lock screen preview/

const preview = () => page.getByRole("img", { name: previewName })
const label = () => preview().element().getAttribute("aria-label")
const footnote = () => preview().element().lastElementChild?.textContent
const bodies = () =>
  Array.from(preview().element().querySelectorAll("p"))
    .filter(
      (node) =>
        node.previousElementSibling?.firstElementChild?.textContent ===
        "Riley Morgan"
    )
    .map((node) => node.textContent)
const notifications = () => bodies().length

const allow = () => page.getByRole("switch", { name: "Allow Notifications" })
const alert = (name: string) => page.getByRole("button", { name, exact: true })
const bannerStyle = (name: string) =>
  page.getByRole("group", { name: "Banner style" }).getByRole("button", {
    name,
  })

async function choose(trigger: string, option: string) {
  await page.getByRole("combobox", { name: trigger }).click()
  await page.getByRole("option", { name: option }).click()
}

describe("SettingsNotifications", () => {
  it("starts with everything on and a temporary banner", async () => {
    await render(<SettingsNotifications />)
    await expect.element(preview()).toBeVisible()
    expect(label()).toBe("Lock screen preview. Banner shows briefly.")
    expect(footnote()).toBe("Banner shows briefly")
    for (const name of ["Lock Screen", "Notification Center", "Banners"]) {
      await expect.element(alert(name)).toHaveAttribute("aria-pressed", "true")
    }
    await expect.element(allow()).toHaveAttribute("aria-checked", "true")
    await expect
      .element(bannerStyle("Temporary"))
      .toHaveAttribute("aria-pressed", "true")
  })

  it("lets a temporary banner slide away", async () => {
    await render(<SettingsNotifications />)
    await expect.poll(notifications).toBe(2)
    await expect.poll(notifications, { timeout: 5000 }).toBe(1)
  })

  it("keeps a persistent banner on screen", async () => {
    await render(<SettingsNotifications />)
    await bannerStyle("Persistent").click()
    await expect
      .element(bannerStyle("Persistent"))
      .toHaveAttribute("aria-pressed", "true")
    await expect.poll(footnote).toBe("Banner stays until dismissed")
    expect(label()).toBe("Lock screen preview. Banner stays until dismissed.")
    await new Promise((resolve) => setTimeout(resolve, 3000))
    expect(notifications()).toBe(2)
  })

  it("replays the banner when a setting changes", async () => {
    await render(<SettingsNotifications />)
    await expect.poll(notifications, { timeout: 5000 }).toBe(1)
    await alert("Notification Center").click()
    await expect
      .element(alert("Notification Center"))
      .toHaveAttribute("aria-pressed", "false")
    await expect.poll(notifications).toBe(2)
  })

  it("turns banners off and hides the banner style", async () => {
    await render(<SettingsNotifications />)
    await alert("Banners").click()
    await expect
      .element(alert("Banners"))
      .toHaveAttribute("aria-pressed", "false")
    await expect
      .element(page.getByRole("group", { name: "Banner style" }))
      .not.toBeInTheDocument()
    await expect.poll(footnote).toBe("No banners")
    expect(notifications()).toBe(1)
  })

  it("removes the lock screen notification when lock screen is off", async () => {
    await render(<SettingsNotifications />)
    await bannerStyle("Persistent").click()
    await alert("Lock Screen").click()
    await expect.poll(notifications).toBe(1)
    await alert("Banners").click()
    await expect.poll(notifications).toBe(0)
  })

  it("disables every option when notifications are off", async () => {
    await render(<SettingsNotifications />)
    await page.getByText("Allow Notifications").click()
    await expect.element(allow()).toHaveAttribute("aria-checked", "false")
    await expect.poll(footnote).toBe("Notifications are off")
    expect(notifications()).toBe(0)
    const options = page.getByRole("switch", { name: "Sounds" }).element()
    const section = options.closest("[inert]")
    expect(section?.hasAttribute("data-disabled")).toBe(true)
    await allow().click()
    await expect.poll(footnote).toBe("Banner shows briefly")
    expect(options.closest("[inert]")).toBeNull()
  })

  it("hides message text when previews are never shown", async () => {
    await render(<SettingsNotifications />)
    await bannerStyle("Persistent").click()
    await expect
      .poll(bodies)
      .toEqual([
        "Is the weekend trip to the coast still on?",
        "Is the weekend trip to the coast still on?",
      ])
    await choose("Show Previews", "Never")
    await expect.poll(bodies).toEqual(["Notification", "Notification"])
    await expect
      .element(
        page.getByRole("combobox", { name: "Show Previews" }).getByText("Never")
      )
      .toBeVisible()
  })

  it("toggles sounds, badges and grouping independently", async () => {
    await render(<SettingsNotifications />)
    await page.getByText("Sounds", { exact: true }).click()
    await expect
      .element(page.getByRole("switch", { name: "Sounds" }))
      .toHaveAttribute("aria-checked", "false")
    await expect
      .element(page.getByRole("switch", { name: "Badges" }))
      .toHaveAttribute("aria-checked", "true")
    await choose("Notification Grouping", "By App")
    await expect
      .element(
        page
          .getByRole("combobox", { name: "Notification Grouping" })
          .getByText("By App")
      )
      .toBeVisible()
  })

  it("stacks the preview under the settings on a phone", async () => {
    await render(<SettingsNotifications />)
    const heading = page.getByRole("heading", { name: "Messages" })
    await expect.element(preview()).toBeVisible()
    const beside = () =>
      preview().element().getBoundingClientRect().left >
      heading.element().getBoundingClientRect().right
    expect(beside()).toBe(true)
    await page.viewport(390, 844)
    await expect.poll(beside).toBe(false)
    expect(preview().element().getBoundingClientRect().top).toBeGreaterThan(
      page
        .getByRole("combobox", { name: "Notification Grouping" })
        .element()
        .getBoundingClientRect().bottom
    )
  })
})
