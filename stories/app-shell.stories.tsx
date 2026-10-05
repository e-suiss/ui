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

export const Default: Story = {}

export const WithHeaderAndFooter: Story = {
  args: { header: brand, footer: account },
}

export const Grouped: Story = {
  args: { items: manyItems, header: brand, footer: account },
}

export const MoreTab: Story = {
  args: { items: manyItems, defaultValue: "team" },
}

export const Links: Story = {
  args: {
    items: items.map((item) => ({ ...item, href: `#${item.value}` })),
  },
}

export const Floating: Story = {
  args: { variant: "floating", header: brand },
}

export const Inset: Story = {
  args: { variant: "inset", header: brand },
}

export const Collapsed: Story = {
  args: { defaultOpen: false, header: brand, footer: account },
}

export const Offcanvas: Story = {
  args: { collapsible: "offcanvas", header: brand },
}

export const RightSide: Story = {
  args: { side: "right", header: brand },
}
