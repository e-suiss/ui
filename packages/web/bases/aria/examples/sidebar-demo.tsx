import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
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

export default function SidebarDemo() {
  return (
    <div className="h-[32rem] transform-gpu overflow-hidden [&_[data-slot=sidebar-container]]:h-full [&_[data-slot=sidebar-wrapper]]:min-h-full">
      <SidebarProvider>
        <Sidebar side="left" variant="sidebar" collapsible="icon">
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
                  <IconPlaceholder
                    lucide="ChevronsUpDownIcon"
                    tabler="IconSelector"
                    hugeicons="UnfoldMoreIcon"
                    phosphor="CaretUpDownIcon"
                    remixicon="RiExpandUpDownLine"
                    className="ms-auto"
                  />
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
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      isActive
                      tooltip="Home"
                      render={(props) => <a href="#home" {...props} />}
                    >
                      <IconPlaceholder
                        lucide="HouseIcon"
                        tabler="IconHome"
                        hugeicons="Home01Icon"
                        phosphor="HouseIcon"
                        remixicon="RiHomeLine"
                      />
                      <span>Home</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip="Inbox"
                      render={(props) => <a href="#inbox" {...props} />}
                    >
                      <IconPlaceholder
                        lucide="InboxIcon"
                        tabler="IconInbox"
                        hugeicons="InboxIcon"
                        phosphor="TrayIcon"
                        remixicon="RiInboxLine"
                      />
                      <span>Inbox</span>
                    </SidebarMenuButton>
                    <SidebarMenuBadge>12</SidebarMenuBadge>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip="Calendar"
                      render={(props) => <a href="#calendar" {...props} />}
                    >
                      <IconPlaceholder
                        lucide="CalendarIcon"
                        tabler="IconCalendar"
                        hugeicons="Calendar01Icon"
                        phosphor="CalendarBlankIcon"
                        remixicon="RiCalendarLine"
                      />
                      <span>Calendar</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip="Reports"
                      render={(props) => <a href="#reports" {...props} />}
                    >
                      <IconPlaceholder
                        lucide="ChartColumnIcon"
                        tabler="IconChartBar"
                        hugeicons="ChartColumnIcon"
                        phosphor="ChartBarIcon"
                        remixicon="RiBarChartLine"
                      />
                      <span>Reports</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Projects">
                      <IconPlaceholder
                        lucide="FolderIcon"
                        tabler="IconFolder"
                        hugeicons="Folder01Icon"
                        phosphor="FolderIcon"
                        remixicon="RiFolderLine"
                      />
                      <span>Projects</span>
                    </SidebarMenuButton>
                    <SidebarMenuAction showOnHover aria-label="More options">
                      <IconPlaceholder
                        lucide="EllipsisIcon"
                        tabler="IconDots"
                        hugeicons="MoreHorizontalIcon"
                        phosphor="DotsThreeIcon"
                        remixicon="RiMoreLine"
                      />
                    </SidebarMenuAction>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="#" isActive>
                          <span>Website redesign</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="#">
                          <span>Mobile app</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="#">
                          <span>Q3 planning</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
              <SidebarGroupAction aria-label="Add member">
                <IconPlaceholder
                  lucide="PlusIcon"
                  tabler="IconPlus"
                  hugeicons="PlusSignIcon"
                  phosphor="PlusIcon"
                  remixicon="RiAddLine"
                />
              </SidebarGroupAction>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip="Team"
                      render={(props) => <a href="#team" {...props} />}
                    >
                      <IconPlaceholder
                        lucide="UsersIcon"
                        tabler="IconUsers"
                        hugeicons="UserGroupIcon"
                        phosphor="UsersIcon"
                        remixicon="RiGroupLine"
                      />
                      <span>Team</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip="Settings"
                      render={(props) => <a href="#settings" {...props} />}
                    >
                      <IconPlaceholder
                        lucide="SettingsIcon"
                        tabler="IconSettings"
                        hugeicons="Settings01Icon"
                        phosphor="GearIcon"
                        remixicon="RiSettingsLine"
                      />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      tooltip="Support"
                      render={(props) => <a href="#support" {...props} />}
                    >
                      <IconPlaceholder
                        lucide="LifeBuoyIcon"
                        tabler="IconLifebuoy"
                        hugeicons="LifebuoyIcon"
                        phosphor="LifebuoyIcon"
                        remixicon="RiLifebuoyLine"
                      />
                      <span>Support</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
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
                  <IconPlaceholder
                    lucide="ChevronsUpDownIcon"
                    tabler="IconSelector"
                    hugeicons="UnfoldMoreIcon"
                    phosphor="CaretUpDownIcon"
                    remixicon="RiExpandUpDownLine"
                    className="ms-auto"
                  />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
          <SidebarRail />
        </Sidebar>
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
              <div className="bg-muted flex aspect-video flex-col justify-end rounded-2xl p-4">
                <span className="text-muted-foreground text-sm">Revenue</span>
              </div>
              <div className="bg-muted flex aspect-video flex-col justify-end rounded-2xl p-4">
                <span className="text-muted-foreground text-sm">
                  Active users
                </span>
              </div>
              <div className="bg-muted flex aspect-video flex-col justify-end rounded-2xl p-4">
                <span className="text-muted-foreground text-sm">
                  Open issues
                </span>
              </div>
            </div>
            <div className="bg-muted min-h-64 flex-1 rounded-2xl" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
