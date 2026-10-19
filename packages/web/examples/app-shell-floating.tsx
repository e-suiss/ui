import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
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

const brand = (
  <SidebarMenu>
    <SidebarMenuItem>
      <SidebarMenuButton size="lg">
        <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-primary-foreground">
          A
        </div>
        <span className="truncate font-medium">Acme Inc.</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  </SidebarMenu>
)

export default function AppShellFloating() {
  const [value, setValue] = React.useState("home")
  const title = items.find((item) => item.value === value)?.label ?? ""

  return (
    <div className="min-h-svh">
      <AppShell
        items={items}
        variant="floating"
        header={brand}
        value={value}
        onValueChange={setValue}
      >
        <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border px-4">
          <AppShellTrigger className="-ms-1" />
          <h1 className="text-base font-semibold">{title}</h1>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            <div className="flex h-20 flex-col justify-end rounded-2xl bg-muted p-3 md:aspect-video md:h-auto md:p-4">
              <span className="text-sm text-muted-foreground">Revenue</span>
            </div>
            <div className="flex h-20 flex-col justify-end rounded-2xl bg-muted p-3 md:aspect-video md:h-auto md:p-4">
              <span className="text-sm text-muted-foreground">
                Active users
              </span>
            </div>
            <div className="flex h-20 flex-col justify-end rounded-2xl bg-muted p-3 md:aspect-video md:h-auto md:p-4">
              <span className="text-sm text-muted-foreground">Open issues</span>
            </div>
          </div>
          <div className="min-h-64 flex-1 rounded-2xl bg-muted" />
        </div>
      </AppShell>
    </div>
  )
}
