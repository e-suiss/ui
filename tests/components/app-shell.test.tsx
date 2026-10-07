import {
  CalendarBlankIcon,
  ChartBarIcon,
  FolderIcon,
  GearIcon,
  HouseIcon,
  LifebuoyIcon,
  TrayIcon,
  UsersIcon,
} from "@phosphor-icons/react"
import * as React from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import {
  AppShell,
  type AppShellItem,
  AppShellTrigger,
} from "@/components/patterns/app-shell"
import { isMacPlatform } from "@/hooks/use-platform"

afterEach(async () => {
  await page.viewport(1280, 800)
  window.history.replaceState(null, "", window.location.pathname)
})

const items: AppShellItem[] = [
  { value: "home", label: "Home", icon: <HouseIcon /> },
  { value: "inbox", label: "Inbox", icon: <TrayIcon />, badge: 12 },
  { value: "calendar", label: "Calendar", icon: <CalendarBlankIcon /> },
  { value: "settings", label: "Settings", icon: <GearIcon /> },
]

const manyItems: AppShellItem[] = [
  { value: "home", label: "Home", icon: <HouseIcon />, group: "Platform" },
  { value: "inbox", label: "Inbox", icon: <TrayIcon />, group: "Platform" },
  {
    value: "calendar",
    label: "Calendar",
    icon: <CalendarBlankIcon />,
    group: "Platform",
  },
  {
    value: "reports",
    label: "Reports",
    icon: <ChartBarIcon />,
    group: "Platform",
  },
  {
    value: "projects",
    label: "Projects",
    icon: <FolderIcon />,
    group: "Platform",
  },
  { value: "team", label: "Team", icon: <UsersIcon />, group: "Workspace" },
  {
    value: "preferences",
    label: "Preferences",
    icon: <GearIcon />,
    group: "Workspace",
  },
  {
    value: "support",
    label: "Support",
    icon: <LifebuoyIcon />,
    group: "Workspace",
    disabled: true,
  },
]

type ShellProps = Partial<React.ComponentProps<typeof AppShell>>

function Shell(props: ShellProps) {
  return (
    <AppShell items={items} {...props}>
      <header>
        <AppShellTrigger />
        <h1>Page</h1>
      </header>
    </AppShell>
  )
}

function Controlled({ onOpenChange }: { onOpenChange: () => void }) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("home")
  return (
    <AppShell
      items={items}
      open={open}
      onOpenChange={(next) => {
        onOpenChange()
        setOpen(next)
      }}
      value={value}
      onValueChange={setValue}
    >
      <AppShellTrigger />
      <p>
        {open ? "Expanded" : "Collapsed"} on {value}
      </p>
    </AppShell>
  )
}

function element(slot: string) {
  const node = document.querySelector<HTMLElement>(`[data-slot=${slot}]`)
  if (!node) throw new Error(`${slot} not rendered`)
  return node
}

const navItem = (name: string) =>
  page.getByRole("button", { name, exact: true })
const toggle = () =>
  page.getByRole("button", { name: "Toggle Sidebar" }).first()
const sidebarState = () => element("sidebar").dataset.state
const gapWidth = () => element("sidebar-gap").offsetWidth

function current() {
  return Array.from(
    document.querySelectorAll<HTMLElement>("[aria-current=page]"),
    (item) => item.textContent
  )
}

function tabs() {
  return Array.from(
    document.querySelectorAll<HTMLElement>(
      "[data-slot=tab-bar-item]:not([data-overflow])"
    ),
    (item) => item.textContent
  )
}

function tooltip() {
  const popup = document.querySelector<HTMLElement>(
    "[data-slot=tooltip-content]"
  )
  return popup?.checkVisibility() ? popup.textContent : undefined
}

const modifier = () => (isMacPlatform() ? "Meta" : "Control")

const wait = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms))

describe("AppShell on desktop", () => {
  it("lists every item in the sidebar with the first one current", async () => {
    await render(<Shell />)
    for (const item of items) {
      await expect.element(navItem(item.label)).toBeVisible()
    }
    expect(current()).toEqual(["Home"])
    await expect.element(element("sidebar-menu-badge")).toHaveTextContent("12")
    await expect
      .element(page.getByRole("heading", { name: "Page" }))
      .toBeVisible()
    expect(document.querySelector("[data-slot=tab-bar]")).toBeNull()
  })

  it("selects an item and reports the change once", async () => {
    const onValueChange = vi.fn()
    await render(<Shell onValueChange={onValueChange} />)
    await navItem("Calendar").click()
    await expect.poll(current).toEqual(["Calendar"])
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith("calendar")
    await navItem("Calendar").click()
    expect(onValueChange).toHaveBeenCalledTimes(1)
  })

  it("starts from the default value and keeps a fixed controlled one", async () => {
    const onValueChange = vi.fn()
    const { rerender } = await render(<Shell defaultValue="inbox" />)
    expect(current()).toEqual(["Inbox"])
    await rerender(<Shell value="settings" onValueChange={onValueChange} />)
    await expect.poll(current).toEqual(["Settings"])
    await navItem("Home").click()
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith("home")
    expect(current()).toEqual(["Settings"])
  })

  it("groups items under their labels", async () => {
    await render(<Shell items={manyItems} />)
    const labels = Array.from(
      document.querySelectorAll<HTMLElement>("[data-slot=sidebar-group-label]"),
      (label) => label.textContent
    )
    expect(labels).toEqual(["Platform", "Workspace"])
    const groups = Array.from(
      document.querySelectorAll<HTMLElement>("[data-slot=sidebar-group]"),
      (group) => group.querySelectorAll("[data-slot=sidebar-menu-item]").length
    )
    expect(groups).toEqual([5, 3])
  })

  it("renders the header and footer", async () => {
    await render(
      <Shell header={<span>Acme Inc.</span>} footer={<span>Jordan Lee</span>} />
    )
    await expect
      .element(element("sidebar-header").querySelector("span"))
      .toHaveTextContent("Acme Inc.")
    await expect
      .element(element("sidebar-footer").querySelector("span"))
      .toHaveTextContent("Jordan Lee")
  })

  it("renders links for items with an href", async () => {
    await render(
      <Shell
        items={items.map((item) => ({ ...item, href: `#${item.value}` }))}
      />
    )
    const inbox = page.getByRole("link", { name: "Inbox" })
    await expect.element(inbox).toHaveAttribute("href", "#inbox")
    await inbox.click()
    expect(window.location.hash).toBe("#inbox")
    await expect.poll(current).toEqual(["Inbox"])
  })

  it("collapses to icons with the trigger and expands again", async () => {
    await render(<Shell />)
    await expect.poll(gapWidth).toBe(256)
    expect(sidebarState()).toBe("expanded")
    await toggle().click()
    await expect.poll(sidebarState).toBe("collapsed")
    await expect.poll(gapWidth).toBe(48)
    await expect.element(navItem("Inbox")).toBeVisible()
    await toggle().click()
    await expect.poll(gapWidth).toBe(256)
  })

  it("shows the label as a tooltip while collapsed", async () => {
    await render(<Shell defaultOpen={false} />)
    await expect.poll(gapWidth).toBe(48)
    await navItem("Calendar").hover()
    await expect.poll(tooltip).toBe("Calendar")
  })

  it("does not show tooltips while expanded", async () => {
    await render(<Shell />)
    await navItem("Calendar").hover()
    await wait(800)
    expect(tooltip()).toBeUndefined()
  })

  it("hides the sidebar entirely when offcanvas", async () => {
    await render(<Shell collapsible="offcanvas" />)
    await toggle().click()
    await expect.poll(gapWidth).toBe(0)
    await expect
      .poll(() => element("sidebar-container").getBoundingClientRect().right)
      .toBeLessThanOrEqual(0)
  })

  it("cannot collapse when collapsible is none", async () => {
    await render(<Shell collapsible="none" />)
    expect(document.querySelector("[data-slot=sidebar-rail]")).toBeNull()
    await toggle().click()
    await wait(300)
    expect(element("sidebar").offsetWidth).toBe(256)
  })

  it("toggles with the rail and leaves it out when disabled", async () => {
    const { rerender } = await render(<Shell />)
    element("sidebar-rail").click()
    await expect.poll(sidebarState).toBe("collapsed")
    await rerender(<Shell rail={false} />)
    expect(document.querySelector("[data-slot=sidebar-rail]")).toBeNull()
  })

  it("toggles with the modifier B shortcut", async () => {
    await render(<Shell />)
    await userEvent.keyboard(`{${modifier()}>}b{/${modifier()}}`)
    await expect.poll(sidebarState).toBe("collapsed")
    await userEvent.keyboard(`{${modifier()}>}b{/${modifier()}}`)
    await expect.poll(sidebarState).toBe("expanded")
  })

  it("follows a controlled open state", async () => {
    const onOpenChange = vi.fn()
    await render(<Controlled onOpenChange={onOpenChange} />)
    await expect.element(page.getByText("Collapsed on home")).toBeVisible()
    await expect.poll(gapWidth).toBe(48)
    await toggle().click()
    await expect.element(page.getByText("Expanded on home")).toBeVisible()
    await expect.poll(gapWidth).toBe(256)
    await navItem("Inbox").click()
    await expect.element(page.getByText("Expanded on inbox")).toBeVisible()
    expect(onOpenChange).toHaveBeenCalledTimes(1)
  })

  it("places the sidebar on the right", async () => {
    await render(<Shell side="right" />)
    await expect
      .poll(() => element("sidebar-container").getBoundingClientRect().right)
      .toBe(1280)
    expect(element("sidebar-inset").getBoundingClientRect().left).toBe(0)
  })

  it.each([
    ["floating", 8],
    ["inset", 8],
    ["sidebar", 0],
  ] as const)("pads the %s variant by %ipx", async (variant, inset) => {
    await render(<Shell variant={variant} />)
    await expect
      .poll(() => element("sidebar-inner").getBoundingClientRect().left)
      .toBe(inset)
  })
})

describe("AppShell on mobile", () => {
  it("swaps the sidebar for a tab bar", async () => {
    await page.viewport(390, 844)
    await render(<Shell />)
    await expect
      .element(page.getByRole("navigation", { name: "More" }))
      .toBeVisible()
    await expect.poll(tabs).toEqual(["Home", "Inbox", "Calendar", "Settings"])
    expect(current()).toEqual(["Home"])
    expect(document.querySelector("[data-slot=sidebar]")).toBeNull()
    await expect.element(toggle()).not.toBeInTheDocument()
    await expect
      .element(page.getByRole("heading", { name: "Page" }))
      .toBeVisible()
  })

  it("selects a tab and reports the change once", async () => {
    const onValueChange = vi.fn()
    await page.viewport(390, 844)
    await render(<Shell onValueChange={onValueChange} />)
    await navItem("Settings").click()
    await expect.poll(current).toEqual(["Settings"])
    await navItem("Settings").click()
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith("settings")
  })

  it("moves extra items behind the more button", async () => {
    const onValueChange = vi.fn()
    await page.viewport(390, 844)
    await render(
      <Shell
        items={manyItems}
        moreLabel="All pages"
        onValueChange={onValueChange}
      />
    )
    await expect
      .element(page.getByRole("navigation", { name: "All pages" }))
      .toBeVisible()
    const more = page.getByRole("button", { name: "All pages" })
    await expect.element(more).toHaveAttribute("aria-expanded", "false")
    await expect.poll(() => tabs().length).toBeLessThan(manyItems.length)
    const visible = tabs()
    expect(visible).toEqual(
      manyItems.slice(0, visible.length).map((item) => item.label)
    )
    await more.click()
    await expect.element(more).toHaveAttribute("aria-expanded", "true")
    const content = element("tab-bar-content")
    const overflow = Array.from(
      content.querySelectorAll<HTMLElement>("[data-slot=tab-bar-link]"),
      (item) => item.textContent
    )
    expect(overflow).toEqual(
      manyItems.slice(visible.length).map((item) => item.label)
    )
    await page.getByRole("button", { name: "Preferences" }).click()
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith("preferences")
    await expect.element(more).toHaveAttribute("aria-expanded", "false")
    await expect.poll(current).toContain("Preferences")
  })

  it("does not show the more button when every tab fits", async () => {
    await page.viewport(390, 844)
    await render(<Shell />)
    await expect.poll(tabs).toHaveLength(4)
    await expect
      .element(element("tab-bar-trigger"))
      .toHaveAttribute("aria-hidden", "true")
  })

  it("renders tab links for items with an href", async () => {
    await page.viewport(390, 844)
    await render(
      <Shell
        items={items.map((item) => ({ ...item, href: `#${item.value}` }))}
      />
    )
    await page.getByRole("link", { name: "Calendar" }).click()
    expect(window.location.hash).toBe("#calendar")
    await expect.poll(current).toEqual(["Calendar"])
  })

  it("disables tabs for disabled items", async () => {
    await page.viewport(390, 844)
    await render(
      <Shell
        items={[
          ...items.slice(0, 2),
          {
            value: "help",
            label: "Help",
            icon: <LifebuoyIcon />,
            disabled: true,
          },
        ]}
      />
    )
    await expect.element(navItem("Help")).toBeDisabled()
  })

  it("switches presentation when the viewport crosses the breakpoint", async () => {
    await render(<Shell defaultValue="inbox" />)
    await expect.element(navItem("Inbox")).toBeVisible()
    await page.viewport(390, 844)
    await expect
      .poll(() => document.querySelector("[data-slot=tab-bar]"))
      .not.toBeNull()
    expect(current()).toEqual(["Inbox"])
    await page.viewport(1280, 800)
    await expect
      .poll(() => document.querySelector("[data-slot=sidebar]"))
      .not.toBeNull()
    expect(current()).toEqual(["Inbox"])
  })
})
