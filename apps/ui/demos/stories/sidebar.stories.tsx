// @ts-nocheck
import {
  CalendarBlankIcon,
  CaretUpDownIcon,
  ChartBarIcon,
  DotsThreeIcon,
  FolderIcon,
  GearIcon,
  HouseIcon,
  LifebuoyIcon,
  PlusIcon,
  TrayIcon,
  UsersIcon,
} from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor } from "storybook/test"

import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
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
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const mainNav = [
  { title: "Home", icon: HouseIcon, active: true },
  { title: "Inbox", icon: TrayIcon, badge: "12" },
  { title: "Calendar", icon: CalendarBlankIcon },
  { title: "Reports", icon: ChartBarIcon },
]

const projects = ["Website redesign", "Mobile app", "Q3 planning"]

const workspaceNav = [
  { title: "Team", icon: UsersIcon },
  { title: "Settings", icon: GearIcon },
  { title: "Support", icon: LifebuoyIcon },
]

type SidebarArgs = React.ComponentProps<typeof Sidebar>

function AppSidebar(props: SidebarArgs) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="bg-accent text-on-accent flex size-8 shrink-0 items-center justify-center rounded-xl text-sm font-semibold">
                A
              </div>
              <div className="grid flex-1 text-start leading-tight">
                <span className="truncate font-medium">Acme Inc.</span>
                <span className="text-label/70 truncate text-xs">Pro plan</span>
              </div>
              <CaretUpDownIcon className="ms-auto" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarInput placeholder="Search" aria-label="Search" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    isActive={item.active}
                    tooltip={item.title}
                    render={<a href={`#${item.title.toLowerCase()}`} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.badge && (
                    <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Projects">
                  <FolderIcon />
                  <span>Projects</span>
                </SidebarMenuButton>
                <SidebarMenuAction showOnHover aria-label="More options">
                  <DotsThreeIcon />
                </SidebarMenuAction>
                <SidebarMenuSub>
                  {projects.map((project, index) => (
                    <SidebarMenuSubItem key={project}>
                      <SidebarMenuSubButton href="#" isActive={index === 0}>
                        <span>{project}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupAction aria-label="Add member">
            <PlusIcon />
          </SidebarGroupAction>
          <SidebarGroupContent>
            <SidebarMenu>
              {workspaceNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    render={<a href={`#${item.title.toLowerCase()}`} />}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <div className="bg-surface-secondary flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                JL
              </div>
              <div className="grid flex-1 text-start leading-tight">
                <span className="truncate font-medium">Jordan Lee</span>
                <span className="text-label/70 truncate text-xs">
                  jordan@acme.com
                </span>
              </div>
              <CaretUpDownIcon className="ms-auto" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

function AppShell({
  defaultOpen = true,
  sidebar,
  ...props
}: SidebarArgs & { defaultOpen?: boolean; sidebar?: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      {sidebar ?? <AppSidebar {...props} />}
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ms-1" />
          <Separator orientation="vertical" className="me-2 h-4" />
          <span className="text-label-secondary text-sm">Platform</span>
          <span className="text-label-secondary text-sm">/</span>
          <span className="text-sm font-medium">Home</span>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid gap-4 md:grid-cols-3">
            {["Revenue", "Active users", "Open issues"].map((label) => (
              <div
                key={label}
                className="bg-surface-secondary flex aspect-video flex-col justify-end rounded-2xl p-4"
              >
                <span className="text-label-secondary text-sm">{label}</span>
              </div>
            ))}
          </div>
          <div className="bg-surface-secondary min-h-64 flex-1 rounded-2xl" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

const meta = {
  title: "Components/Sidebar",
  component: Sidebar,
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
  args: {
    side: "left",
    variant: "sidebar",
    collapsible: "icon",
  },
  argTypes: {
    side: {
      control: "select",
      options: ["left", "right"],
    },
    variant: {
      control: "select",
      options: ["sidebar", "floating", "inset"],
    },
    collapsible: {
      control: "select",
      options: ["offcanvas", "icon", "none"],
    },
  },
} satisfies Meta<typeof Sidebar>

export default meta

type Story = StoryObj<typeof meta>

function bySlot(canvasElement: HTMLElement, slot: string) {
  const element = canvasElement.querySelector<HTMLElement>(
    `[data-slot="${slot}"]`
  )
  if (!element) throw new Error(`${slot} not rendered`)
  return element
}

function sidebarElement(canvasElement: HTMLElement) {
  return bySlot(canvasElement, "sidebar")
}

export const Default: Story = {
  render: (args) => <AppShell {...args} />,
  play: async ({ canvas, canvasElement, step }) => {
    const sidebar = sidebarElement(canvasElement)
    const trigger = bySlot(canvasElement, "sidebar-trigger")

    await step("renders the navigation expanded", async () => {
      await expect(sidebar).toHaveAttribute("data-state", "expanded")
      await expect(canvas.getByRole("link", { name: "Home" })).toHaveAttribute(
        "data-active"
      )
      await expect(canvas.getByText("12")).toBeVisible()
    })

    await step("collapses to icons from the trigger", async () => {
      await userEvent.click(trigger)
      await expect(sidebar).toHaveAttribute("data-state", "collapsed")
      await expect(sidebar).toHaveAttribute("data-collapsible", "icon")
    })

    await step("shows a tooltip for an icon while collapsed", async () => {
      await userEvent.hover(canvas.getByRole("link", { name: "Inbox" }))
      await waitFor(() =>
        expect(
          document.querySelector('[data-slot="tooltip-content"]')
        ).toHaveTextContent("Inbox")
      )
      await userEvent.unhover(canvas.getByRole("link", { name: "Inbox" }))
    })

    await step("expands again with the keyboard shortcut", async () => {
      await userEvent.keyboard("{Control>}b{/Control}{Meta>}b{/Meta}")
      await expect(sidebar).toHaveAttribute("data-state", "expanded")
    })
  },
}

async function collapsesAndExpands(
  { canvas, canvasElement, step }: Parameters<NonNullable<Story["play"]>>[0],
  variant: string
) {
  const sidebar = sidebarElement(canvasElement)

  await step(`renders the ${variant} variant expanded`, async () => {
    await expect(sidebar).toHaveAttribute("data-variant", variant)
    await expect(sidebar).toHaveAttribute("data-state", "expanded")
    await expect(canvas.getByRole("link", { name: "Home" })).toBeVisible()
  })

  await step("collapses to icons from the trigger", async () => {
    await userEvent.click(bySlot(canvasElement, "sidebar-trigger"))
    await expect(sidebar).toHaveAttribute("data-state", "collapsed")
    await expect(sidebar).toHaveAttribute("data-collapsible", "icon")
  })

  await step("expands again from the rail", async () => {
    await userEvent.click(bySlot(canvasElement, "sidebar-rail"))
    await expect(sidebar).toHaveAttribute("data-state", "expanded")
  })
}

export const RightToLeft: Story = {
  globals: { direction: "rtl" },
  render: (args) => <AppShell {...args} />,
  play: async ({ canvasElement, step }) => {
    const container = bySlot(canvasElement, "sidebar-container")
    const inset = bySlot(canvasElement, "sidebar-inset")

    await step(
      "puts the sidebar on the right next to the content",
      async () => {
        await waitFor(() =>
          expect(container.getBoundingClientRect().right).toBeCloseTo(
            document.documentElement.clientWidth,
            0
          )
        )
        await expect(inset.getBoundingClientRect().right).toBeLessThanOrEqual(
          container.getBoundingClientRect().left + 1
        )
      }
    )
  },
}

export const Floating: Story = {
  args: { variant: "floating" },
  render: Default.render,
  play: (context) => collapsesAndExpands(context, "floating"),
}

export const Inset: Story = {
  args: { variant: "inset" },
  render: Default.render,
  play: (context) => collapsesAndExpands(context, "inset"),
}

export const Collapsed: Story = {
  render: (args) => <AppShell {...args} defaultOpen={false} />,
  play: async ({ canvasElement, step }) => {
    const sidebar = sidebarElement(canvasElement)

    await step("starts collapsed and expands from the rail", async () => {
      await expect(sidebar).toHaveAttribute("data-state", "collapsed")
      await userEvent.click(bySlot(canvasElement, "sidebar-rail"))
      await expect(sidebar).toHaveAttribute("data-state", "expanded")
    })
  },
}

export const Offcanvas: Story = {
  args: { collapsible: "offcanvas" },
  render: Default.render,
  play: async ({ canvasElement, step }) => {
    const sidebar = sidebarElement(canvasElement)

    await step("slides fully off canvas when collapsed", async () => {
      await userEvent.click(bySlot(canvasElement, "sidebar-trigger"))
      await expect(sidebar).toHaveAttribute("data-collapsible", "offcanvas")
    })
  },
}

export const RightSide: Story = {
  args: { side: "right" },
  render: Default.render,
  play: async ({ canvasElement, step }) => {
    await step("places the sidebar on the right", async () => {
      await expect(sidebarElement(canvasElement)).toHaveAttribute(
        "data-side",
        "right"
      )
    })
  },
}

export const Loading: Story = {
  render: (args) => (
    <AppShell
      sidebar={
        <Sidebar {...args}>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuSkeleton showIcon />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Platform</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {Array.from({ length: 6 }, (_, index) => (
                    <SidebarMenuItem key={index}>
                      <SidebarMenuSkeleton showIcon />
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      }
    />
  ),
  play: async ({ canvas, canvasElement, step }) => {
    await step("renders placeholders instead of links", async () => {
      await expect(
        canvasElement.querySelectorAll('[data-slot="sidebar-menu-skeleton"]')
      ).toHaveLength(7)
      await expect(canvas.queryAllByRole("link")).toHaveLength(0)
    })
  },
}
