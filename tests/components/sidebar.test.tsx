import { HouseIcon, TrayIcon } from "@phosphor-icons/react"
import * as React from "react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { isMacPlatform } from "@/hooks/use-platform"

const SKELETON_ROWS = ["a", "b", "c", "d", "e", "f", "g", "h"]

type SidebarProps = React.ComponentProps<typeof Sidebar>
type ProviderProps = React.ComponentProps<typeof SidebarProvider>

const trigger = () =>
  page.getByRole("button", { name: "Toggle Sidebar" }).first()
const rail = () => page.getByTitle("Toggle Sidebar")
const home = () => page.getByRole("link", { name: "Home" })
const inbox = () => page.getByRole("link", { name: "Inbox" })

function slot(name: string) {
  const node = document.querySelector<HTMLElement>(`[data-slot=${name}]`)
  if (!node) throw new Error(`${name} not rendered`)
  return node
}

const sidebar = () => slot("sidebar")
const container = () => slot("sidebar-container")
const gap = () => slot("sidebar-gap")
const inset = () => slot("sidebar-inset")

const frame = () =>
  new Promise<void>((resolve) => requestAnimationFrame(() => resolve()))

async function settled(element: () => HTMLElement) {
  let last = ""
  let still = 0
  while (still < 6) {
    await frame()
    const rect = element().getBoundingClientRect()
    const current = `${rect.left},${rect.right},${rect.width}`
    still = current === last ? still + 1 : 0
    last = current
  }
  return element().getBoundingClientRect()
}

const wait = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms))

function State() {
  const { state, open, openMobile, isMobile } = useSidebar()
  return (
    <output>
      {`${state} ${open ? "open" : "closed"} ${openMobile ? "mobile-open" : "mobile-closed"} ${isMobile ? "mobile" : "desktop"}`}
    </output>
  )
}

const state = () => page.getByRole("status").element().textContent ?? ""

function Shell({
  provider,
  ...props
}: SidebarProps & { provider?: Omit<ProviderProps, "children"> }) {
  return (
    <SidebarProvider {...provider}>
      <Sidebar {...props}>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    isActive
                    tooltip="Home"
                    render={<a href="#home" />}
                  >
                    <HouseIcon />
                    <span>Home</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Inbox"
                    render={<a href="#inbox" />}
                  >
                    <TrayIcon />
                    <span>Inbox</span>
                  </SidebarMenuButton>
                  <SidebarMenuBadge>12</SidebarMenuBadge>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <span>Projects</span>
                  </SidebarMenuButton>
                  <SidebarMenuAction showOnHover aria-label="More options" />
                  <SidebarMenuSub>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton href="#website" isActive>
                        <span>Website</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                    <SidebarMenuSubItem>
                      <SidebarMenuSubButton href="#mobile">
                        <span>Mobile</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  </SidebarMenuSub>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <SidebarTrigger />
        <State />
        <button type="button">Main content</button>
      </SidebarInset>
    </SidebarProvider>
  )
}

function Controlled({
  onOpenChange,
}: {
  onOpenChange: (open: boolean) => void
}) {
  const [open, setOpen] = React.useState(true)
  return (
    <>
      <button
        type="button"
        className="fixed top-4 right-4 z-50"
        onClick={() => setOpen(false)}
      >
        Collapse from outside
      </button>
      <Shell
        provider={{
          open,
          onOpenChange: (next) => {
            setOpen(next)
            onOpenChange(next)
          },
        }}
      />
    </>
  )
}

async function shortcut() {
  const modifier = isMacPlatform() ? "Meta" : "Control"
  await userEvent.keyboard(`{${modifier}>}b{/${modifier}}`)
}

beforeEach(async () => {
  await cookieStore.delete("sidebar_state")
})

afterEach(async () => {
  await cookieStore.delete("sidebar_state")
  await page.viewport(1280, 800)
})

describe("Sidebar on desktop", () => {
  it("starts expanded at full width", async () => {
    await render(<Shell />)
    await expect.element(home()).toBeVisible()
    expect(sidebar().dataset.state).toBe("expanded")
    expect(sidebar().dataset.collapsible).toBe("")
    const rect = await settled(container)
    expect([rect.left, rect.width]).toEqual([0, 256])
    expect(gap().getBoundingClientRect().width).toBe(256)
    expect(inset().getBoundingClientRect().left).toBe(256)
    expect(state()).toBe("expanded open mobile-closed desktop")
  })

  it("slides off screen when collapsed and back when expanded", async () => {
    await render(<Shell />)
    await trigger().click()
    await expect.poll(() => sidebar().dataset.state).toBe("collapsed")
    expect(sidebar().dataset.collapsible).toBe("offcanvas")
    const hidden = await settled(container)
    expect(hidden.right).toBe(0)
    expect(gap().getBoundingClientRect().width).toBe(0)
    expect(inset().getBoundingClientRect().left).toBe(0)
    await trigger().click()
    await expect.poll(() => sidebar().dataset.state).toBe("expanded")
    expect((await settled(container)).left).toBe(0)
  })

  it("starts collapsed with defaultOpen false", async () => {
    await render(<Shell provider={{ defaultOpen: false }} />)
    expect(sidebar().dataset.state).toBe("collapsed")
    expect((await settled(container)).right).toBe(0)
    expect(state()).toBe("collapsed closed mobile-closed desktop")
  })

  it("toggles with the keyboard shortcut", async () => {
    await render(<Shell />)
    await shortcut()
    await expect.poll(() => sidebar().dataset.state).toBe("collapsed")
    await shortcut()
    await expect.poll(() => sidebar().dataset.state).toBe("expanded")
  })

  it("ignores b without the modifier", async () => {
    await render(<Shell />)
    await userEvent.keyboard("b")
    const other = isMacPlatform() ? "Control" : "Alt"
    await userEvent.keyboard(`{${other}>}b{/${other}}`)
    await wait(100)
    expect(sidebar().dataset.state).toBe("expanded")
  })

  it("toggles from the rail", async () => {
    await render(<Shell />)
    await expect.element(rail()).toHaveAttribute("aria-label", "Toggle Sidebar")
    await expect.element(rail()).toHaveAttribute("tabindex", "-1")
    await rail().click()
    await expect.poll(() => sidebar().dataset.state).toBe("collapsed")
  })

  it("remembers the state in a cookie", async () => {
    await render(<Shell />)
    await trigger().click()
    await expect.poll(() => document.cookie).toContain("sidebar_state=false")
    await trigger().click()
    await expect.poll(() => document.cookie).toContain("sidebar_state=true")
  })

  it("follows a controlled open state", async () => {
    const onOpenChange = vi.fn()
    await render(<Controlled onOpenChange={onOpenChange} />)
    await page.getByRole("button", { name: "Collapse from outside" }).click()
    await expect.poll(() => sidebar().dataset.state).toBe("collapsed")
    expect(onOpenChange).not.toHaveBeenCalled()
    await trigger().click()
    await expect.poll(() => sidebar().dataset.state).toBe("expanded")
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it("stays put when a controlled parent ignores the change", async () => {
    const onOpenChange = vi.fn()
    await render(<Shell provider={{ open: true, onOpenChange }} />)
    await trigger().click()
    await shortcut()
    await wait(100)
    expect(onOpenChange.mock.calls).toEqual([[false], [false]])
    expect(sidebar().dataset.state).toBe("expanded")
  })

  it("calls the trigger's own click handler", async () => {
    const onClick = vi.fn()
    await render(
      <SidebarProvider>
        <Sidebar />
        <SidebarTrigger onClick={onClick} />
      </SidebarProvider>
    )
    await trigger().click()
    expect(onClick).toHaveBeenCalledTimes(1)
    await expect.poll(() => sidebar().dataset.state).toBe("collapsed")
  })
})

describe("Sidebar collapsing to icons", () => {
  it("shrinks to an icon rail and hides labels, badges and sub items", async () => {
    await render(<Shell collapsible="icon" />)
    await expect.element(page.getByText("12")).toBeVisible()
    await expect
      .element(page.getByRole("link", { name: "Website" }))
      .toBeVisible()
    await trigger().click()
    await expect.poll(() => sidebar().dataset.collapsible).toBe("icon")
    const rect = await settled(container)
    expect([rect.left, rect.width]).toEqual([0, 48])
    expect(gap().getBoundingClientRect().width).toBe(48)
    await expect.element(home()).toBeVisible()
    expect(home().element().getBoundingClientRect().width).toBe(32)
    await expect.element(page.getByText("12")).not.toBeVisible()
    await expect.element(page.getByText("Website")).not.toBeVisible()
    await expect.element(page.getByLabelText("More options")).not.toBeVisible()
    await expect
      .poll(
        () => getComputedStyle(page.getByText("Platform").element()).opacity
      )
      .toBe("0")
  })

  it("shows a tooltip only while collapsed", async () => {
    await render(<Shell collapsible="icon" />)
    await inbox().hover()
    await wait(900)
    await expect.element(page.getByRole("tooltip")).not.toBeInTheDocument()
    await page.getByRole("button", { name: "Main content" }).hover()
    await trigger().click()
    await settled(container)
    await inbox().hover()
    await expect
      .element(page.getByText("Inbox", { exact: true }).last())
      .toBeVisible()
    await expect
      .poll(
        () =>
          document.querySelector<HTMLElement>("[data-slot=tooltip-content]")
            ?.textContent
      )
      .toBe("Inbox")
    const edge = inbox().element().getBoundingClientRect().right
    await expect
      .poll(() => slot("tooltip-content").getBoundingClientRect().left)
      .toBeGreaterThan(edge)
  })

  it.each([
    ["floating", 66],
    ["inset", 66],
  ] as const)(
    "leaves room for the %s frame when collapsed",
    async (variant, width) => {
      await render(<Shell collapsible="icon" variant={variant} />)
      await trigger().click()
      await expect.poll(() => sidebar().dataset.collapsible).toBe("icon")
      expect((await settled(container)).width).toBe(width)
      expect(gap().getBoundingClientRect().width).toBe(64)
    }
  )

  it("frames the content in an inset card", async () => {
    await render(<Shell variant="inset" />)
    await settled(container)
    const main = inset().getBoundingClientRect()
    expect(main.left).toBe(256)
    expect(main.top).toBe(8)
    expect(getComputedStyle(inset()).borderTopLeftRadius).not.toBe("0px")
    await trigger().click()
    await settled(container)
    await expect.poll(() => inset().getBoundingClientRect().left).toBe(8)
  })

  it("floats the sidebar panel inside a padded frame", async () => {
    await render(<Shell variant="floating" />)
    await settled(container)
    const panel = slot("sidebar-inner").getBoundingClientRect()
    expect([panel.left, panel.top, panel.width]).toEqual([8, 8, 240])
  })
})

describe("Sidebar sides and modes", () => {
  it("sits on the right and slides off to the right", async () => {
    await render(<Shell side="right" />)
    const rect = await settled(container)
    expect(rect.right).toBe(window.innerWidth)
    expect(inset().getBoundingClientRect().right).toBe(window.innerWidth - 256)
    await trigger().click()
    expect((await settled(container)).left).toBe(window.innerWidth)
  })

  it("cannot be collapsed when collapsible is none", async () => {
    await render(<Shell collapsible="none" />)
    expect(sidebar().getBoundingClientRect().width).toBe(256)
    await trigger().click()
    await wait(300)
    expect(sidebar().getBoundingClientRect().width).toBe(256)
    await expect.element(home()).toBeVisible()
  })
})

describe("Sidebar menu items", () => {
  it("marks the active item and sub item", async () => {
    await render(<Shell />)
    await expect.element(home()).toHaveAttribute("data-active")
    await expect.element(inbox()).not.toHaveAttribute("data-active")
    await expect
      .element(page.getByRole("link", { name: "Website" }))
      .toHaveAttribute("data-active")
    await expect
      .element(page.getByRole("link", { name: "Mobile" }))
      .not.toHaveAttribute("data-active")
  })

  it("reveals the hover action when the item is hovered or focused", async () => {
    await render(<Shell />)
    const action = page.getByRole("button", { name: "More options" })
    expect(getComputedStyle(action.element()).opacity).toBe("0")
    await page.getByRole("button", { name: "Projects" }).hover()
    await expect
      .poll(() => getComputedStyle(action.element()).opacity)
      .toBe("1")
    await page.getByRole("button", { name: "Main content" }).hover()
    await expect
      .poll(() => getComputedStyle(action.element()).opacity)
      .toBe("0")
    page.getByRole("button", { name: "Projects" }).element().focus()
    await expect
      .poll(() => getComputedStyle(action.element()).opacity)
      .toBe("1")
  })

  it("draws skeleton rows between half and nine tenths wide", async () => {
    await render(
      <SidebarProvider>
        <Sidebar collapsible="none">
          <SidebarMenu>
            {SKELETON_ROWS.map((row) => (
              <SidebarMenuItem key={row}>
                <SidebarMenuSkeleton showIcon />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </Sidebar>
      </SidebarProvider>
    )
    const rows = document.querySelectorAll<HTMLElement>(
      "[data-slot=sidebar-menu-skeleton]"
    )
    expect(rows).toHaveLength(8)
    for (const row of rows) {
      const bar = row.lastElementChild as HTMLElement
      const percent = Number.parseInt(
        bar.style.getPropertyValue("--skeleton-width"),
        10
      )
      expect(percent).toBeGreaterThanOrEqual(50)
      expect(percent).toBeLessThan(90)
      expect(bar.getBoundingClientRect().width).toBeLessThan(
        row.getBoundingClientRect().width * 0.9
      )
      expect(row.querySelectorAll("[data-slot=skeleton]")).toHaveLength(2)
    }
  })
})

describe("Sidebar on mobile", () => {
  beforeEach(async () => {
    await page.viewport(390, 844)
  })

  it("hides the sidebar until the trigger opens it as a sheet", async () => {
    await render(<Shell />)
    await expect.poll(state).toBe("expanded open mobile-closed mobile")
    await expect.element(home()).not.toBeInTheDocument()
    await trigger().click()
    const sheet = page.getByRole("dialog", { name: "Sidebar" })
    await expect.element(sheet).toBeVisible()
    await expect
      .element(sheet)
      .toHaveAccessibleDescription("Displays the mobile sidebar.")
    await expect.element(home()).toBeVisible()
    await expect
      .poll(() => sheet.element().getBoundingClientRect().right)
      .toBeLessThan(390 - 80)
    await expect
      .poll(() => sheet.element().getBoundingClientRect().left)
      .toBe(8)
    expect(sheet.element().getAttribute("data-mobile")).toBe("true")
  })

  it("closes the sheet with Escape and returns focus to the trigger", async () => {
    await render(<Shell />)
    await expect.poll(state).toContain("mobile")
    await trigger().click()
    await expect.element(page.getByRole("dialog")).toBeVisible()
    await userEvent.keyboard("{Escape}")
    await expect.element(page.getByRole("dialog")).not.toBeInTheDocument()
    await expect.element(trigger()).toHaveFocus()
  })

  it("toggles the sheet with the shortcut without touching the desktop state", async () => {
    await render(<Shell />)
    await expect.poll(state).toContain(" mobile")
    await shortcut()
    await expect.element(page.getByRole("dialog")).toBeVisible()
    await shortcut()
    await expect.element(page.getByRole("dialog")).not.toBeInTheDocument()
    await page.viewport(1280, 800)
    await expect.poll(state).toBe("expanded open mobile-closed desktop")
  })

  it("opens from the right edge", async () => {
    await render(<Shell side="right" />)
    await expect.poll(state).toContain(" mobile")
    await trigger().click()
    const sheet = page.getByRole("dialog")
    await expect.element(sheet).toBeVisible()
    await expect
      .poll(() => Math.round(sheet.element().getBoundingClientRect().right))
      .toBe(390 - 8)
  })

  it("switches between the sheet and the inline sidebar on resize", async () => {
    await render(<Shell />)
    await expect.poll(state).toContain(" mobile")
    await page.viewport(1280, 800)
    await expect.poll(state).toContain("desktop")
    await expect.element(home()).toBeVisible()
    expect(sidebar().dataset.state).toBe("expanded")
  })
})
