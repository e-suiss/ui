import type { Meta, StoryObj } from "@storybook/react-vite"
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
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-xl text-sm font-semibold">
                A
              </div>
              <div className="grid flex-1 text-start leading-tight">
                <span className="truncate font-medium">Acme Inc.</span>
                <span className="text-sidebar-foreground/70 truncate text-xs">
                  Pro plan
                </span>
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
                    render={<a href="#" />}
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
                    render={<a href="#" />}
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
              <div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                JL
              </div>
              <div className="grid flex-1 text-start leading-tight">
                <span className="truncate font-medium">Jordan Lee</span>
                <span className="text-sidebar-foreground/70 truncate text-xs">
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
          <span className="text-muted-foreground text-sm">Platform</span>
          <span className="text-muted-foreground text-sm">/</span>
          <span className="text-sm font-medium">Home</span>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid gap-4 md:grid-cols-3">
            {["Revenue", "Active users", "Open issues"].map((label) => (
              <div
                key={label}
                className="bg-muted flex aspect-video flex-col justify-end rounded-2xl p-4"
              >
                <span className="text-muted-foreground text-sm">{label}</span>
              </div>
            ))}
          </div>
          <div className="bg-muted min-h-64 flex-1 rounded-2xl" />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

const meta = {
  title: "Components/Sidebar",
  component: Sidebar,
  parameters: { layout: "fullscreen" },
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

export const Default: Story = {
  render: (args) => <AppShell {...args} />,
}

export const Floating: Story = {
  ...Default,
  args: { variant: "floating" },
}

export const Inset: Story = {
  ...Default,
  args: { variant: "inset" },
}

export const Collapsed: Story = {
  render: (args) => <AppShell {...args} defaultOpen={false} />,
}

export const Offcanvas: Story = {
  ...Default,
  args: { collapsible: "offcanvas" },
}

export const RightSide: Story = {
  ...Default,
  args: { side: "right" },
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
}
