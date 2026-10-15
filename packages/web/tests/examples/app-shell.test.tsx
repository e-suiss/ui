import { waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import type { AppShellItem } from "@/components/patterns/app-shell"
import AppShellCollapsed from "@/examples/app-shell-collapsed"
import AppShellDemo from "@/examples/app-shell-demo"
import AppShellFloating from "@/examples/app-shell-floating"
import AppShellGrouped from "@/examples/app-shell-grouped"
import AppShellInset from "@/examples/app-shell-inset"
import AppShellLinks from "@/examples/app-shell-links"
import AppShellMoreTab from "@/examples/app-shell-more-tab"
import AppShellOffcanvas from "@/examples/app-shell-offcanvas"
import AppShellRightSide from "@/examples/app-shell-right-side"
import AppShellWithHeaderAndFooter from "@/examples/app-shell-with-header-and-footer"
import { isMacPlatform } from "@/hooks/use-platform"
import { type ExampleContext, renderExample } from "@/tests/render-example"

const items: AppShellItem[] = [
  {
    value: "home",
    label: "Home",
    icon: (
      <IconPlaceholder
        lucide="HouseIcon"
        tabler="IconHome"
        hugeicons="Home01Icon"
        phosphor="HouseIcon"
        remixicon="RiHomeLine"
      />
    ),
  },
  {
    value: "inbox",
    label: "Inbox",
    icon: (
      <IconPlaceholder
        lucide="InboxIcon"
        tabler="IconInbox"
        hugeicons="InboxIcon"
        phosphor="TrayIcon"
        remixicon="RiInboxLine"
      />
    ),
    badge: 12,
  },
  {
    value: "calendar",
    label: "Calendar",
    icon: (
      <IconPlaceholder
        lucide="CalendarIcon"
        tabler="IconCalendar"
        hugeicons="Calendar01Icon"
        phosphor="CalendarBlankIcon"
        remixicon="RiCalendarLine"
      />
    ),
  },
  {
    value: "settings",
    label: "Settings",
    icon: (
      <IconPlaceholder
        lucide="SettingsIcon"
        tabler="IconSettings"
        hugeicons="Settings01Icon"
        phosphor="GearIcon"
        remixicon="RiSettingsLine"
      />
    ),
  },
]
function sidebarOf(canvasElement: HTMLElement) {
  return canvasElement.querySelector("[data-slot=sidebar]")
}
function headerTrigger(canvasElement: HTMLElement) {
  return canvasElement.querySelector<HTMLElement>("[data-slot=sidebar-trigger]")
}
function pressSidebarHotkey() {
  return userEvent.keyboard(
    isMacPlatform() ? "{Meta>}b{/Meta}" : "{Control>}b{/Control}"
  )
}
async function navigatesAndCollapses({
  canvas,
  canvasElement,
  step,
}: ExampleContext) {
  await step("selecting an item switches the page", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Calendar" }))
    await expect(
      canvas.getByRole("heading", { level: 1, name: "Calendar" })
    ).toBeVisible()
    await expect(
      canvas.getByRole("button", { name: "Calendar" })
    ).toHaveAttribute("aria-current", "page")
    await expect(
      canvas.getByRole("button", { name: "Home" })
    ).not.toHaveAttribute("aria-current")
  })

  await step("the header trigger collapses and expands it", async () => {
    const sidebar = sidebarOf(canvasElement)
    const trigger = headerTrigger(canvasElement)
    await expect(sidebar).toHaveAttribute("data-state", "expanded")
    if (trigger) await userEvent.click(trigger)
    await expect(sidebar).toHaveAttribute("data-state", "collapsed")
    if (trigger) await userEvent.click(trigger)
    await expect(sidebar).toHaveAttribute("data-state", "expanded")
  })
}

test("Default", async () => {
  const { canvas, canvasElement, step } = await renderExample(<AppShellDemo />)

  await step("starts on the first item", async () => {
    await expect(
      canvas.getByRole("heading", { level: 1, name: "Home" })
    ).toBeVisible()
    await expect(canvas.getByRole("button", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page"
    )
  })

  await step("selecting an item switches the page", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Inbox" }))
    await expect(
      canvas.getByRole("heading", { level: 1, name: "Inbox" })
    ).toBeVisible()
    await expect(canvas.getByRole("button", { name: "Inbox" })).toHaveAttribute(
      "aria-current",
      "page"
    )
    await expect(
      canvas.getByRole("button", { name: "Home" })
    ).not.toHaveAttribute("aria-current")
  })

  await step("the header trigger collapses the sidebar to icons", async () => {
    const sidebar = sidebarOf(canvasElement)
    await expect(sidebar).toHaveAttribute("data-state", "expanded")
    const trigger = headerTrigger(canvasElement)
    await expect(trigger).toHaveAccessibleName("Toggle Sidebar")
    if (trigger) await userEvent.click(trigger)
    await expect(sidebar).toHaveAttribute("data-state", "collapsed")
    await expect(sidebar).toHaveAttribute("data-collapsible", "icon")
  })

  await step("the keyboard shortcut expands it again", async () => {
    await pressSidebarHotkey()
    await expect(sidebarOf(canvasElement)).toHaveAttribute(
      "data-state",
      "expanded"
    )
  })
})
test("With Header And Footer", async () => {
  const context = await renderExample(<AppShellWithHeaderAndFooter />)

  const { canvas, canvasElement, step } = context
  await step("renders the header and footer around the items", async () => {
    const sidebar = sidebarOf(canvasElement)
    const header = sidebar?.querySelector("[data-slot=sidebar-header]")
    const footer = sidebar?.querySelector("[data-slot=sidebar-footer]")
    await expect(header).toHaveTextContent("Acme Inc.")
    await expect(footer).toHaveTextContent("jordan@acme.com")
    await expect(canvas.getByText("Jordan Lee")).toBeVisible()
  })

  await navigatesAndCollapses(context)
})
test("Grouped", async () => {
  const { canvas, step } = await renderExample(<AppShellGrouped />)

  await step("shows the group labels and a disabled item", async () => {
    await expect(canvas.getByText("Platform")).toBeVisible()
    await expect(canvas.getByText("Workspace")).toBeVisible()
    await expect(canvas.getByRole("button", { name: "Support" })).toBeDisabled()
  })

  await step("selects an item from the second group", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Team" }))
    await expect(
      canvas.getByRole("heading", { level: 1, name: "Team" })
    ).toBeVisible()
  })
})
test("More Tab", async () => {
  const { canvas, step } = await renderExample(<AppShellMoreTab />)

  await step("opens on the default item", async () => {
    await expect(
      canvas.getByRole("heading", { level: 1, name: "Team" })
    ).toBeVisible()
    await expect(canvas.getByRole("button", { name: "Team" })).toHaveAttribute(
      "aria-current",
      "page"
    )
  })
})
test("Links", async () => {
  const { canvas, step } = await renderExample(<AppShellLinks />)

  await step("renders every item as a link to its route", async () => {
    await expect(canvas.getAllByRole("link")).toHaveLength(items.length)
    await expect(canvas.getByRole("link", { name: "Inbox" })).toHaveAttribute(
      "href",
      "#inbox"
    )
    await expect(canvas.getByRole("link", { name: "Home" })).toHaveAttribute(
      "aria-current",
      "page"
    )
  })
})
test("Floating", async () => {
  const context = await renderExample(<AppShellFloating />)

  await context.step("renders the floating variant", async () => {
    await expect(sidebarOf(context.canvasElement)).toHaveAttribute(
      "data-variant",
      "floating"
    )
  })

  await navigatesAndCollapses(context)
})
test("Inset", async () => {
  const context = await renderExample(<AppShellInset />)

  await context.step("renders the inset variant", async () => {
    await expect(sidebarOf(context.canvasElement)).toHaveAttribute(
      "data-variant",
      "inset"
    )
  })

  await navigatesAndCollapses(context)
})
test("Collapsed", async () => {
  const { canvas, canvasElement, step } = await renderExample(
    <AppShellCollapsed />
  )

  await step("starts collapsed and names icons with a tooltip", async () => {
    await expect(sidebarOf(canvasElement)).toHaveAttribute(
      "data-state",
      "collapsed"
    )
    await userEvent.hover(canvas.getByRole("button", { name: "Calendar" }))
    await waitFor(
      () =>
        expect(
          document.querySelector("[data-slot=tooltip-content]")
        ).toHaveTextContent("Calendar"),
      { timeout: 2000 }
    )
    await userEvent.unhover(canvas.getByRole("button", { name: "Calendar" }))
  })

  await step("the header trigger expands it", async () => {
    const trigger = headerTrigger(canvasElement)
    if (trigger) await userEvent.click(trigger)
    await expect(sidebarOf(canvasElement)).toHaveAttribute(
      "data-state",
      "expanded"
    )
  })
})
test("Offcanvas", async () => {
  const { canvas, canvasElement, step } = await renderExample(
    <AppShellOffcanvas />
  )

  const home = canvas.getByRole("button", { name: "Home" })

  await step("collapsing slides the whole sidebar away", async () => {
    await expect(home).toBeVisible()
    await pressSidebarHotkey()
    await expect(sidebarOf(canvasElement)).toHaveAttribute(
      "data-collapsible",
      "offcanvas"
    )
    await waitFor(() =>
      expect(home.getBoundingClientRect().right).toBeLessThanOrEqual(0)
    )
  })

  await step("keeps the hidden sidebar out of the tab order", async () => {
    await waitFor(() => expect(home).not.toBeVisible())
    await pressSidebarHotkey()
    await waitFor(() => expect(home).toBeVisible())
  })
})
test("Right Side", async () => {
  const context = await renderExample(<AppShellRightSide />)

  await context.step("places the sidebar on the right", async () => {
    const sidebar = sidebarOf(context.canvasElement)
    await expect(sidebar).toHaveAttribute("data-side", "right")
    const home = context.canvas.getByRole("button", { name: "Home" })
    await expect(home.getBoundingClientRect().left).toBeGreaterThan(
      window.innerWidth / 2
    )
  })

  await navigatesAndCollapses(context)
})
