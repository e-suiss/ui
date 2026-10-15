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
              <div className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-xl text-sm font-semibold">
                A
              </div>
              <div className="grid flex-1 text-start leading-tight">
                <span className="truncate font-medium">Acme Inc.</span>
                <span className="text-foreground/70 truncate text-xs">
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
              <div className="bg-muted flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-medium">
                JL
              </div>
              <div className="grid flex-1 text-start leading-tight">
                <span className="truncate font-medium">Jordan Lee</span>
                <span className="text-foreground/70 truncate text-xs">
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
          <Separator
            orientation="vertical"
            className="me-2 data-vertical:h-4 data-vertical:self-center"
          />
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

export default function SidebarFloating() {
  return (
    <div className="h-[32rem] transform-gpu overflow-hidden [&_[data-slot=sidebar-container]]:h-full [&_[data-slot=sidebar-wrapper]]:min-h-full">
      <AppShell side="left" variant="floating" collapsible="icon" />
    </div>
  )
}
