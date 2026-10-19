import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function SidebarLoading() {
  return (
    <div className="h-[32rem] transform-gpu overflow-hidden [&_[data-slot=sidebar-container]]:h-full [&_[data-slot=sidebar-wrapper]]:min-h-full">
      <SidebarProvider>
        <Sidebar side="left" variant="sidebar" collapsible="icon">
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
