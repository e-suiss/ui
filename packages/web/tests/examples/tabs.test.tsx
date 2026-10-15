import { waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import TabsDemo from "@/examples/tabs-demo"
import TabsDisabledTab from "@/examples/tabs-disabled-tab"
import TabsLine from "@/examples/tabs-line"
import TabsManyTabs from "@/examples/tabs-many-tabs"
import TabsManyTabsLine from "@/examples/tabs-many-tabs-line"
import TabsVertical from "@/examples/tabs-vertical"
import TabsWithIcons from "@/examples/tabs-with-icons"
import { renderExample } from "@/tests/render-example"

const tabs = [
  {
    value: "account",
    label: "Account",
    content: "Update your name, email address, and profile photo.",
  },
  {
    value: "notifications",
    label: "Notifications",
    content: "Choose which updates you receive by email and push.",
  },
  {
    value: "settings",
    label: "Settings",
    content: "Manage language, time zone, and privacy preferences.",
  },
] as const

test("Default", async () => {
  const { canvas, step } = await renderExample(<TabsDemo />)

  const account = canvas.getByRole("tab", { name: "Account" })
  const notifications = canvas.getByRole("tab", { name: "Notifications" })

  await step("selects the default tab and its panel", async () => {
    await expect(canvas.getByRole("tablist")).toBeVisible()
    await expect(account).toHaveAttribute("aria-selected", "true")
    await expect(canvas.getByRole("tabpanel")).toHaveTextContent(
      tabs[0].content
    )
  })

  await step("switches panels on click", async () => {
    await userEvent.click(notifications)
    await expect(notifications).toHaveAttribute("aria-selected", "true")
    await expect(account).toHaveAttribute("aria-selected", "false")
    await waitFor(() =>
      expect(canvas.getByRole("tabpanel")).toHaveTextContent(tabs[1].content)
    )
  })

  await step("moves focus with arrow keys and selects with Enter", async () => {
    await userEvent.keyboard("{ArrowRight}")
    const settings = canvas.getByRole("tab", { name: "Settings" })
    await expect(settings).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    await expect(settings).toHaveAttribute("aria-selected", "true")
    await userEvent.keyboard("{ArrowRight}")
    await expect(account).toHaveFocus()
  })
})
test("Line", async () => {
  const { canvas, step } = await renderExample(<TabsLine />)

  await step("switches tabs on click", async () => {
    const settings = canvas.getByRole("tab", { name: "Settings" })
    await userEvent.click(settings)
    await expect(settings).toHaveAttribute("aria-selected", "true")
  })
})
test("Vertical", async () => {
  const { canvas, step } = await renderExample(<TabsVertical />)

  await step("moves between tabs with up and down keys", async () => {
    await expect(canvas.getByRole("tablist")).toHaveAttribute(
      "aria-orientation",
      "vertical"
    )
    await userEvent.click(canvas.getByRole("tab", { name: "Account" }))
    await userEvent.keyboard("{ArrowDown}")
    const notifications = canvas.getByRole("tab", { name: "Notifications" })
    await expect(notifications).toHaveFocus()
    await userEvent.keyboard(" ")
    await expect(notifications).toHaveAttribute("aria-selected", "true")
  })
})
test("With Icons", async () => {
  const { canvas, step } = await renderExample(<TabsWithIcons />)

  const account = canvas.getByRole("tab", { name: "Account" })
  const notifications = canvas.getByRole("tab", { name: "Notifications" })
  const settingsTab = canvas.getByRole("tab", { name: "Settings" })

  await step("names each tab by its text beside the icon", async () => {
    await expect(account).toHaveAttribute("aria-selected", "true")
    await expect(account.querySelector("svg")).toBeInTheDocument()
  })

  await step("switches panels on click", async () => {
    await userEvent.click(settingsTab)
    await expect(settingsTab).toHaveAttribute("aria-selected", "true")
    await waitFor(() =>
      expect(canvas.getByRole("tabpanel")).toHaveTextContent(tabs[2].content)
    )
  })

  await step("selects with the arrow keys", async () => {
    await userEvent.keyboard("{ArrowLeft}")
    await expect(notifications).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    await expect(notifications).toHaveAttribute("aria-selected", "true")
    await waitFor(() =>
      expect(canvas.getByRole("tabpanel")).toHaveTextContent(tabs[1].content)
    )
  })
})
test("Disabled Tab", async () => {
  const { canvas, step } = await renderExample(<TabsDisabledTab />)

  const billing = canvas.getByRole("tab", { name: "Billing" })

  await step("cannot select the disabled tab from the keyboard", async () => {
    await expect(billing).toHaveAttribute("aria-disabled", "true")
    await userEvent.click(canvas.getByRole("tab", { name: "Notifications" }))
    await userEvent.keyboard("{ArrowRight}{Enter}")
    await expect(billing).toHaveAttribute("aria-selected", "false")
    await expect(
      canvas.getByRole("tab", { name: "Notifications" })
    ).toHaveAttribute("aria-selected", "true")
  })

  await step("ignores clicks on the disabled tab", async () => {
    await userEvent.click(billing, { pointerEventsCheck: 0 })
    await expect(billing).toHaveAttribute("aria-selected", "false")
  })
})
test("Many Tabs", async () => {
  const { canvas, step } = await renderExample(<TabsManyTabs />)

  await step("jumps to the first and last tabs", async () => {
    await userEvent.click(canvas.getByRole("tab", { name: "General" }))
    await userEvent.keyboard("{End}")
    const billing = canvas.getByRole("tab", { name: "Billing" })
    await expect(billing).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    await expect(billing).toHaveAttribute("aria-selected", "true")
    await waitFor(() =>
      expect(canvas.getByRole("tabpanel")).toHaveTextContent("Billing settings")
    )
    await userEvent.keyboard("{Home}")
    await expect(canvas.getByRole("tab", { name: "General" })).toHaveFocus()
  })
})
test("Many Tabs Line", async () => {
  const { canvas, step } = await renderExample(<TabsManyTabsLine />)

  const privacy = canvas.getByRole("tab", { name: "Privacy" })
  const appearance = canvas.getByRole("tab", { name: "Appearance" })

  await step("switches panels on click", async () => {
    await expect(canvas.getByRole("tab", { name: "General" })).toHaveAttribute(
      "aria-selected",
      "true"
    )
    await userEvent.click(privacy)
    await expect(privacy).toHaveAttribute("aria-selected", "true")
    await waitFor(() =>
      expect(canvas.getByRole("tabpanel")).toHaveTextContent("Privacy settings")
    )
  })

  await step("selects with the arrow keys", async () => {
    await userEvent.keyboard("{ArrowRight}")
    await expect(appearance).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    await expect(appearance).toHaveAttribute("aria-selected", "true")
    await expect(privacy).toHaveAttribute("aria-selected", "false")
    await waitFor(() =>
      expect(canvas.getByRole("tabpanel")).toHaveTextContent(
        "Appearance settings"
      )
    )
  })
})
