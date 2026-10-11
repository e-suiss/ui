// @ts-nocheck
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
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, userEvent, waitFor } from "storybook/test"

import {
  AppShell,
  type AppShellItem,
  AppShellTrigger,
} from "@/components/patterns/app-shell"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { isMacPlatform } from "@/hooks/use-platform"

const items: AppShellItem[] = [
  {
    value: "home",
    label: "Home",
    icon: <HouseIcon />,
  },
  {
    value: "inbox",
    label: "Inbox",
    icon: <TrayIcon />,
    badge: 12,
  },
  {
    value: "calendar",
    label: "Calendar",
    icon: <CalendarBlankIcon />,
  },
  {
    value: "settings",
    label: "Settings",
    icon: <GearIcon />,
  },
]

const manyItems: AppShellItem[] = [
  {
    value: "home",
    label: "Home",
    icon: <HouseIcon />,
    group: "Platform",
  },
  {
    value: "inbox",
    label: "Inbox",
    icon: <TrayIcon />,
    badge: 12,
    group: "Platform",
  },
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
  {
    value: "team",
    label: "Team",
    icon: <UsersIcon />,
    group: "Workspace",
  },
  {
    value: "settings",
    label: "Settings",
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

const brand = (
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton size="lg">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-accent text-sm font-semibold text-on-accent">
          A
        </div>
        <span className="truncate font-medium">Acme Inc.</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
)

const account = (
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton size="lg">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-tertiary text-xs font-medium">
          JL
        </div>
        <div className="grid flex-1 text-start leading-tight">
          <span className="truncate text-sm font-medium">Jordan Lee</span>
          <span className="truncate text-xs text-label-secondary">
            jordan@acme.com
          </span>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
)

function Page({ title }: { title: string }) {
  return (
    <>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-separator px-4">
        <AppShellTrigger className="-ms-1" />
        <h1 className="text-base font-semibold">{title}</h1>
      </header>
      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          {["Revenue", "Active users", "Open issues"].map((label) => (
            <div
              key={label}
              className="flex h-20 flex-col justify-end rounded-2xl bg-surface-secondary p-3 md:aspect-video md:h-auto md:p-4"
            >
              <span className="text-sm text-label-secondary">{label}</span>
            </div>
          ))}
        </div>
        <div className="min-h-64 flex-1 rounded-2xl bg-surface-secondary" />
      </div>
    </>
  )
}

function ShellExample(args: React.ComponentProps<typeof AppShell>) {
  const [value, setValue] = React.useState(args.defaultValue ?? "home")
  const title = args.items.find((item) => item.value === value)?.label ?? ""

  return (
    <AppShell {...args} value={value} onValueChange={setValue}>
      <Page title={title} />
    </AppShell>
  )
}

const meta = {
  title: "Patterns/App Shell",
  component: AppShell,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story, { viewMode }) => (
      <div
        className={
          viewMode === "docs"
            ? "h-[32rem] transform-gpu overflow-hidden"
            : "min-h-svh"
        }
      >
        <Story />
      </div>
    ),
  ],
  args: { items },
  argTypes: {
    variant: { control: "select", options: ["sidebar", "floating", "inset"] },
    collapsible: { control: "select", options: ["offcanvas", "icon", "none"] },
    side: { control: "select", options: ["left", "right"] },
  },
  render: (args) => <ShellExample {...args} />,
} satisfies Meta<typeof AppShell>

export default meta

type Story = StoryObj<typeof meta>

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
}: Parameters<NonNullable<Story["play"]>>[0]) {
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

export const Default: Story = {
  play: async ({ canvas, canvasElement, step }) => {
    await step("starts on the first item", async () => {
      await expect(
        canvas.getByRole("heading", { level: 1, name: "Home" })
      ).toBeVisible()
      await expect(
        canvas.getByRole("button", { name: "Home" })
      ).toHaveAttribute("aria-current", "page")
    })

    await step("selecting an item switches the page", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Inbox" }))
      await expect(
        canvas.getByRole("heading", { level: 1, name: "Inbox" })
      ).toBeVisible()
      await expect(
        canvas.getByRole("button", { name: "Inbox" })
      ).toHaveAttribute("aria-current", "page")
      await expect(
        canvas.getByRole("button", { name: "Home" })
      ).not.toHaveAttribute("aria-current")
    })

    await step(
      "the header trigger collapses the sidebar to icons",
      async () => {
        const sidebar = sidebarOf(canvasElement)
        await expect(sidebar).toHaveAttribute("data-state", "expanded")
        const trigger = headerTrigger(canvasElement)
        await expect(trigger).toHaveAccessibleName("Toggle Sidebar")
        if (trigger) await userEvent.click(trigger)
        await expect(sidebar).toHaveAttribute("data-state", "collapsed")
        await expect(sidebar).toHaveAttribute("data-collapsible", "icon")
      }
    )

    await step("the keyboard shortcut expands it again", async () => {
      await pressSidebarHotkey()
      await expect(sidebarOf(canvasElement)).toHaveAttribute(
        "data-state",
        "expanded"
      )
    })
  },
}

export const WithHeaderAndFooter: Story = {
  args: { header: brand, footer: account },
  play: async (context) => {
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
  },
}

export const Grouped: Story = {
  args: { items: manyItems, header: brand, footer: account },
  play: async ({ canvas, step }) => {
    await step("shows the group labels and a disabled item", async () => {
      await expect(canvas.getByText("Platform")).toBeVisible()
      await expect(canvas.getByText("Workspace")).toBeVisible()
      await expect(
        canvas.getByRole("button", { name: "Support" })
      ).toBeDisabled()
    })

    await step("selects an item from the second group", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Team" }))
      await expect(
        canvas.getByRole("heading", { level: 1, name: "Team" })
      ).toBeVisible()
    })
  },
}

export const MoreTab: Story = {
  args: { items: manyItems, defaultValue: "team" },
  play: async ({ canvas, step }) => {
    await step("opens on the default item", async () => {
      await expect(
        canvas.getByRole("heading", { level: 1, name: "Team" })
      ).toBeVisible()
      await expect(
        canvas.getByRole("button", { name: "Team" })
      ).toHaveAttribute("aria-current", "page")
    })
  },
}

export const Links: Story = {
  args: {
    items: items.map((item) => ({ ...item, href: `#${item.value}` })),
  },
  play: async ({ canvas, step }) => {
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
  },
}

export const Floating: Story = {
  args: { variant: "floating", header: brand },
  play: async (context) => {
    await context.step("renders the floating variant", async () => {
      await expect(sidebarOf(context.canvasElement)).toHaveAttribute(
        "data-variant",
        "floating"
      )
    })

    await navigatesAndCollapses(context)
  },
}

export const Inset: Story = {
  args: { variant: "inset", header: brand },
  play: async (context) => {
    await context.step("renders the inset variant", async () => {
      await expect(sidebarOf(context.canvasElement)).toHaveAttribute(
        "data-variant",
        "inset"
      )
    })

    await navigatesAndCollapses(context)
  },
}

export const Collapsed: Story = {
  args: { defaultOpen: false, header: brand, footer: account },
  play: async ({ canvas, canvasElement, step }) => {
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
  },
}

export const Offcanvas: Story = {
  args: { collapsible: "offcanvas", header: brand },
  play: async ({ canvas, canvasElement, step }) => {
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
  },
}

export const RightSide: Story = {
  args: { side: "right", header: brand },
  play: async (context) => {
    await context.step("places the sidebar on the right", async () => {
      const sidebar = sidebarOf(context.canvasElement)
      await expect(sidebar).toHaveAttribute("data-side", "right")
      const home = context.canvas.getByRole("button", { name: "Home" })
      await expect(home.getBoundingClientRect().left).toBeGreaterThan(
        window.innerWidth / 2
      )
    })

    await navigatesAndCollapses(context)
  },
}
